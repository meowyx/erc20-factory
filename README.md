# ERC20 Token Factory Project

This Hardhat project contains:
1. A base ERC20 token contract
2. A factory contract to deploy multiple instances of the ERC20 token
3. Configuration files and test scripts

## Project Structure

```
erc20-factory/
├── contracts/
│   ├── BaseERC20Token.sol
│   └── ERC20Factory.sol
├── test/
│   └── ERC20Factory.test.js
├── ignition/
│   └── modules/
│       └── tokenFactory.js
├── hardhat.config.js
└── package.json
```

## Installation

1. Clone the repository:

```
git clone https://github.com/meowyx/erc20-factory
cd erc20-factory
```

2. Install dependencies:

```
npm install
```

## Usage

1. Compile the contracts:
``` 
npx hardhat compile
```

2. Deploy the contracts:

```
npx hardhat ignition deploy ignition/modules/tokenFactory.ts --network linea-testnet
```

3. Test the contracts:

```
npx hardhat test
```
