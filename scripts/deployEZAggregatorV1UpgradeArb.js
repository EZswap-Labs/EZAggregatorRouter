const { ethers } = require("hardhat");

async function main() {
  [alice] = await ethers.getSigners();

  const paramsConstractorArb = {
    weth9: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",       //
    ezswapV2: "0x8Bae5980f8ba5E14B925A7fC673D9B79C6B782c6"     //
  };


  const EZA = await ethers.getContractFactory("EZAggregatorV1RouterUpgradeArb");

  const eza = await upgrades.deployProxy(EZA, [], {
    constructorArgs: [paramsConstractorArb],
  });

  await eza.deployed();

  console.log("contract address is:", eza.address);

  /// upgrade


  // await upgrades.forceImport("0x30cf9343194129956f84f92254f3242bf350ca32", EZA, {
  //   constructorArgs: [paramsConstractorMainnet],
  // })


  ///

  // let ProxyAddress = "0x0B1877395d5b4F93A677cB13544b0061Ee45e8A3"


  // await upgrades.forceImport(ProxyAddress, EZA, {
  //   constructorArgs: [paramsConstractorMainnet],
  // })

  // const eza2 = await upgrades.upgradeProxy(ProxyAddress, EZA, {
  //   constructorArgs: [paramsConstractorMatic]
  // })

  // await eza2.deployed();

  // console.log("upgrade contract address is:", eza2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
