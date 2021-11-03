// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../contracts/PBTeams.sol";
import "../contracts/PBProShopFactory.sol";
import "../contracts/PBPlayerMarketplace.sol";
import "../contracts/PBXP.sol";

contract PBPlayers is ERC721 {

    address admin;
    address pbTeamsAddress;
    address pbxpAddress;
    uint mintCost1;
    uint mintCost2;
    uint mintCost3;
    address marketplaceAddress;
    address proshopAddress;
    uint dnaDigits = 28;
    uint dnaModulus = 10 ** dnaDigits;
    uint bellCurveIterations = 4;
    uint ageoutSeconds;
    
    IERC20 public buddies;
    PBProShopFactory public pbProShopFactory;
    PBTeams public pbTeams;
    PBPlayerMarketplace public pbPlayerMarketplace;
    PBXP public pbxp;
    

    struct Player{
        uint offence;
        uint defence;
        uint dna;
        uint playertype;
        uint teamId;
        uint teamDna;
        uint position;
        uint mainColor;
        uint ageoutTimestamp;
        uint draftTimestamp;
        uint equippedJersey;
        uint equippedToken;
    }

    uint nextId = 0;


    mapping (uint => Player ) public _tokenDetails;

    constructor(address _buddiesCoinAddress, uint _mintCost1, uint _mintCost2, uint _mintCost3, uint _ageoutSeconds) ERC721("Pixel Puck Player", "PPP"){
        admin = msg.sender;
        buddies = IERC20(_buddiesCoinAddress);
        mintCost1 = _mintCost1;
        mintCost2 = _mintCost2;
        mintCost3 = _mintCost3;
        ageoutSeconds = _ageoutSeconds;
    }

    modifier onlyAdmin() {
        require(admin == msg.sender, "A1" );
        _;
    }

    modifier onlyTeams() {
        require(pbTeamsAddress == msg.sender, "T1" );
        _;
    }

    modifier onlyPBXP() {
        require(pbxpAddress == msg.sender, "X1" );
        _;
    }

    function isAdmin() public view returns (bool){
        if(admin == msg.sender){
            return true;
        } else return false;
    }

    function getPBPlayersAddress() public view returns(address){
        return address(this);
    }
    
    function updateBuddiesCoinAddress(address _buddiesCoinAddress) onlyAdmin external {
        buddies = IERC20(_buddiesCoinAddress);
    }

    function updatePBTeamsAddress(address _pbTeamsAddress) external onlyAdmin {
        pbTeams = PBTeams(_pbTeamsAddress);
        pbTeamsAddress = _pbTeamsAddress;
    }

    function updatePBProShopFactoryAddress(address _proshopAddress) external onlyAdmin {
        pbProShopFactory = PBProShopFactory(_proshopAddress);
    }

    function updatePBPlayerMarketplaceAddress(address _pbPlayerMarketplaceAddress) external onlyAdmin {
        pbPlayerMarketplace = PBPlayerMarketplace(_pbPlayerMarketplaceAddress);
    }

    function updatePBXPaddress(address _pbxpAddress) external onlyAdmin {
        pbxp = PBXP(_pbxpAddress);
        pbxpAddress = _pbxpAddress;
    }

    function updateVariables(uint _mintCost1, uint _mintCost2, uint _mintCost3, uint _ageoutSeconds) external onlyAdmin {
        mintCost1 = _mintCost1;
        mintCost2 = _mintCost2;
        mintCost3 = _mintCost3;
        ageoutSeconds = _ageoutSeconds;
    }

    function getMintingCosts() public view returns (uint, uint, uint){
            return (mintCost1, mintCost2, mintCost3);
    }

    function getNextId() public view returns (uint){
        return nextId;
    }

    function getTokenDetails(uint tokenId) public view returns (Player memory){
        return _tokenDetails[tokenId];
    }

    function mintPlayer(uint value, uint playerType) external {
        if(nextId == 0){
            require(msg.sender == admin, "A1");
        }
        uint allowance = buddies.allowance(msg.sender, address(this));
        require(allowance >= value, "B1");
        buddies.transferFrom(msg.sender, address(this), value);
        if(playerType == 1){
            _tokenDetails[nextId] = Player(_generateRandAtrrib(msg.sender, 50, 50, _randHelper(1)), _generateRandAtrrib(msg.sender, 50, 0, _randHelper(2)), _generateRandDna(msg.sender, _randHelper(1)), playerType, 0,0,0,0,block.timestamp + ageoutSeconds,block.timestamp,0,0);
        }else if(playerType == 2){
             _tokenDetails[nextId] = Player(_generateRandAtrrib(msg.sender, 50, 0, _randHelper(3)), _generateRandAtrrib(msg.sender, 50, 50, _randHelper(4)), _generateRandDna(msg.sender, _randHelper(3)), playerType, 0,0,0,0,block.timestamp + ageoutSeconds,block.timestamp,0,0);
        }else if (playerType == 3){
             _tokenDetails[nextId] = Player(0, _generateRandAtrrib(msg.sender, 25, 75, _randHelper(5)), _generateRandDna(msg.sender, _randHelper(5)), playerType, 0,0,0,0,block.timestamp + ageoutSeconds,block.timestamp,0,0);
        } 
        _safeMint(msg.sender, nextId);
        setApprovalForAll(marketplaceAddress, true);
        nextId++;
    }

     function mintPlayerToTeam(uint _op, uint _dp, address minter, uint playerType, uint teamId, uint teamDna, uint teamPos) public onlyTeams returns (uint, uint) {
        if(nextId == 0){
            require(msg.sender == admin, "A1");
        }
        if(playerType == 1) {
            _tokenDetails[nextId] = Player(_op,_dp, _generateRandDna(minter, _randHelper(1)), playerType, teamId,teamDna,teamPos,0,block.timestamp + ageoutSeconds,block.timestamp,0,0);
        } else if (playerType == 2){
            _tokenDetails[nextId] = Player(_op,_dp, _generateRandDna(minter, _randHelper(3)), playerType, teamId,teamDna,teamPos,0,block.timestamp + ageoutSeconds,block.timestamp,0,0);
        } else if (playerType == 3) {
            _tokenDetails[nextId] = Player(_op,_dp, _generateRandDna(minter, _randHelper(5)), playerType, teamId,teamDna,teamPos,0,block.timestamp + ageoutSeconds,block.timestamp,0,0);
        }        
        _safeMint(minter, nextId);
        setApprovalForAll(marketplaceAddress, true);
        nextId++;
        return (_tokenDetails[nextId].offence, _tokenDetails[nextId].defence);
    }

    function _randHelper(uint a) public view returns (uint){
        return a + nextId;
    }

    function mintSuperstar(address playerOwner, uint opScore, uint dpScore, uint dna, uint playerType) external onlyAdmin{
        if(playerType == 1){
            _tokenDetails[nextId] = Player(opScore, dpScore, dna, playerType, 0,0,0,0,block.timestamp + ageoutSeconds,block.timestamp,0,0);
        }else if(playerType == 2){
            _tokenDetails[nextId] = Player(opScore, dpScore, dna, playerType, 0,0,0,0,block.timestamp + ageoutSeconds,block.timestamp,0,0);
        }else if(playerType == 3){
            _tokenDetails[nextId] = Player(opScore, dpScore, dna, playerType, 0,0,0,0,block.timestamp + ageoutSeconds,block.timestamp,0,0);
        }
        _safeMint(playerOwner, nextId);
        setApprovalForAll(marketplaceAddress, true);
        nextId++;
    }

    function getAllTokensForUser(address user) public view returns (uint256[] memory){
        uint256 tokenCount = balanceOf(user);
        if(tokenCount == 0){
            return new uint256[](0);
        }
        else{
            uint[] memory result = new uint256[](tokenCount);
            uint256 totalPlayers = nextId;
            uint256 resultIndex = 0;
            uint256 i;
            for(i = 0; i < totalPlayers; i++){
                if(ownerOf(i) == user){
                    result[resultIndex] = i;
                    resultIndex++;
                }
                
            }
            return result;
        }
    }

    function giftPlayer(uint tokenId, address newOwner) public {
        require (ownerOf(tokenId) == msg.sender);
        safeTransferFrom(msg.sender, newOwner, tokenId, "");
    }

    function updateEquipment(uint token, uint sku, uint playerid) public {
        uint tokenBalance = pbProShopFactory.balanceOf(msg.sender, token);
        require(tokenBalance >= 1);
        _tokenDetails[playerid].equippedJersey = sku;
        _tokenDetails[playerid].equippedToken = token;    
        pbProShopFactory.burnOnEquip(msg.sender, token);
    }

    function removeEquipment(uint playerid) public {
        require(_tokenDetails[playerid].equippedToken != 0);
        uint returnToken;
        returnToken = _tokenDetails[playerid].equippedToken;
        _tokenDetails[playerid].equippedJersey = 0;
        _tokenDetails[playerid].equippedToken = 0;    
        pbProShopFactory.mintOnUnequip(msg.sender, returnToken);
    }

    function assignToTeam(uint teamId, uint position, uint playerid, uint teamDna) public {
        require(ownerOf(playerid) == msg.sender);
        require(pbTeams.getTokenDetails(teamId).ownerAddress == msg.sender);
         _tokenDetails[playerid].teamId = teamId;
         _tokenDetails[playerid].position = position;
         _tokenDetails[playerid].teamDna = teamDna;
         uint playerOp = _tokenDetails[playerid].offence;
         uint playerDp = _tokenDetails[playerid].defence;
         pbTeams.addStatsToTeam(teamId, msg.sender, playerOp, playerDp);
    }

    function removeFromTeam(uint teamId, uint playerid) public {
        require(ownerOf(playerid) == msg.sender);
        require(pbTeams.getTokenDetails(teamId).ownerAddress == msg.sender);
         _tokenDetails[playerid].teamId = 0;
         _tokenDetails[playerid].position = 0;
         _tokenDetails[playerid].teamDna = 0;
         uint playerOp = _tokenDetails[playerid].offence;
         uint playerDp = _tokenDetails[playerid].defence;
         pbTeams.removeStatsFromTeam(teamId, msg.sender, playerOp, playerDp);
    }

    function addOp(uint tokenId, uint qty, address owner) public onlyPBXP {
       _tokenDetails[tokenId].offence = _tokenDetails[tokenId].offence + qty;
       if(_tokenDetails[tokenId].teamId != 0){
        pbTeams.addOPToTeam(_tokenDetails[tokenId].teamId,owner, qty);
       }
    }

    function addDp(uint tokenId, uint qty, address owner) public onlyPBXP {
       _tokenDetails[tokenId].defence = _tokenDetails[tokenId].defence + qty;
       if(_tokenDetails[tokenId].teamId != 0){
           pbTeams.addDPToTeam(_tokenDetails[tokenId].teamId, owner, qty);
       }
    }

    function _generateRandDna (address sender, uint randHelper) public view returns (uint){
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, sender, randHelper)));
        return rand % dnaModulus;
    }

    function _generateRandAtrrib (address sender, uint mod, uint base, uint randHelper) public view returns (uint){
        uint operator = 0;
        uint i;
        for( i = 0; i < bellCurveIterations; i++) {
            operator = operator + (uint(keccak256(abi.encodePacked(randHelper, i, block.difficulty, block.timestamp, sender))) % mod);
        }
        uint primaryAttrib = operator/bellCurveIterations;
        return primaryAttrib + base;
    }

    function getTeamOP (uint _teamId) public view returns (uint) {
            uint resultIndex = 0;
            uint i;
            for(i = 0; i < nextId; i++){
                if(getTokenDetails(i).teamId == _teamId){
                    resultIndex = resultIndex + getTokenDetails(i).offence; 
            }
        }
        return resultIndex;
    }

    function getTeamDP (uint _teamId) public view returns (uint) {
            uint resultIndex = 0;
            uint i;
            for(i = 0; i < nextId; i++){
                if(getTokenDetails(i).teamId == _teamId){
                    resultIndex = resultIndex + getTokenDetails(i).defence; 
            }
        }
        return resultIndex;
    }

    // function withdrawBuddies(address payable _to, uint _amount) public onlyAdmin {
    //     _to.transfer(_amount);
    // }

}
