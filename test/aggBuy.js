const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nftABI = require("./abis/ERC721.json");

describe("aggregator buy nft test", function () {
  let alice;
  let nft;
  let sr;

  let blocknumber = 16428226
  let mockAddress = "0xe92d1a43df510f82c66382592a047d288f85226f";
  let nftAddress = "0x8fb6ec891f80d0da0e966a54ed403f5149a347c8"
  // let tokenid = 7
  // let nftTokenId = "0x5d9cc2b3aefdbe8ec0f69361248e27bfb6c06202:6"

  beforeEach(async () => {

    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          chainId: 1,
          forking: {
            jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/b5Av64vYI2CowvlC4ezAAyDrbdNQ0rPx",
            blockNumber: blocknumber,
          },
        },
      ],
    });


    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [mockAddress],
    });

    alice = await ethers.provider.getSigner(mockAddress);

    nft = new ethers.Contract(nftAddress, nftABI, alice);

    const paramsConstractorMainnet = {
      weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      reservoir: "0x178A86D36D89c7FDeBeA90b739605da7B131ff6A",
      seaportModule: "0x3729014ef28f01B3ddCF7f980D925E0B71b1F847",
      looksRareModule: "0x385df8CBC196f5f780367F3cDC96aF072a916F7E",
      x2y2Module: "0x613D3c588F6B8f89302b463F8F19f7241B2857E2",
      sudoswap: "0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329",
      ezswap: "0xa63eC144d070a1BF19a7577C88c580E7de92E0fc",
    };

    const SR = await ethers.getContractFactory("EZAggregatorV1Router")
    sr = await SR.attach("0x6afb4Bb77e6770f0584CB83AeA5e6E57EEe346C6")  // 0xac3e3114784b46a8b201c07B69Db87BBCDbc9179  // 0x6afb4Bb77e6770f0584CB83AeA5e6E57EEe346C6

    //////////////////////
  });

  it("buy nft through simpleRouter", async () => {
    console.log(
      "taker address is:",
      alice._address,
      "relayer address is:",
      sr.address
    );

    console.log(
      "before execute taker nft balance:",
      await nft.balanceOf(alice._address),
      "before execute relayer nft balance:",
      await nft.balanceOf(sr.address)
    );
    /////

    // await alice.sendTransaction({
    //   "to": "0x00000000006c3852cbef3e08e8df289169ede581",
    //   "data": "0xfb0f3ee1000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010e2f12732b2000000000000000000000000000f13654d873bd0b8312521302badeb103ece157fe000000000000000000000000004c00500000ad104d7dbd00e3ae0a5c00560c000000000000000000000000008fb6ec891f80d0da0e966a54ed403f5149a347c8000000000000000000000000000000000000000000000000000000000000070e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000063c6c7b50000000000000000000000000000000000000000000000000000000063c818b50000000000000000000000000000000000000000000000000000000000000000360c6ebe00000000000000000000000000000000000000009554d902b0a65b820000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000006ed83c14fe0000000000000000000000000000000a26b00c1f0df003000390027140000faa7190000000000000000000000000000000000000000000000000000000000000041ebddf309d1d9ee115b9bba5c212182bf1f101169a82e3d76bfc32cfaad300a7161a5080f698b1200fa1d654c8e3cec62f8304db3c516cafc3d122d274c4ec21d1c00000000000000000000000000000000000000000000000000000000000000",
    //   "value": "0x01151c96347b0000"
    // })



    // opensea
    let dataApi = {
      // "from": "0xac3e3114784b46a8b201c07b69db87bbcdbc9179",
      "to": "0x178a86d36d89c7fdebea90b739605da7b131ff6a",
      "data": "0x760f2a0b00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000020794ef7693441799a3f38fcc22a12b3e04b9572000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000001151c96347b000000000000000000000000000000000000000000000000000000000000000005e476af662900000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000e92d1a43df510f82c66382592a047d288f85226f000000000000000000000000e92d1a43df510f82c66382592a047d288f85226f000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000001151c96347b000000000000000000000000000000000000000000000000000000000000000005c000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000f13654d873bd0b8312521302badeb103ece157fe000000000000000000000000004c00500000ad104d7dbd00e3ae0a5c00560c000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000063c6c7b50000000000000000000000000000000000000000000000000000000063c818b50000000000000000000000000000000000000000000000000000000000000000360c6ebe00000000000000000000000000000000000000009554d902b0a65b820000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000008fb6ec891f80d0da0e966a54ed403f5149a347c8000000000000000000000000000000000000000000000000000000000000070e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010e2f12732b2000000000000000000000000000000000000000000000000000010e2f12732b2000000000000000000000000000f13654d873bd0b8312521302badeb103ece157fe0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006ed83c14fe0000000000000000000000000000000000000000000000000000006ed83c14fe0000000000000000000000000000000a26b00c1f0df003000390027140000faa7190000000000000000000000000000000000000000000000000000000000000041ebddf309d1d9ee115b9bba5c212182bf1f101169a82e3d76bfc32cfaad300a7161a5080f698b1200fa1d654c8e3cec62f8304db3c516cafc3d122d274c4ec21d1c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "value": "0x01151c96347b0000"
    }

    let input;

    if (dataApi.to == "0x178a86d36d89c7fdebea90b739605da7b131ff6a") {
      input = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "bytes"],
        [dataApi.value, dataApi.data]
      );
    } else {
      console.log("offerMarketId error");
      return;
    }

    let tx = await sr['execute(bytes,bytes[],uint256)']('0x00', [input], 2000000000, { value: dataApi.value });
    // console.log(tx)

    console.log(
      "after execute taker nft balance:",
      await nft.balanceOf(alice._address),
      "after execute relayer nft balance:",
      await nft.balanceOf(sr.address)
    );
  });
});