// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PBPvCHelper {

address admin;
uint maxOpScore = 397;
uint maxDpScore = 447;
uint nonce = 0;
uint dnaModulus = 10 ** 16;
uint bellCurveIterations = 4;
uint timeoutSeconds;
uint reward1;
uint reward2;
uint reward3;
uint xpReward;
uint difficultymod;

constructor(uint _difficultymod){
    admin = msg.sender;
    difficultymod = _difficultymod;
}

function generateRandomHourlyStat(uint mod, uint difficulty, uint statType) public view returns (uint){
    uint operator;
    uint range;
    if(statType == 1){
        range = maxOpScore - mod;
    }else if(statType == 2){
        range = maxDpScore - mod;
    }    
    uint hourOfDate = (block.timestamp/3600);
    uint i;
    for(i = 0; i < bellCurveIterations; i++){
        operator = operator + (uint(keccak256(abi.encodePacked(i, difficulty, statType, hourOfDate, msg.sender))) % range);
    }
    uint stat = (operator/bellCurveIterations) + mod;
    return stat;
}

function getPBPvCMatchuypHelperAddress() public view returns(address){
    return address(this);
}

function checkGeneratedStats(uint difficulty, uint cOP, uint cDP) public view returns (bool){
    uint opStat;
    uint dpStat;
     if (difficulty == 1){
        opStat = generateRandomHourlyStat(difficultymod, difficulty, 1);
        dpStat = generateRandomHourlyStat(difficultymod, difficulty, 2);
    }else if(difficulty == 2){
        opStat = generateRandomHourlyStat(((difficultymod * 15)/10), difficulty, 1);
        dpStat = generateRandomHourlyStat(((difficultymod * 15)/10), difficulty, 2);
    }else if(difficulty == 3){
        opStat = generateRandomHourlyStat(((difficultymod * 20)/10), difficulty, 1);
        dpStat = generateRandomHourlyStat(((difficultymod * 20)/10), difficulty, 2);
    }
    require (opStat == cOP && dpStat == cDP, "N7");
    return true;
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



}