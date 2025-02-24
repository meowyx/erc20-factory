// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseERC20Token.sol";

contract ERC20Factory {
    address public owner;
    mapping(address => bool) public tokenExists;
    address[] public allTokens;

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply,
        address owner
    );

    constructor() {
        owner = msg.sender;
    }

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) external returns (address) {
        BaseERC20Token newToken = new BaseERC20Token(
            name,
            symbol,
            initialSupply,
            msg.sender
        );

        address tokenAddress = address(newToken);
        tokenExists[tokenAddress] = true;
        allTokens.push(tokenAddress);

        emit TokenCreated(
            tokenAddress,
            name,
            symbol,
            initialSupply,
            msg.sender
        );

        return tokenAddress;
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }

    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }
}
