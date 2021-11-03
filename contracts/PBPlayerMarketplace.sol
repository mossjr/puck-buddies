// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract PBPlayerMarketplace is ReentrancyGuard {
  address admin;
  address pbPlayersAddress;
  address feesAddress;
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;
  Counters.Counter private _itemsCancelled;
  uint256 marketFeePercent = 400;
  IERC20 public buddies;

constructor(address _buddiesCoinAddress, address _pbPlayersAddress, address _feesAddress) {
    admin = msg.sender;
    buddies = IERC20(_buddiesCoinAddress);
    pbPlayersAddress = _pbPlayersAddress;
    feesAddress = _feesAddress;
 }
    

  struct MarketItem {
    uint256 itemId; 
    bool valid; 
    address nftContract; 
    uint256 tokenId; 
    address seller;
    address owner; 
    uint256 totalPrice;
    uint256 sellerPrice; 
    uint256 marketfee;
  }
  
  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    bool valid,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 totalprice,
    uint256 price,
    uint256 fee
  );

  modifier onlyAdmin() {
        require(admin == msg.sender, "A1" );
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

  function getPBMarketplaceAddress() public view returns (address){
    address result = address(this);
    return result;
  }

  function getMarketFeePercent() public view returns (uint) {
    return marketFeePercent;
  }

  function updateMarketFeePercent(uint value) onlyAdmin external returns (uint){
    marketFeePercent = value;
    return marketFeePercent;
  }

 function getMarketFeePayableAddress() public view returns (address) {
      return feesAddress;
  }

  function updateFeePayableAddress(address payable newaddress) onlyAdmin external returns (address) {
    feesAddress = newaddress;
    return feesAddress;
  } 

  function createMarketItem(address nftContract, uint256 tokenId, uint256 sellerprice, uint256 fee) public payable nonReentrant {
    require(sellerprice > 0, "M0");
    require(fee > 0, "F0");
    uint totalPrice = sellerprice + fee;

    //set Marketplace Id
    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    //create MarketItem mapping
    idToMarketItem[itemId] = MarketItem(
      itemId,
      true,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      totalPrice,
      sellerprice,
      fee
    );

    
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      true,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      totalPrice,
      sellerprice,
      fee
    );
  }

  function createMarketSale(address nftContract, uint256 _itemId, uint256 _sellPrice, uint256 _fee) external nonReentrant {
    //ERC20 Transacting
    uint _totalPrice = _sellPrice + _fee;
    require(_totalPrice == idToMarketItem[_itemId].totalPrice, "M2");
    uint allowance = buddies.allowance(msg.sender, address(this));
    require(allowance >= _totalPrice, "A1");

    buddies.transferFrom(msg.sender, feesAddress, _fee);
    buddies.transferFrom(msg.sender, idToMarketItem[_itemId].seller, _sellPrice);

    //ERC721 Transacting
    idToMarketItem[_itemId].owner = payable(msg.sender); //set the final owner of the nft in relation to this market listing
    idToMarketItem[_itemId].valid = false;
    IERC721(nftContract).safeTransferFrom(address(this), msg.sender, idToMarketItem[_itemId].tokenId); //transfer the nft asset to the buyer
    //Update State Variables
    _itemsSold.increment();
  }

    function cancelMarketSale(address nftContract, uint _itemId) external nonReentrant {
    //ERC721 Transacting
    require(msg.sender == idToMarketItem[_itemId].seller, "M3");
    idToMarketItem[_itemId].owner = payable(msg.sender); //set the final owner of the nft in relation to this market listing
    idToMarketItem[_itemId].valid = false;
    IERC721(nftContract).safeTransferFrom(address(this), msg.sender, idToMarketItem[_itemId].tokenId); 
    //Update State Variables
    _itemsCancelled.increment(); 
  }


  function getMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current(); 
    uint unsoldItemCount = itemCount - _itemsSold.current() - _itemsCancelled.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = idToMarketItem[i + 1].itemId;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

}



