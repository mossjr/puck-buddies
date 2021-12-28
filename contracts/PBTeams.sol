// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
// import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
//import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../contracts/PBPlayers.sol";
import "../contracts/PBXP.sol";

contract PBTeams is ERC721 {

    address admin;
    address pbxpAddress;
    address pbPlayersAddress;
    uint teamMintCost;
    uint dnaModulus = 10 ** 16;
    uint playersPerTeam = 6;
    uint bellCurveIterations = 4;
    uint PBXPtokenId = 0;
  
    IERC20 public buddies;
    PBXP public PBXPToken;
    PBPlayers public pbPlayers;
    


event sixPackPlayer(uint p1,
                    uint p2,
                    uint p3,
                    uint p4,
                    uint p5,
                    uint p6);

// struct Team{
//     uint teamId;
//     uint teamDna;
//     uint teamTotalOP;
//     uint teamTotalDP;
//     uint activeTimestamp1;
//     uint activeTimestamp2;
//     uint activeTimestamp3;
//     bool lastMatchWon1;
//     bool lastMatchWon2;
//     bool lastMatchWon3;
//     address ownerAddress;

// }

// uint nextId = 0;

// mapping (uint => Team) public _tokenDetails;


constructor(uint _teamMintCost, address _buddiesCoinAddress, address _pbxpAddress, address _pbPlayersAddress) ERC721("Puck Buddies Team", "PBT"){
    admin = msg.sender;
    teamMintCost = _teamMintCost;
    buddies = IERC20(_buddiesCoinAddress);
    PBXPToken = PBXP(_pbxpAddress);
    pbPlayers = PBPlayers(_pbPlayersAddress); 
    pbPlayersAddress = _pbPlayersAddress;
}

modifier onlyAdmin() {
        require(admin == msg.sender, "A1" );
        _;
}

function isAdmin() public view returns (bool){
        if(admin == msg.sender){
            return true;
        } else return false;
}

function getPBTeamsAddress() public view returns (address){
    return address(this);
}

function getTeamMintCost() public view returns (uint){
    return teamMintCost;
}

// function getTeamsCount() public view onlyAdmin returns(uint){
//     return nextId;
// }

function updateBuddiesCoinAddress(address _buddiesCoinAddress) external onlyAdmin {
        buddies = IERC20(_buddiesCoinAddress);
}

function updatePbxpAddress(address _pbxpAddress) external onlyAdmin{
        PBXPToken = PBXP(_pbxpAddress);
} 

function updatePuckBuddiePlayersAddress(address _pbPlayersAddress) external onlyAdmin{
        pbPlayers = PBPlayers(_pbPlayersAddress);
        pbPlayersAddress = _pbPlayersAddress;        
} 

// function updatePBMatchupValidationAddress(address _pbMatchupValidationAddress) external onlyAdmin {
//         pbMatchupValidation = PBMatchupValidation(_pbMatchupValidationAddress);
// }

function updateTeamMintCost(uint _teamMintCost) public onlyAdmin {
    teamMintCost = _teamMintCost;
}

// function getTokenDetails(uint tokenId) public view returns (Team memory){
//         return _tokenDetails[tokenId];
// }

// function getAllTokensForUser(address user) public view returns (uint256[] memory){
//         uint256 tokenCount = balanceOf(user);
//         if(tokenCount == 0){
//             return new uint256[](0);
//         }
//         else{
//             uint[] memory result = new uint256[](tokenCount);
//             uint256 totalTeams = nextId;
//             uint256 resultIndex = 0;
//             uint256 i;
//             for(i = 0; i < totalTeams; i++){
//                 if(ownerOf(i) == user){
//                     result[resultIndex] = i;
//                     resultIndex++;
//                 }
//             }
//             return result;
//         }
//     }

function _generateRandDna () private view returns (uint){
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));
        return rand % dnaModulus;
}

function mintSixPack(uint value) external {
    require(value == teamMintCost, "V1");
    uint allowance = buddies.allowance(msg.sender, address(this));
    require(allowance >= value, "B1");
    buddies.transferFrom(msg.sender, pbPlayersAddress, value);
    uint randOp;
    uint randDp;
    uint[] memory result = new uint[](6);
    randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(1));
    randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(2));
    uint p1 = pbPlayers.mintSixPackPlayer(randOp,randDp, msg.sender,1); //Offence 1
    result[0] = p1;

    randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(1));
    randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(2));
    uint p2 = pbPlayers.mintSixPackPlayer(randOp,randDp,msg.sender,1); //Offence 2
    result[1] = p2;

    randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(1));
    randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(2));
    uint p3 = pbPlayers.mintSixPackPlayer(randOp,randDp,msg.sender,1); //Offence 3
    result[2] = p3;

    randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(1));
    randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(2));
    uint p4 = pbPlayers.mintSixPackPlayer(randOp,randDp,msg.sender,2); //Defence 1
    result[3] = p4;

    randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(1));
    randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(2));
    uint p5 = pbPlayers.mintSixPackPlayer(randOp,randDp,msg.sender,2); //Defence 2
    result[4] = p5;

    randOp = 0;
    randDp = pbPlayers._generateRandAtrrib(msg.sender, 25, 75, pbPlayers._randHelper(2));
    uint p6 = pbPlayers.mintSixPackPlayer(randOp,randDp,msg.sender,3); //Goalie
    result[5] = p6;

     emit sixPackPlayer(p1, p2, p3, p4, p5, p6);
}

// function mintTeam(uint value) external {
//     if(nextId == 0){
//         require(msg.sender == admin, "A0");
//     }
//     require(balanceOf(msg.sender) < 1, "T0");
//     uint allowance = buddies.allowance(msg.sender, address(this));
//     require(allowance >= value, "B1");
//     buddies.transferFrom(msg.sender, pbPlayersAddress, value);
//     uint dna = _generateRandDna();
//     uint randOp;
//     uint randDp;
//     uint totOp = 0;
//     uint totDp = 0;
//     //New Stuff
//     randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(1));
//     randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(2));
//     totOp = totOp + randOp;
//     totDp = totDp + randDp;
//     pbPlayers.mintPlayerToTeam(randOp,randDp, msg.sender,1,nextId,dna,1); //Offence 1

//     randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(1));
//     randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(2));
//     totOp = totOp + randOp;
//     totDp = totDp + randDp;
//     pbPlayers.mintPlayerToTeam(randOp,randDp,msg.sender,1,nextId,dna,2); //Offence 2

//     randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(1));
//     randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(2));
//     totOp = totOp + randOp;
//     totDp = totDp + randDp;
//     pbPlayers.mintPlayerToTeam(randOp,randDp,msg.sender,1,nextId,dna,3); //Offence 3

//     randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(1));
//     randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(2));
//     totOp = totOp + randOp;
//     totDp = totDp + randDp;
//     pbPlayers.mintPlayerToTeam(randOp,randDp,msg.sender,2,nextId,dna,4); //Defence 1

//     randOp = pbPlayers._generateRandAtrrib(msg.sender, 50, 0, pbPlayers._randHelper(1));
//     randDp = pbPlayers._generateRandAtrrib(msg.sender, 50, 50, pbPlayers._randHelper(2));
//     totOp = totOp + randOp;
//     totDp = totDp + randDp;
//     pbPlayers.mintPlayerToTeam(randOp,randDp,msg.sender,2,nextId,dna,5); //Defence 2

//     randOp = 0;
//     randDp = pbPlayers._generateRandAtrrib(msg.sender, 25, 75, pbPlayers._randHelper(2));
//     totOp = totOp + randOp;
//     totDp = totDp + randDp;
//     pbPlayers.mintPlayerToTeam(randOp,randDp,msg.sender,3,nextId,dna,6); //Goalie

//     _tokenDetails[nextId] = Team(nextId, dna,totOp,totDp,0,0,0,false,false,false,msg.sender);
//     _safeMint(msg.sender, nextId);
//     PBXPToken.newTeamPBXP(msg.sender);
//     //End New stuff
//     emit NewTeam(nextId, dna);
//     nextId++;
// }

// function addStatsToTeam(uint teamId, address teamOwner, uint playerop, uint playerdp) public {
//     Team storage team = _tokenDetails[teamId];
//     address ownersAddress = _tokenDetails[teamId].ownerAddress;
//     require(ownersAddress == teamOwner);
//     team.teamTotalOP = team.teamTotalOP + playerop;
//     team.teamTotalDP = team.teamTotalDP + playerdp;    
// }

// function removeStatsFromTeam(uint teamId, address teamOwner, uint playerop, uint playerdp) public {
//     Team storage team = _tokenDetails[teamId];
//     address ownersAddress = _tokenDetails[teamId].ownerAddress;
//     require(ownersAddress == teamOwner);
//     team.teamTotalOP = team.teamTotalOP - playerop;
//     team.teamTotalDP = team.teamTotalDP - playerdp;      
// }

// function addOPToTeam(uint teamId, address teamOwner, uint playerop) public  {
//     require(msg.sender == pbPlayersAddress);
//     Team storage team = _tokenDetails[teamId];
//     address ownersAddress = _tokenDetails[teamId].ownerAddress;
//     require(ownersAddress == teamOwner);
//     team.teamTotalOP = team.teamTotalOP + playerop;   
// }

// function addDPToTeam(uint teamId, address teamOwner, uint playerdp) public  {
//     require(msg.sender == pbPlayersAddress);
//     Team storage team = _tokenDetails[teamId];
//     address ownersAddress = _tokenDetails[teamId].ownerAddress;
//     require(ownersAddress == teamOwner);
//     team.teamTotalDP = team.teamTotalDP + playerdp;    
// }


}