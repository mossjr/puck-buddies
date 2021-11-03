// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract PBMatchupsMarket is IERC721Receiver {

    function getPBMatchupsMarketAddress() public view returns (address) {
        return address(this);
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }


}