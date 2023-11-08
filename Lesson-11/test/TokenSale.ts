import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from "chai";
import { ethers } from "hardhat"
import { MyToken } from '../typechain-types';

const TEST_RATIO = 10;
const TEST_PRICE = 5;
const TEST_BUT_VALUE = 10; // trying to send 10 eth to buy tokens

describe("NFT Shop", async () => {
    async function deployContracts() {
        const [accounts, myTokenContractFactory, myNFTContractFactory, tokenSaleContractFactory,] = await Promise.all([
            ethers.getSigners(),
            ethers.getContractFactory("MyToken"),
            ethers.getContractFactory("MyNFT"),
            ethers.getContractFactory("TokenSale")
        ]);

        const myTokenContract = await myTokenContractFactory.deploy();
        await myTokenContract.waitForDeployment();

        const myNFTContract = await myNFTContractFactory.deploy();
        await myNFTContract.waitForDeployment();

        const tokenSaleContract = await tokenSaleContractFactory.deploy(TEST_RATIO, TEST_PRICE, myTokenContract.target, myNFTContract.target);
        await tokenSaleContract.waitForDeployment()

        const MINTER_ROLE = await myTokenContract.MINTER_ROLE();
        const roleTx = await myTokenContract.grantRole(MINTER_ROLE, tokenSaleContract.target);
        await roleTx.wait();

        // const roleNftTx = await myNFTContract.grantRole(MINTER_ROLE, tokenSaleContract.target);
        // await roleNftTx.wait();

        return { accounts, myTokenContract, myNFTContract, tokenSaleContract };
    }

    describe("When the Shop contract is deployed", async () => {
        it("defines the ratio as provided in parameters", async () => {
            const { tokenSaleContract } = await loadFixture(deployContracts);

            const ratio = await tokenSaleContract.ratio();
            expect(ratio).to.equal(TEST_RATIO);
        })
        it("defines the price as provided in parameters", async () => {
            const { tokenSaleContract } = await loadFixture(deployContracts);

            const price = await tokenSaleContract.price();
            expect(price).to.equal(TEST_PRICE);
        });
        it("uses a valid ERC20 as payment token", async () => {
            const { myTokenContract } = await loadFixture(deployContracts);

            await expect(myTokenContract.totalSupply()).not.to.be.reverted;
            await expect(myTokenContract.balanceOf(ethers.ZeroAddress)).not.to.be.reverted;
        });
        it("uses a valid ERC721 as NFT collection", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When a user buys an ERC20 from the Token contract", async () => {
        async function buyTokens() {
            const { accounts, tokenSaleContract, myNFTContract, myTokenContract } = await loadFixture(deployContracts);
            const tx = await tokenSaleContract
                .connect(accounts[1])
                .buyTokens({ value: TEST_BUT_VALUE });

            const txReceipt = await tx.wait();

            return { accounts, tokenSaleContract, myTokenContract, myNFTContract };
        }
        it("charges the correct amount of ETH", async () => {
            throw new Error("Not implemented");
        })
        it("gives the correct amount of tokens", async () => {
            const { accounts, myTokenContract } = await loadFixture(buyTokens);
            const balance = await myTokenContract.balanceOf(accounts[1].address);

            expect(balance).to.eq(100);
        });
    })
    describe("When a user burns an ERC20 at the Shop contract", async () => {
        it("gives the correct amount of ETH", async () => {
            throw new Error("Not implemented");
        })
        it("burns the correct amount of tokens", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When a user buys an NFT from the Shop contract", async () => {
        it("charges the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        })
        it("gives the correct NFT", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When a user burns their NFT at the Shop contract", async () => {
        it("gives the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        });
    })
    describe("When the owner withdraws from the Shop contract", async () => {
        it("recovers the right amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        })
        it("updates the owner pool account correctly", async () => {
            throw new Error("Not implemented");
        });
    });
});