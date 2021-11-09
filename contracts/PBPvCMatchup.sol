// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../contracts/PBTeams.sol";
import "../contracts/PBMatchupValidation.sol";
import "../contracts/PBPvCHelper.sol";

contract PBPvCMatchups is ReentrancyGuard {

address admin;
uint maxOpScore = 397;
uint maxDpScore = 447;
uint nonce = 0;
uint dnaModulus = 10 ** 16;
uint bellCurveIterations = 4;
uint[] timeoutSeconds;
uint[] reward;
uint xpReward;
uint difficultymod;
IERC20 public buddies;
PBTeams public pbTeams;
PBXP public PBXPToken;
PBMatchupValidation public pbMatchupValidation;
PBPvCHelper public pbPvCHelper;

    struct TeamPvCMatchups {
        uint teamId;
        uint activeTimestamp1;
        uint activeTimestamp2;
        uint activeTimestamp3;
        bool lastMatchWon1;
        bool lastMatchWon2;
        bool lastMatchWon3;
        address ownerAddress;
        uint nonce1;
        uint nonce2;
        uint nonce3;
    }

constructor(address _buddiesCoinAddress, address _pbxpAddress, address _pbTeamsAddress, address _pbMatchupValidationAddress, address _pbPvCHelperAddress, uint[] memory _timeoutSeconds, uint[] memory _reward, uint _xpReward, uint _difficultymod){
    admin = msg.sender;
    buddies = IERC20(_buddiesCoinAddress);
    PBXPToken = PBXP(_pbxpAddress);
    pbTeams = PBTeams(_pbTeamsAddress);
    pbMatchupValidation = PBMatchupValidation(_pbMatchupValidationAddress);
    pbPvCHelper = PBPvCHelper(_pbPvCHelperAddress);
    timeoutSeconds = _timeoutSeconds;
    reward = _reward;
    xpReward = _xpReward;
    difficultymod = _difficultymod;
}

mapping (uint => TeamPvCMatchups) public _teamPvCMatchups;


event gamePlayed(bool isWinner, uint to1, uint to2, uint to3);

modifier onlyAdmin() {
    require(admin == msg.sender, "A1" );
    _;
}

function getPBPvCMatchupsAddress() public view returns (address){
    return address(this);
}

function getDifficultyMod() public view returns (uint){
    return difficultymod;
}

function updateDifficultyMod(uint _difficultymod) external onlyAdmin {
    difficultymod = _difficultymod;
}

function getBuddiesReward() public view returns (uint, uint, uint){
    return (reward[0], reward[1], reward[2]);
}

function updateBuddiesReward( uint[] memory _reward) external onlyAdmin{
    reward = _reward;
}

function updateTimesOut( uint[] memory _timeoutSeconds) external onlyAdmin {
    timeoutSeconds = _timeoutSeconds;
} 

function getPBXPReward() public view returns (uint){
    return xpReward;
}

function updatePBXPReward(uint _xpReward) external onlyAdmin {
    xpReward = _xpReward;
}

function updatePBMatchupValidationAddress(address _pbMatchupValidationAddress) external onlyAdmin {
        pbMatchupValidation = PBMatchupValidation(_pbMatchupValidationAddress);
}

function widthdrawBuddiesFromContract(address _widthdrawAddress, uint _amount) external onlyAdmin {
    buddies.transfer(_widthdrawAddress, _amount);
}


function hitTheIcePvC(uint difficulty, uint teamId, uint[] memory playerIds) external returns (bool){
    require(pbMatchupValidation.varifyPlayerAgesOnTeam(teamId, playerIds) == true, "N6");
    TeamPvCMatchups storage teamPvCmatchup = _teamPvCMatchups[teamId];
    teamPvCmatchup.ownerAddress = pbTeams.getTokenDetails(teamId).ownerAddress;
    require(teamPvCmatchup.ownerAddress == msg.sender, "A1");
    uint playerOP = pbTeams.getTokenDetails(teamId).teamTotalOP;
    uint playerDP = pbTeams.getTokenDetails(teamId).teamTotalDP;
    uint computerOP;
    uint computerDP;
    bool isWinner;
     if (difficulty == 1){
        computerOP = pbPvCHelper.generateRandomHourlyStat(difficultymod, difficulty, 1);
        computerDP = pbPvCHelper.generateRandomHourlyStat(difficultymod, difficulty, 2);
    }else if(difficulty == 2){
        computerOP = pbPvCHelper.generateRandomHourlyStat(((difficultymod * 15)/10), difficulty, 1);
        computerDP = pbPvCHelper.generateRandomHourlyStat(((difficultymod * 15)/10), difficulty, 2);
    }else if(difficulty == 3){
        computerOP = pbPvCHelper.generateRandomHourlyStat(((difficultymod * 20)/10), difficulty, 1);
        computerDP = pbPvCHelper.generateRandomHourlyStat(((difficultymod * 20)/10), difficulty, 2);
    }
    
    //require(pbPvCHelper.checkGeneratedStats(difficulty,computerOP,computerDP) == true,"N8");
    
    if(difficulty == 1){
        require(block.timestamp >= teamPvCmatchup.activeTimestamp1, "N1");
        teamPvCmatchup.activeTimestamp1 = block.timestamp + timeoutSeconds[0];
    }else if(difficulty == 2){
        require(block.timestamp >=  teamPvCmatchup.activeTimestamp2, "N1");
        teamPvCmatchup.activeTimestamp2 = block.timestamp + timeoutSeconds[1];
    }else if(difficulty == 3){
        require(block.timestamp >= teamPvCmatchup.activeTimestamp3, "N1");
        teamPvCmatchup.activeTimestamp3 = block.timestamp + timeoutSeconds[2];
    }
    uint winningBP = pbPvCHelper.getWinningBP(playerOP, playerDP, computerOP, computerDP);
    uint randResult = pbPvCHelper.generateResult();
     
    if(randResult <= winningBP){
    
    if(difficulty == 1){
            teamPvCmatchup.lastMatchWon1 = true;
            buddies.transfer(msg.sender, reward[0]);
            PBXPToken.earnPBXP(msg.sender, xpReward);
            teamPvCmatchup.nonce1++;
        }else if(difficulty == 2){
            teamPvCmatchup.lastMatchWon2 = true;
            buddies.transfer(msg.sender, reward[1]);
            PBXPToken.earnPBXP(msg.sender, ((xpReward*15)/10));
            teamPvCmatchup.nonce2++;
        }else if(difficulty == 3){
            teamPvCmatchup.lastMatchWon3 = true;
            buddies.transfer(msg.sender, reward[2]);
            PBXPToken.earnPBXP(msg.sender, ((xpReward*20)/10));
            teamPvCmatchup.nonce3++;
        }        
            isWinner = true;
    }else if(randResult > winningBP){
        
        if(difficulty == 1){
            teamPvCmatchup.lastMatchWon1 = false;
            PBXPToken.earnPBXP(msg.sender, xpReward);
            teamPvCmatchup.nonce1++;
        }else if(difficulty == 2){
            teamPvCmatchup.lastMatchWon2 = false;
            PBXPToken.earnPBXP(msg.sender, ((xpReward*15)/10));
            teamPvCmatchup.nonce2++;
        }else if(difficulty == 3){
            teamPvCmatchup.lastMatchWon3 = false;
            PBXPToken.earnPBXP(msg.sender, ((xpReward*20)/10));
            teamPvCmatchup.nonce3++;
        }  
            isWinner = false;
    }
    emit gamePlayed(isWinner,teamPvCmatchup.activeTimestamp1,teamPvCmatchup.activeTimestamp2,teamPvCmatchup.activeTimestamp3);
    return isWinner;
}

function generateRandomTeamDNA(uint mod, uint difficulty, uint teamId) public view returns (uint){
    TeamPvCMatchups storage teamPvCmatchup = _teamPvCMatchups[teamId];
    uint rand;
    if(difficulty == 1){
        rand = uint(keccak256(abi.encodePacked(teamPvCmatchup.nonce1, msg.sender, mod, difficulty)));
    }else if(difficulty == 2){
        rand = uint(keccak256(abi.encodePacked(teamPvCmatchup.nonce2, msg.sender, mod, difficulty)));  
    }else if(difficulty == 3){
        rand = uint(keccak256(abi.encodePacked(teamPvCmatchup.nonce3, msg.sender, mod, difficulty)));
    } 
    return rand % dnaModulus;
}

function getTimeOuts(uint teamId) public view returns (uint, uint, uint, bool, bool, bool, uint, uint, uint){
    TeamPvCMatchups storage teamPvCmatchup = _teamPvCMatchups[teamId];
    return (timeoutSeconds[0], timeoutSeconds[1], timeoutSeconds[2], teamPvCmatchup.lastMatchWon1, teamPvCmatchup.lastMatchWon2, teamPvCmatchup.lastMatchWon3, teamPvCmatchup.activeTimestamp1, teamPvCmatchup.activeTimestamp2, teamPvCmatchup.activeTimestamp3);
}

function getPvCMatchupsTimestamp() public view returns (uint) {
    return block.timestamp;
}

}

