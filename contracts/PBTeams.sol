// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
function updateTeamMintCost(uint _teamMintCost) public onlyAdmin {
    teamMintCost = _teamMintCost;
}

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

    function getBNBBalance() external view onlyAdmin returns (uint) {
        return address(this).balance;
    }
    
    function getBudsBalance() external view returns (uint) {
        return buddies.balanceOf(address(this));
    }

    function transferBNB(address payable _to, uint _amount) external onlyAdmin {
        _to.transfer(_amount);
    }

    function transferBUDS(uint _amount) external onlyAdmin {
        buddies.transfer(msg.sender, _amount);
    }

}