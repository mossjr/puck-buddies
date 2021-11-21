// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../contracts/PBTeams.sol";
import "../contracts/PBPvCHelper.sol";

contract PBPvCMatchups is ReentrancyGuard {

address admin;
uint private winT = 99889988;
uint private lossT = 88998899;
uint dnaModulus = 10 ** 16;
uint bellCurveIterations = 4;
uint winToken;
uint lossToken;
uint[] timeoutSeconds;
uint[] reward;
uint xpReward;
uint difficultymod;
IERC20 public buddies;
PBTeams public pbTeams;
PBXP public PBXPToken;
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

constructor(address _buddiesCoinAddress, address _pbxpAddress, address _pbTeamsAddress, address _pbPvCHelperAddress, uint[] memory _timeoutSeconds, uint[] memory _reward, uint _xpReward, uint _difficultymod){
    admin = msg.sender;
    buddies = IERC20(_buddiesCoinAddress);
    PBXPToken = PBXP(_pbxpAddress);
    pbTeams = PBTeams(_pbTeamsAddress);
    pbPvCHelper = PBPvCHelper(_pbPvCHelperAddress);
    timeoutSeconds = _timeoutSeconds;
    reward = _reward;
    xpReward = _xpReward;
    difficultymod = _difficultymod;
}

mapping (uint => TeamPvCMatchups) public _teamPvCMatchups;

modifier onlyAdmin() {
    require(admin == msg.sender, "A1" );
    _;
}

function updateValidation(uint val1, uint val2) external onlyAdmin {
    winT = val1;
    lossT = val2;
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

function widthdrawBuddiesFromContract(address _widthdrawAddress, uint _amount) external onlyAdmin {
    buddies.transfer(_widthdrawAddress, _amount);
}



function rewardMatchup (bytes32 _token, uint _difficulty, uint _teamId, uint t1S, uint t2S) external returns (uint resultIndex) {
    TeamPvCMatchups storage teamPvCmatchup = _teamPvCMatchups[_teamId];
    uint matchNonce;
    if(_difficulty == 1){
        matchNonce = teamPvCmatchup.nonce1;
    }else if(_difficulty == 2){
        matchNonce = teamPvCmatchup.nonce2;
    }else if(_difficulty == 3){
        matchNonce = teamPvCmatchup.nonce3;
    }

    if(t1S > t2S){
        require(_token == keccak256(abi.encodePacked(msg.sender, winT, matchNonce, _difficulty, _teamId, t1S, t2S)), "T1");

        if(_difficulty == 1){
            require(block.timestamp >= teamPvCmatchup.activeTimestamp1, "N1");
            teamPvCmatchup.activeTimestamp1 = block.timestamp + timeoutSeconds[0];
            teamPvCmatchup.lastMatchWon1 = true;
            buddies.transfer(msg.sender, reward[0]);
            PBXPToken.earnPBXP(msg.sender, xpReward);
            teamPvCmatchup.nonce1++;
            return 1;
        }else if(_difficulty == 2){
            require(block.timestamp >=  teamPvCmatchup.activeTimestamp2, "N2");
            teamPvCmatchup.activeTimestamp2 = block.timestamp + timeoutSeconds[1];
            teamPvCmatchup.lastMatchWon2 = true;
            buddies.transfer(msg.sender, reward[1]);
            PBXPToken.earnPBXP(msg.sender, xpReward);
            teamPvCmatchup.nonce2++;
            return 2;
        }else if(_difficulty == 3){
            require(block.timestamp >= teamPvCmatchup.activeTimestamp3, "N3");
            teamPvCmatchup.activeTimestamp3 = block.timestamp + timeoutSeconds[2];
            teamPvCmatchup.lastMatchWon3 = true;
            buddies.transfer(msg.sender, reward[2]);
            PBXPToken.earnPBXP(msg.sender, xpReward);
            teamPvCmatchup.nonce3++;
            return 3;
        }

    }else if(t2S > t1S){
        require(_token == keccak256(abi.encodePacked(msg.sender, lossT, matchNonce, _difficulty, _teamId, t1S, t2S)), "T2");

        if(_difficulty == 1){
            require(block.timestamp >= teamPvCmatchup.activeTimestamp1, "N4");
            teamPvCmatchup.activeTimestamp1 = block.timestamp + timeoutSeconds[0];
            teamPvCmatchup.lastMatchWon1 = false;
            PBXPToken.earnPBXP(msg.sender, xpReward);
            teamPvCmatchup.nonce1++;
            return 4;
        }else if(_difficulty == 2){
            require(block.timestamp >=  teamPvCmatchup.activeTimestamp2, "N5");
            teamPvCmatchup.activeTimestamp2 = block.timestamp + timeoutSeconds[1];
            teamPvCmatchup.lastMatchWon2 = false;
            PBXPToken.earnPBXP(msg.sender, xpReward);
            teamPvCmatchup.nonce2++;
            return 5;
        }else if(_difficulty == 3){
            require(block.timestamp >= teamPvCmatchup.activeTimestamp3, "N6");
            teamPvCmatchup.activeTimestamp3 = block.timestamp + timeoutSeconds[2];
            teamPvCmatchup.lastMatchWon3 = false;
            PBXPToken.earnPBXP(msg.sender, xpReward);
            teamPvCmatchup.nonce3++;
            return 6;
        }
    }
    else{
        return 0;
    }
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

function getNoMatchups(uint teamId) public view returns (uint, uint, uint){
    TeamPvCMatchups storage teamPvCmatchup = _teamPvCMatchups[teamId];
    return (teamPvCmatchup.nonce1, teamPvCmatchup.nonce2, teamPvCmatchup.nonce3);
}

function getPvCMatchupsTimestamp() public view returns (uint) {
    return block.timestamp;
}

}

