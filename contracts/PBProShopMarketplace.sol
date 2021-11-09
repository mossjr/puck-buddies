// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract PBProShopMarketplace is ERC1155Holder, ReentrancyGuard {
    address admin;
    address pbProShopFactoryAddress;
    address feesAddress;
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsComplete;
    uint256 marketFeePercent = 400;
    IERC1155 public proShopItems;
    IERC20 public buddies;

constructor(address _buddiesCoinAddress, address _pbProShopFactoryAddress, address _feesAddress) {
    admin = msg.sender;
    buddies = IERC20(_buddiesCoinAddress);
    proShopItems = IERC1155(_pbProShopFactoryAddress);
    feesAddress = _feesAddress;
}

struct ProShopMarketItem {
    uint marketListingId;
    uint tokenId;
    uint sellingPrice;
    address seller;
    address buyer;
    bool valid;
}

mapping(uint => ProShopMarketItem) private _proShopMarketItems;

 modifier onlyAdmin() {
        require(admin == msg.sender, "This function is only accessable by the admin of the contract" );
        _;
  }

function isAdmin() public view returns (bool){
        if(admin == msg.sender){
            return true;
        } else return false;
  }

function updateBuddiesCoinAddress(address _buddiesCoinAddress) onlyAdmin external {
     buddies = IERC20(_buddiesCoinAddress);
  }

function getPBProShopMarketplaceAddress() public view returns (address){
    return address(this);
  }

function getProshopMarketFeePercent() public view returns (uint) {
    return marketFeePercent;
  }

function updateMarketFeePercent(uint value) onlyAdmin external returns (uint){
    marketFeePercent = value;
    return marketFeePercent;
  }

function getMarketFeePayableAddress() public view returns (address) {
      return feesAddress;
  }

function getMarketplaceStats() external view onlyAdmin returns (uint, uint) {
    return (_itemIds.current(), _itemsComplete.current());
}

function updateFeePayableAddress(address payable newaddress) onlyAdmin external returns (address) {
    feesAddress = newaddress;
    return feesAddress;
  }

function createProShopMarketItem(uint _tokenId, uint _sellingPrice) public nonReentrant {
    require(_sellingPrice > 0, "Price cannot be 0");
    _itemIds.increment();
    _proShopMarketItems[_itemIds.current()] = ProShopMarketItem(
        _itemIds.current(),
        _tokenId,
        _sellingPrice,
        msg.sender,
        address(0),
        true
        );
    proShopItems.safeTransferFrom(msg.sender, address(this), _tokenId, 1, "");

}

function createProShopMarketplaceSale(uint _marketTokenId) external nonReentrant {
    require(_proShopMarketItems[_marketTokenId].valid == true, "This is an invalid market Token");
    uint buddiesPayout = ((_proShopMarketItems[_marketTokenId].sellingPrice/(marketFeePercent+10000))*10000);
    uint feesPayout = _proShopMarketItems[_marketTokenId].sellingPrice - buddiesPayout;
    _proShopMarketItems[_marketTokenId].buyer = msg.sender;
    _proShopMarketItems[_marketTokenId].valid = false;
    buddies.transferFrom(msg.sender, _proShopMarketItems[_marketTokenId].seller, buddiesPayout);
    buddies.transferFrom(msg.sender, feesAddress, feesPayout);
    proShopItems.safeTransferFrom(address(this), msg.sender,  _proShopMarketItems[_marketTokenId].tokenId, 1, "");
    _itemsComplete.increment();
}

function cancelProShopMarketplaceSale(uint _marketTokenId) external nonReentrant {
    require(_proShopMarketItems[_marketTokenId].valid == true, "This is an invalid market Token");
    require(_proShopMarketItems[_marketTokenId].seller == msg.sender, "Only the owner of this sale can cancel this sale");
     _proShopMarketItems[_marketTokenId].valid = false;
    proShopItems.safeTransferFrom(address(this), msg.sender,  _proShopMarketItems[_marketTokenId].tokenId, 1, "");
    _itemsComplete.increment(); 
}

function getProShopMarketItems() public view returns (ProShopMarketItem[] memory) {
    uint unsoldItemCount = _itemIds.current() - _itemsComplete.current();
    uint currentIndex = 0;

    ProShopMarketItem[] memory items = new ProShopMarketItem[](unsoldItemCount);
    for (uint i = 0; i < _itemIds.current(); i++) {
        if (_proShopMarketItems[i + 1].valid == true) {
            uint currentId = _proShopMarketItems[i + 1].marketListingId;
            ProShopMarketItem storage currentItem = _proShopMarketItems[currentId];
            items[currentIndex] = currentItem;
            currentIndex++;
    }
}
return items;
}


}