// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../contracts/PBMatchupsMarket.sol";
import "../contracts/PBTeams.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../contracts/PBMatchupValidation.sol";

contract PBMatchups is ERC721 {
    
    address admin;
    address matchupsMarket;
    address feesAddress;
    uint maxOpScore = 397;
    uint maxDpScore = 447;
    uint nonce = 0;
    uint bellCurveIterations = 4;
    uint OPmin = 150;
    uint DPmin = 175;
    uint GPmin = 75;
    uint GPmax = 99;
    uint pointsMax = 447;
    uint controlNumber = 224;
    uint opportunityAdjust = 10;
    uint feePercent = 10; // 100 is 1%, 10 is 0.1%, 1 is 0.01%
    uint activeMatches = 0;
    using Counters for Counters.Counter;
    Counters.Counter private _matchupsCreated;
    Counters.Counter private _matchupsCompleted;
    IERC20 public buddies;
    PBTeams public pbTeams;
    PBMatchupsMarket public pbMatchupsMarket;
    PBMatchupValidation public pbMatchupValidation;

    
event NewMatchup(uint id, uint teamId, uint t1stats, uint t2stats, uint t1AttackBP, uint t2AttackBP, uint oddsMod, uint result, bool isWinner);
    
struct Matchup{
        uint matchId;
        address creator;
        address challenger;
        bool active;
        uint teamId;
        uint teamDna;
        uint timestamp;
        uint t1OStats;
        uint t1DStats;
        uint t2OStats;
        uint t2DStats;
        bool creatorIsWinner;
        uint buddiesAmount;
    }
    
    uint nextId = 0;
    
    mapping (uint => Matchup) private _matchupDetails;

    event winResult(bool creatorIswinner, uint prize, uint t1OStats, uint t1DStats, uint t2OStats, uint t2DStats, uint winningBp, uint randResult);
    
    constructor(address _buddiesCoinAddress, address _feesAddress, address _pbTeamsAddress, address _pbMatchupValidationAddress) ERC721("Puck Buddies Matchup", "PBM") {
        admin = msg.sender;
        feesAddress = _feesAddress;
        buddies = IERC20(_buddiesCoinAddress);
        pbTeams = PBTeams(_pbTeamsAddress);
        pbMatchupValidation = PBMatchupValidation(_pbMatchupValidationAddress);
    }
    
    modifier onlyAdmin() {
        require(admin == msg.sender, "This function is only accessable by the admin of the contract" );
        _;
    }
    
    function isAdmin() public view returns (bool){
        if(admin == msg.sender){
            return true;
        } else return false;
    }

    function getPbMatchupsAddress() public view returns (address){
        return address(this);
    }

    function updateMatchupsMarketAddress(address _pbMatchupsMarketAddress) external onlyAdmin {
        pbMatchupsMarket = PBMatchupsMarket(_pbMatchupsMarketAddress);
        matchupsMarket = _pbMatchupsMarketAddress;
    }

    function updateBuddiesCoinAddress(address _buddiesCoinAddress) external onlyAdmin {
        buddies = IERC20(_buddiesCoinAddress);
    } 

    function updatePBMatchupValidationAddress(address _pbMatchupValidationAddress) external onlyAdmin {
        pbMatchupValidation = PBMatchupValidation(_pbMatchupValidationAddress);
    }

    function getFeePercent() public view returns(uint){
        return feePercent;
    }

    function updateFeePercent(uint newFee) external onlyAdmin {
        feePercent = newFee;
    }

    function getAllTokensForUser(address user) public view returns (uint256[] memory){
        uint256 tokenCount = balanceOf(user);
        if(tokenCount == 0){
            return new uint256[](0);
        }
        else{
            uint[] memory result = new uint256[](tokenCount);
            uint256 totalMatches = nextId;
            uint256 resultIndex = 0;
            uint256 i;
            for(i = 0; i < totalMatches; i++){
                if(ownerOf(i) == user){
                    result[resultIndex] = i;
                    resultIndex++;
                }
                
            }
            return result;
        }
    }

    //Dont delete this code yet. Use PBProShop getProShopMarketPlaceItems to refactor the code above

    // function getAllValidTokens() public view returns (uint256[] memory){
    //     uint tokenCount = _matchupsCreated.current() - _matchupsCompleted.current();
    //     if(tokenCount == 0){
    //         return new uint256[](0);
    //     }
    //     else{
    //         uint[] memory result = new uint256[](tokenCount);
    //         uint256 totalMatches = nextId;
    //         uint256 resultIndex = 0;
    //         for(uint i = 0; i < totalMatches; i++){
    //             if(_matchupDetails[i+1].active == true){
    //                 result[resultIndex] = i;
    //                 resultIndex++;
    //             }
                
    //         }
    //         return result;
    //     }
    // }

    function getTokenDetails(uint tokenId) public view returns (Matchup memory){
        return _matchupDetails[tokenId];
    }

    function createMatchup(uint teamId, uint buddiesSent) public {
        //require(pbMatchupValidation.varifyPlayerAgesOnTeam(teamId) == true, "N6");
        uint allowance = buddies.allowance(msg.sender, address(this));
        require(allowance >= buddiesSent);
        _matchupsCreated.increment();
        uint teamDna = pbTeams.getTokenDetails(teamId).teamDna;
        uint teamOp = pbTeams.getTokenDetails(teamId).teamTotalOP;
        uint teamDp = pbTeams.getTokenDetails(teamId).teamTotalDP;
        buddies.transferFrom(msg.sender, address(this), buddiesSent);
        buddies.approve(address(this), buddiesSent);
        _matchupDetails[nextId] = Matchup(
                            nextId,
                            msg.sender,
                            0x0000000000000000000000000000000000000000,
                            true,
                            teamId,
                            teamDna,
                            block.timestamp,
                            teamOp,
                            teamDp,
                            0,
                            0,
                            false,
                            buddiesSent
                            );

        _safeMint(matchupsMarket, nextId);
        setApprovalForAll(matchupsMarket, true);
        nextId++;      
    }

    function PvPHitTheIce(uint buddiesSent, uint pvpmatchupId, uint chalTeamId, uint[] memory playerIdArray) public {
        //require(pbMatchupValidation.varifyPlayerAgesOnTeam(chalTeamId) == true, "N6");
        uint allowance = buddies.allowance(msg.sender, address(this));
        require(allowance >= buddiesSent, "N1");
        Matchup storage pvpMatchup = _matchupDetails[pvpmatchupId];
        require(pbMatchupValidation.varifyPlayerAgesOnTeam(pvpMatchup.teamId, playerIdArray) == true, "N6");
        require(pvpMatchup.active == true,"N2");
        require(pvpMatchup.buddiesAmount == buddiesSent,"N5");
        buddies.transferFrom(msg.sender, address(this), buddiesSent);
        buddies.approve(address(this), buddiesSent);
        pvpMatchup.challenger = msg.sender;
        pvpMatchup.t2OStats = pbTeams.getTokenDetails(chalTeamId).teamTotalOP;
        pvpMatchup.t2DStats = pbTeams.getTokenDetails(chalTeamId).teamTotalDP;
        uint winningBp = getWinningBP(pvpMatchup.t1OStats, pvpMatchup.t1DStats, pvpMatchup.t2OStats, pvpMatchup.t2DStats);
        uint randResult = generateResult();
        uint prize;
        if(randResult >= winningBp){
            pvpMatchup.creatorIsWinner = true;
            prize = ((pvpMatchup.buddiesAmount *2)*((10000-feePercent))/10000);
            buddies.transfer(pvpMatchup.creator, prize);
            buddies.transfer(feesAddress, (pvpMatchup.buddiesAmount *2) - (prize));             
        }else if(randResult < winningBp){
            pvpMatchup.creatorIsWinner = false;
            prize = ((pvpMatchup.buddiesAmount *2)*((10000-feePercent))/10000);
            buddies.transfer(pvpMatchup.challenger, prize);
            buddies.transfer(feesAddress, (pvpMatchup.buddiesAmount *2) - (prize));
        }
        _matchupsCompleted.increment();
        pvpMatchup.active = false; 
        emit winResult(pvpMatchup.creatorIsWinner, prize, pvpMatchup.t1OStats, pvpMatchup.t1DStats, pvpMatchup.t2OStats, pvpMatchup.t2DStats, winningBp, randResult);
    }
    
    function getWinningBP(uint pOP, uint pDP, uint cOP, uint cDP) public view returns (uint){
     uint pOPpercent = (pOP*10000)/maxOpScore;
     uint pDPpercent = (pDP*10000)/maxDpScore;
     uint cOPpercent = (((maxOpScore-cOP)*10000)/maxOpScore);
     uint cDPpercent = (((maxDpScore-cDP)*10000)/maxDpScore);
     uint pBP = (pOPpercent+pDPpercent)/2;
     uint cBP = (cOPpercent+cDPpercent)/2;
     uint winningBreakPoint = (pBP+cBP)/2;
     return winningBreakPoint;
}

    function generateResult() public view returns (uint){
        uint operator;
        uint i;
        for(i = 0; i < bellCurveIterations; i++){
            operator = operator + (uint(keccak256(abi.encodePacked(i, nonce, block.timestamp, msg.sender))) % 10000);
        }
        uint result = operator/bellCurveIterations;
        return result;
    }

    function generateRandomStat(uint mod) private view returns (uint) {
        uint operator = 0;
        uint i;
        for( i = 0; i < bellCurveIterations; i++) {
            operator = operator + (uint(keccak256(abi.encodePacked(i, block.timestamp,  msg.sender))) % mod);
        }
        uint result = operator/bellCurveIterations;
        return result;
    }

    function cancelMatchup(uint matchId) public {
        Matchup storage pvpMatchup = _matchupDetails[matchId];
        require (_matchupDetails[matchId].creator == msg.sender, "Only the creator of this matchup can cancel it");
         buddies.transfer(msg.sender, _matchupDetails[matchId].buddiesAmount);
         _matchupsCompleted.increment();
         pvpMatchup.active = false;
    }
    
}