// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract PBProShopHolder is ERC1155Holder{
    
    address public admin;
    address proshopmarketplaceaddress;
    uint itemsSold;
    IERC1155 private pbproshopfactory;
    IERC20 public buddies;
        
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin can perform this call");
        _;
    }

    constructor(address _buddiesCoinAddress, address _pbProShopAddress) ERC1155Holder() {
        admin = msg.sender;
        buddies = IERC20(_buddiesCoinAddress);
        pbproshopfactory = IERC1155(_pbProShopAddress);
        itemsSold = 0;
    }

    function getPBProShopHolderAddress() public view returns (address){
        return address(this);
    }

    function getItemsSold() public view onlyAdmin returns (uint) {
        return (itemsSold);
    }
    
   function updateProShopAddress(address proshopaddress) external onlyAdmin {
       pbproshopfactory = IERC1155(proshopaddress);
   }

   function updateProshopMarketplaceAddress(address _ProshopMarketplaceAddress)external onlyAdmin {
       proshopmarketplaceaddress = _ProshopMarketplaceAddress;
   }

    function updateBuddiesCoinAddress(address _buddiesCoinAddress) onlyAdmin external {
        buddies = IERC20(_buddiesCoinAddress);
    }
    
    function purchaseFromStore(uint256 sku, uint value, uint qty) external {
        uint weiFromSku = calculateWeiFromSku(sku);
        uint checkValue = weiFromSku * qty;
        require(checkValue == value, "P1");
        require(pbproshopfactory.balanceOf(address(this), sku) >= 1);
        uint allowance = buddies.allowance(msg.sender, address(this));
        require(allowance >= value, "A1");
        buddies.transferFrom(msg.sender, address(this), value);
        pbproshopfactory.setApprovalForAll(proshopmarketplaceaddress, true);
        pbproshopfactory.safeTransferFrom(address(this), msg.sender, sku, qty, "");
        itemsSold++;
    }

    function transferMatchupToken(uint sku) external {
        pbproshopfactory.safeTransferFrom(address(this), msg.sender, sku, 1, "");
    }

    function calculateWeiFromSku (uint input) public pure returns (uint){
        uint a = input / 100;
        uint b = a % 100000000;
        uint c = b * 10 ** 14;
        return c;
    }
    
}

