// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BuddiesICO {
    uint budsPerBNB;
    address public admin;
    IERC20 public buddies;
    uint budsSold;

    constructor (address _buddiesCoinAddress, uint _budsPerBNB) {
        admin = msg.sender;
        buddies = IERC20(_buddiesCoinAddress);
        budsPerBNB = _budsPerBNB;
    }

    modifier onlyAdmin() {
        require(admin == msg.sender, "a" );
        _;
    }

    function updateAdmin(address _adminAddress) external onlyAdmin {
        admin = _adminAddress;
    }

    function updateBudsPerBNB(uint _budsPerBNB) external onlyAdmin {
        budsPerBNB = _budsPerBNB;
    }

    function getBuddiesICOAddress() external view returns (address) {
        return address(this);
    }

    function getBudsPerBNB() external view returns (uint) {
        return budsPerBNB;
    }

     function getBudsSold() external view returns (uint) {
        return budsSold;
    }

    function getBudsBalance() external view returns (uint) {
        return buddies.balanceOf(address(this));
    }

    function buyBuddies() external payable {
        require(msg.value > 0);
        buddies.transfer(msg.sender, (msg.value*budsPerBNB));
        budsSold = budsSold + msg.value*budsPerBNB;
    }

    function getBNBBalance() external view onlyAdmin returns (uint) {
        return address(this).balance;
    }

    function transferBNB(address payable _to, uint _amount) external onlyAdmin {
        _to.transfer(_amount);
    }

}
