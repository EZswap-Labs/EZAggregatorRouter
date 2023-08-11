# EZAggregatorRouter

This is an upgradable version fork of Universal Router, The `EZAggregatorRouter` is a ERC20 and NFT swap router that allows users greater flexibility when performing trades across multiple token types.

This flexible command style allows us to provide users with:

* Purchases of NFTs with reservoir(an NFT aggregator marketplace)
* Purchases of NFTs with EZSwap
* Wrapping and Unwrapping of native token(ETH, Matic, etc.)

Transactions are encoded using a string of commands, allowing users to have maximum flexibility over what they want to perform. With all of these features available in a single transaction, the possibilities available to users are endless.



## Contract Overview


The codebase consists of the `EZAggregatorRouter` contract, and all of its dependencies. The purpose of the `EZAggregatorRouter` is to allow users to unify EZSwap and reservoir with NFT purchases across some marketplaces in a single transaction.

### EZAggregatorRouter command encoding

Calls to `Router.execute`, the entrypoint to the contracts, provide 2 main parameters:

- `bytes commands`: A bytes string. Each individual byte represents 1 command that the transaction will execute.
- `bytes[] inputs`: An array of bytes strings. Each element in the array is the encoded parameters for a command.

`commands[i]` is the command that will use `inputs[i]` as its encoded input parameters.

Through function overloading there is also an optional third parameter for the `execute` function:

- `uint256 deadline`: The timestamp deadline by which this transaction must be executed. Transactions executed after this specified deadline will revert.

#### How the command byte is structured

Each command is a `bytes1` containing the following 8 bits:

```
 0 1 2 3 4 5 6 7
┌─┬─┬───────────┐
│f│r|  command  │
└─┴─┴───────────┘
```


- `f` is a single bit flag, that signals whether or not the command should be allowed to revert. If `f` is `false`, and the command reverts, then the entire transaction will revert. If `f` is `true` and the command reverts then the transaction will continue, allowing us to achieve partial fills. If using this flag, be careful to include further commands that will remove any funds that could be left unused in the `UniversalRouter` contract.

- `r` is one bit of reserved space. This will allow us to increase the space used for commands, or add new flags in future.

- `command` is a 6 bit unique identifier for the command that should be carried out. The values of these commands can be found within `Commands.sol`, or can be viewed in the table below.

Some of the commands in the middle of the series are unused. These gaps allowed us to create gas-efficiencies when selecting which command to execute. By upgrading smart contract, they can be used in the future.

#### How the input bytes are structures

Each input bytes string is merely the abi encoding of a set of parameters. Depending on the command chosen, the input bytes string will be different. For example:

The inputs for `EZSWAP_BUY` is the encoding of 2 parameters:

- `uint256` The value of native token
- `bytes` abi encode of buy command

Whereas in contrast `EZSWAP_SELL` has just 3 parameters encoded:

- `bytes` abi encode of sell command
- `address` nft owner
- `LSSVMSellNftStruct[]` The struct of sell nft params

Encoding parameters in a bytes string in this way gives us maximum flexiblity to be able to support many commands which require different datatypes in a gas-efficient way.

For a more detailed breakdown of which parameters you should provide for each command take a look at the `Dispatcher.dispatch` function.

Developer documentation to give a detailed explanation of the inputs for every command will be coming soon!


## Building and testing

```sh
npm install
npx hardhat test test/xxx.js
```



## Deploying

You need to configure `.env` according to the `.example.env`

```sh
npx hardhat run scripts/deployxxxx.js --network mainnet
```

Contracts can be deployed via the  above command. 



## Verify

You need to enter constructorArguments to verify the contract.
```sh
npx hardhat run scripts/verify.js --network matic
```
