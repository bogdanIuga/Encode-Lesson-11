// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IMyToken {
    function mint(address to, uint256 amount) external;
}

interface IMyNFT {}

contract TokenSale {
    uint256 public ratio;
    uint256 public price;
    IMyToken public paymentToken;
    IMyNFT public nftContract;

    constructor(
        uint256 _ratio,
        uint256 _price,
        IMyToken _paymentToken,
        IMyNFT _nftContract
    ) {
        ratio = _ratio;
        price = _price;
        paymentToken = _paymentToken;
        nftContract = _nftContract;
    }

    function buyTokens() external payable {
        paymentToken.mint(msg.sender, msg.value * ratio);
    }
}
