// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../contracts/PBXP.sol";

contract PBXPShopHolder is ERC1155Holder{
    
    address public admin;
    IERC1155 private pbxpShopFactory;
    PBXP private PBXPToken;
    
        
    modifier onlyAdmin() {
        require(msg.sender == admin, "A1");
        _;
    }

    constructor(address _pbxpAddress, address _pbxpShopaddress) ERC1155Holder() {
        admin = msg.sender;
        PBXPToken = PBXP(_pbxpAddress);
        pbxpShopFactory = IERC1155(_pbxpShopaddress);
    }

    function getPBXPShopHolderAddress() public view returns (address) {
        return address(this);
    }

    function updatePBXPTokenAddress(address _pbxpAddress) external onlyAdmin{
        PBXPToken = PBXP(_pbxpAddress);
    }
    
   function updateProShopAddress(address _pbxpShopaddress) external onlyAdmin {
       pbxpShopFactory = IERC1155(_pbxpShopaddress);
   }
    
    function buyItems(uint256 sku, uint value) external {
        uint weiFromSku = calculateWeiFromSku(sku);
        require(weiFromSku == value, "V1");
        require(pbxpShopFactory.balanceOf(address(this), sku) >= 1);
        PBXPToken.safeTransferFrom(msg.sender, address(this), 0, value,"");
        pbxpShopFactory.safeTransferFrom(address(this), msg.sender, sku, 1, "");
    }

    function transferMatchupToken(uint sku) external {
        pbxpShopFactory.safeTransferFrom(address(this), msg.sender, sku, 1, "");
    }

    function calculateWeiFromSku (uint input) public pure returns (uint){
        uint a = input / 100;
        uint b = a % 100000000;
        uint c = b * 10 ** 14;
        return c;
    }

    function getBNBBalance() external view onlyAdmin returns (uint) {
        return address(this).balance;
    }

    function transferBNB(address payable _to, uint _amount) external onlyAdmin {
        _to.transfer(_amount);
    }
    
}