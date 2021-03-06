// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../contracts/PBPlayers.sol";

contract PBXP is ERC1155 {

    uint public PBXPTokenId = 0;
    address public admin;
    address pbTeamsAddress;
    address pbPvCAddress;
    address pbMatchupsAddress;
    uint upgradeCost;
    IERC721 public myTeamsContract;
    PBPlayers public pbPlayers;
    IERC20 public buddies;

    modifier onlyAdmin() {
        require(msg.sender == admin, "A1");
        _;
    }

     modifier onlyTeams() {
        require(msg.sender == pbTeamsAddress, "T1");
        _;
    }

    constructor(address _buddiesCoinAddress, address _pbPlayersAddress, uint _upgradeCost) ERC1155 ("") {
        admin = msg.sender;
        buddies = IERC20(_buddiesCoinAddress);
        pbPlayers = PBPlayers(_pbPlayersAddress);
        upgradeCost = _upgradeCost;
    }

    function isAdmin() public view returns (bool){
        if(admin == msg.sender){
            return true;
        } else return false;
    } 

    function getPBXPAddress() external view returns(address){
        return address(this);
    }

    function updateBuddiesCoinAddress(address _buddiesCoinAddress) external onlyAdmin {
        buddies = IERC20(_buddiesCoinAddress);
    }

    function updatePBXPTokenId(uint _PBXPTokenId) external onlyAdmin{
        PBXPTokenId = _PBXPTokenId;
    }

    function updatePBTeamsAddress(address _pbTeamsAddress) external onlyAdmin {
        pbTeamsAddress = _pbTeamsAddress;
    }

    function updatePBPlayersAddress(address _pbPlayersAddress)  external onlyAdmin {
        pbPlayers = PBPlayers(_pbPlayersAddress);
    }

    function updatePBPvCAddress(address _pbPvCAddress) external onlyAdmin {
        pbPvCAddress = _pbPvCAddress;
    }

    function updatePBMatchupsAddress(address _pbMatchupsAddress) external onlyAdmin {
        pbMatchupsAddress = _pbMatchupsAddress;
    }

    function getUpgradeCost() public view returns(uint){
        return upgradeCost;
    }

    function newProduct(uint token, uint initalSupply) external onlyAdmin {
        _mint(msg.sender, token, initalSupply, "");
    }

    function newPBXPtoAddress(address mintToAddress, uint qty, uint token) external onlyAdmin returns (uint){
        _mint(mintToAddress, token, qty, "");
        uint balance = balanceOf(mintToAddress, token);
        return balance;
    }

    function burnItems(address owner, uint token, uint qty ) external onlyAdmin {
        _burn(owner, token, qty);
    }

    function earnPBXP(address earnerAddress, uint qty) external {
        require(msg.sender == pbTeamsAddress || msg.sender == pbPvCAddress || msg.sender == pbMatchupsAddress);
        _mint(earnerAddress, PBXPTokenId, qty, "");
    }

    function awardPBXP(address awardeeAddress, uint qty) external onlyAdmin {
        _mint(awardeeAddress, PBXPTokenId, qty, "");
    }

    function increaseStats(uint tokenId, uint statType, uint qty, uint xp) public {
        require(xp == upgradeCost * qty);
        require(balanceOf(msg.sender, 0) >= xp);
        require(pbPlayers.getTokenDetails(tokenId).ageoutTimestamp > block.timestamp);
        require(pbPlayers.ownerOf(tokenId) == msg.sender);
        if(statType == 1){
            require(pbPlayers.getTokenDetails(tokenId).playertype != 3);
            require(pbPlayers.getTokenDetails(tokenId).offence < 99);
            pbPlayers.addOp(tokenId, qty, msg.sender);
        }else if (statType == 2){
            require(pbPlayers.getTokenDetails(tokenId).defence < 99);
            pbPlayers.addDp(tokenId, qty, msg.sender);
        }
        _burn(msg.sender, 0, xp);
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