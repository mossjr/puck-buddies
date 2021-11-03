// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../contracts/PBPlayers.sol";
import "../contracts/PBProShopHolder.sol";



contract PBProShopFactory is ERC1155PresetMinterPauser, ReentrancyGuard {

    address public admin;
    address proshopaddress;
    address puckbuddiesplayeraddress;
    address proshopholder;
    address proshopmarketplaceaddress;
    uint256 public skuCount;
    using Counters for Counters.Counter;
    Counters.Counter private _proshopItemsCreated;
    Counters.Counter private _proShopItemsSold;
    IERC20 public buddies;
    PBPlayers public pbPlayers;
    PBProShopHolder public pbProShopHolder;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin can perform this call");
        _;
    }

    constructor(address _buddiesCoinAddress, address _puckbuddiesplayeraddress) ERC1155PresetMinterPauser("") {
        admin = msg.sender;
        skuCount = 0;
        buddies = IERC20(_buddiesCoinAddress);
        pbPlayers = PBPlayers(_puckbuddiesplayeraddress);
    }

    function isAdmin() public view returns (bool){
        if(admin == msg.sender){
            return true;
        } else return false;
    } 

    function updateBuddiesCoinAddress(address _buddiesCoinAddress) onlyAdmin external {
     buddies = IERC20(_buddiesCoinAddress);
    }

    function updateProshopHolderAddress(address _pbProshopHolderAddress) external onlyAdmin {
        pbProShopHolder = PBProShopHolder(_pbProshopHolderAddress);
        proshopholder = _pbProshopHolderAddress;
    }

        function updateProshopMarketplaceAddress(address _pbProshopMarketplaceAddress) external onlyAdmin {
        proshopmarketplaceaddress = _pbProshopMarketplaceAddress;
    }

    function updatePuckBuddiesPlayerAddress(address _puckbuddiesplayeraddress) external onlyAdmin {
        pbPlayers = PBPlayers(_puckbuddiesplayeraddress);
    }

    function getPBProShopFactoryAddress() public view returns (address){
        return address(this);
    }

    function newProduct(uint sku, uint qty) external onlyAdmin {
        skuCount++;
        _mint(proshopholder, sku, qty, "");
        setApprovalForAll(proshopaddress, true);
        setApprovalForAll(proshopholder, true);
        setApprovalForAll(proshopmarketplaceaddress, true);
        setApprovalForAll(puckbuddiesplayeraddress, true);
        _proshopItemsCreated.increment();
    }

    function giftItem(uint[] calldata tokenId, uint[] calldata qty, address newOwner) public {
        safeBatchTransferFrom(msg.sender, newOwner, tokenId, qty, "" );
    }

    function burnItems(uint token, uint qty ) external onlyAdmin {
        _burn(proshopholder, token, qty);
    }

    function burnOnEquip(address owner, uint token) external {
        _burn(owner,token, 1);
    }

    function mintOnUnequip(address owner, uint token) external {
        _mint(owner, token, 1, "");
    }

    function getTimestamp() external view returns (uint){
        return block.timestamp;
    }


} 