// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract PBPvCHelper {

address admin;
uint winToken;
uint lossToken;
uint hashToken;
uint difficultymod;
uint maxOpScore = 397;
uint maxDpScore = 447;
uint bellCurveIterations = 4;

constructor(uint _difficultymod){
    admin = msg.sender;
    difficultymod = _difficultymod;
}

event gamePlay(uint firstGoalsFor, uint firstGoalsAgainst, uint sencondGoalsFor, uint secondGoalsAgainst );

modifier onlyAdmin() {
    require(admin == msg.sender, "A1" );
    _;
}

function getPBPvCHelperAddress() public view returns (address){
    return address(this);
}

function getTokensAdmin() external view onlyAdmin returns (uint, uint){
    return (winToken, lossToken);
}

function updateVariables(uint _winToken, uint _lossToken, uint _hashToken) external onlyAdmin {
    winToken = _winToken;
    lossToken = _lossToken;
    hashToken = _hashToken;
}

function generateRandomStat(uint mod, uint difficulty, uint statType) public view returns (uint){
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

    function getBNBBalance() external view onlyAdmin returns (uint) {
        return address(this).balance;
    }

    function transferBNB(address payable _to, uint _amount) external onlyAdmin {
        _to.transfer(_amount);
    }

}