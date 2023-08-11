const { BigNumber, Signer } = require("ethers");
const { ethers } = require("hardhat");

const nft721ABI = require("./abis/ERC721.json");
const nft1155ABI = require("./abis/ERC1155.json");
const wethABI = require("./abis/WETH.json")

const seaportABI = require("./abis/Seaport.json")

describe("aggregator matic buy advance order", function () {
    let alice;
    let nft;
    let sr;
    let weth

    let blocknumber = 40340100
    let mockAddress = "0x69734444A9c9954c21D83B5F062802909dC5112B";  //  whale
    let nftAddress = "0x6b7134df79f3babf83584ea6219ffd4cb2747bbf"  // ufo

    let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    let seaportAddress = "0x00000000000001ad428e4906aE43D8F9852d0dD6"
    let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'


    let postDatas = [{
        "steps": [
            {
                "id": "sale",
                "action": "Confirm transaction in your wallet",
                "description": "To purchase this item you must confirm the transaction and pay the gas fee",
                "kind": "transaction",
                "items": [
                    {
                        "status": "incomplete",
                        "orderIds": [
                            "0x9b520148edd9c4440302e100fd535c674a1c9ff0883c581ef4649ae3091df7bd"
                        ],
                        "data": {
                            "from": "0x59e0b0c67a8f14be8c5855c95cdd2ba95a7f2bbb",
                            "to": "0x00000000000001ad428e4906ae43d8f9852d0dd6",
                            "data": "0xfb0f3ee1000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000027bef8d36cb8000000000000000000000000000e619d091233580cc171e4afdad94d98c16fd5a0c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000006b7134df79f3babf83584ea6219ffd4cb2747bbf0000000000000000000000000000000000000000000000000000000000000c690000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000641a74db000000000000000000000000000000000000000000000000000000006443535b0000000000000000000000000000000000000000000000000000000000000000360c6ebe00000000000000000000000000000000000000001d1c355dbc93d22e0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002e0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000038d7ea4c680000000000000000000000000000000a26b00c1f0df003000390027140000faa71900000000000000000000000000000000000000000000000000470de4df8200000000000000000000000000004df17f9977a174214b247f0625ef8ca3bdc3a64000000000000000000000000000000000000000000000000000000000000000408cf0aa773465fc6608b20586962d7f1c3da1e85a0d3175e87608544ef92b1d8d93a35f96c37635b4589910e276854d1c39a07a5ee2d154adae74d63a9b38b01c",
                            "value": "0x02c68af0bb140000"
                        }
                    }
                ]
            }
        ],
        "path": [
            {
                "orderId": "0x9b520148edd9c4440302e100fd535c674a1c9ff0883c581ef4649ae3091df7bd",
                "contract": "0x6b7134df79f3babf83584ea6219ffd4cb2747bbf",
                "tokenId": "3177",
                "quantity": 1,
                "source": "opensea.io",
                "currency": "0x0000000000000000000000000000000000000000",
                "quote": 0.2,
                "rawQuote": "200000000000000000"
            }
        ]
    }]

    beforeEach(async () => {

        // await network.provider.request({
        //     method: "hardhat_reset",
        //     params: [
        //         {
        //             chainId: 137,
        //             forking: {
        //                 jsonRpcUrl: "https://1rpc.io/matic",
        //                 blockNumber: blocknumber,
        //             },
        //         },
        //     ],
        // });


        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [mockAddress],
        });
        alice = await ethers.provider.getSigner(mockAddress);

        nft = new ethers.Contract(nftAddress, nft721ABI, alice);

        weth = new ethers.Contract(wethAddress, wethABI, alice)
        usdc = new ethers.Contract(usdcAddress, wethABI, alice)
        seaport = new ethers.Contract(seaportAddress, seaportABI, alice)

        seaportInterface = new ethers.utils.Interface(seaportABI)


        const paramsConstractorMatic = {
            weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",  // wmatic
            reservoir: "0x819327e005A3ed85F7b634e195b8F25D4a2a45f8",  // ReservoirV6_0_0 matic
            seaportModule: "0xe225aFD0B78a265a60CCaEB1c1310e0016716E7B", // SeaportModule 
            ezswap: "0x6D7fBa7979334fC173a42eA8FEF31698318a845A", // ezswaprouter matic
            seaport: "0x00000000000001ad428e4906aE43D8F9852d0dD6", // seaport
            ezswapV2: "0x183Eb45a05EA5456A6D329bb76eA6C6DABb375a6"   //  ezswapv2

        };

        sr = await (
            await ethers.getContractFactory("EZAggregatorV1RouterUpgradeMatic")
        ).deploy(paramsConstractorMatic);


    });

    it("router  buy", async () => {

        ///////////////////// 1 approve
        await usdc.approve(sr.address, ethers.constants.MaxUint256)
        await usdc.approve(seaport.address, ethers.constants.MaxUint256)

        await weth.approve(sr.address, ethers.constants.MaxUint256)
        await weth.approve(seaport.address, ethers.constants.MaxUint256)


        console.log("router address:", sr.address)
        console.log("before execute nft balance is:", await nft.balanceOf(alice._address))
        console.log("before execute weth balance is:", await weth.balanceOf(alice._address))


        ///////////////////// 1 approve
        await usdc.approve(sr.address, ethers.constants.MaxUint256)
        await usdc.approve(seaport.address, ethers.constants.MaxUint256)

        await weth.approve(sr.address, ethers.constants.MaxUint256)
        await weth.approve(seaport.address, ethers.constants.MaxUint256)



        ///////////////////// 2 encode date
        let SeaportLists = [];
        let totalValue = ethers.BigNumber.from('0');
        for (let i = 0; i < postDatas.length; i++) {

            let stepslength = postDatas[i].steps.length

            if (postDatas[i].steps[stepslength - 1].items[0].data.to != seaportAddress.toLowerCase()) {
                continue
            }

            let inputdata = postDatas[i].steps[stepslength - 1].items[0].data.data

            if (postDatas[i].path[0].currency == "0x0000000000000000000000000000000000000000") {
                let value = ethers.BigNumber.from(postDatas[i].path[0].rawQuote)
                totalValue = totalValue.add(value)
            }


            const SeaportList = {
                tokenAddress: postDatas[i].path[0].currency,
                tokenValue: postDatas[i].path[0].rawQuote,
                inputDate: inputdata,
                nftStandard: 721,   // identify from outside
                nftAddress: postDatas[i].path[0].contract,
                nftTokenId: postDatas[i].path[0].tokenId,
                nftAmount: postDatas[i].path[0].quantity
            };

            SeaportLists.push(SeaportList);
        }


        // process.exit() 
        ///////////////////////////////   3  send tx
        let input = ethers.utils.defaultAbiCoder.encode(
            [
                "(address tokenAddress, uint256 tokenValue, bytes inputDate, uint256 nftStandard, address nftAddress, uint256 nftTokenId, uint256 nftAmount)[]",
            ],
            [SeaportLists]
        );

        await sr.connect(alice)['execute(bytes,bytes[],uint256)']('0x10', [input], 2000000000, { value: totalValue });


        console.log("after execute nft balance is:", await nft.balanceOf(alice._address))
        console.log("after execute usdc balance is:", await usdc.balanceOf(alice._address))

    });
});
