// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../contracts/PBXP.sol";
import "../contracts/PBXPShopFactory.sol";
import "../contracts/PBPlayers.sol";



contract PBXPShopFactory is ERC1155PresetMinterPauser, ReentrancyGuard {

    address public admin;
    address pbxpHolderAddress;
    address puckbuddiesplayeraddress;
    uint256 public skuCount;
    using Counters for Counters.Counter;
    Counters.Counter private _xpItemsCreated;
    Counters.Counter private _xpItemsSold;
    PBXP public PBXPToken;
    PBXPShopFactory public pbxpShopFactory;
    PBPlayers public pbPlayers;
   

    modifier onlyAdmin() {
        require(msg.sender == admin, "A1");
        _;
    }

    constructor(address _pbxpAddress, address _puckbuddiesplayeraddress) ERC1155PresetMinterPauser("") {
        admin = msg.sender;
        PBXPToken = PBXP(_pbxpAddress);
        pbPlayers = PBPlayers(_puckbuddiesplayeraddress);
        skuCount = 0;
    }

    function isAdmin() public view returns (bool){
        if(admin == msg.sender){
            return true;
        } else return false;
    } 

    function updatePBXPTokenAddress(address _pbxpAddress) external onlyAdmin {
        PBXPToken = PBXP(_pbxpAddress);
    }

    function updatePBXPHolderAddress(address _pbxpHolderAddress) external onlyAdmin {
        pbxpShopFactory = PBXPShopFactory(_pbxpHolderAddress);
    }

    function updatePuckBuddiesPlayerAddress(address _puckbuddiesplayeraddress) external onlyAdmin {
        pbPlayers = PBPlayers(_puckbuddiesplayeraddress);
    }

    function getPBXPFactoryAddress() public view returns (address){
        return address(this);
    }

    function newProduct(uint sku, uint initalSupply) external onlyAdmin {
        skuCount++;
        _mint(pbxpHolderAddress, sku, initalSupply, "");
        setApprovalForAll(pbxpHolderAddress, true);
        setApprovalForAll(address(this), true);
        setApprovalForAll(puckbuddiesplayeraddress, true);
        _xpItemsCreated.increment();
    }

    function burnItems(uint token, uint qty ) external onlyAdmin {
        _burn(pbxpHolderAddress, token, qty);
    }

    function getTimestamp() external view returns (uint){
        return block.timestamp;
    }

    function getBNBBalance() external view onlyAdmin returns (uint) {
        return address(this).balance;
    }

    function transferBNB(address payable _to, uint _amount) external onlyAdmin {
        _to.transfer(_amount);
    }


} 