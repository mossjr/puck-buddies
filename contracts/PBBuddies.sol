// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract PBBuddies is ERC20 {
    address public admin;
   constructor () ERC20('Buddies', 'BUDDIES') {
       _mint(msg.sender, 21000000 * 10 ** 18);
       admin = msg.sender;
   }
   
   function burn(uint amount) external {
       _burn(msg.sender, amount);
   }
    
   function getBuddiesAddress() external view returns (address) {
       return address(this);
   }
}