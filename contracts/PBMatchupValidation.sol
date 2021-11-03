// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../contracts/PBTeams.sol";
import "../contracts/PBPlayers.sol";

contract PBMatchupValidation {

    address admin;
    PBTeams public pbTeams;
    PBPlayers public pbPlayers;

constructor (address _pbTeamsAddress, address _pbPlayersAddress){
    admin = msg.sender;
    pbTeams = PBTeams(_pbTeamsAddress);
    pbPlayers = PBPlayers(_pbPlayersAddress);
}

modifier onlyAdmin() {
    require(admin == msg.sender, "This function is only accessable by the admin of the contract" );
    _;
}

function getPBMatchupsAddress() public view returns (address){
    return address(this);
}

function updatePBTeamsAddress (address _pbTeamsAddress) public onlyAdmin {
    pbTeams = PBTeams(_pbTeamsAddress);
}

function updatePBPlayersAddress (address _pbPlayersAddress) public onlyAdmin {
   pbPlayers = PBPlayers(_pbPlayersAddress);
}

function varifyPlayerAgesOnTeam(uint teamId, uint[] memory playerIds) public view returns (bool){
    uint i;
    uint playerCount = 0;
    for(i = 0; i < 6; i++){
        if(pbPlayers.getTokenDetails(playerIds[i]).teamId == teamId && pbPlayers.getTokenDetails(playerIds[i]).ageoutTimestamp > block.timestamp){ // && pbPlayers.getTokenDetails(i).ageoutTimestamp > block.timestamp
                playerCount++;
            }            
        }
        if(playerCount == 6){
            return true;
        }else{
            return false;
        }    
    }
}