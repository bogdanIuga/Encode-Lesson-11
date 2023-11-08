import { ethers } from "hardhat";
import { MyToken, MyToken__factory } from "../typechain-types";

async function main() {
    const accounts = await ethers.getSigners();
    const tokenContractFactory = new MyToken__factory(accounts[0]);
    const tokenContract = await tokenContractFactory.deploy();
    await tokenContract.waitForDeployment();
    const tokenContractAddress = await tokenContract.getAddress();
    console.log(`Contract deployed at ${tokenContractAddress}`);

    const initialSupply = await tokenContract.totalSupply();
    console.log(`The initial supply of this token is ${initialSupply.toString()} decimals units`);

    const code = await tokenContract.MINTER_ROLE();
    const roleTx = await tokenContract.grantRole(code, accounts[2].address);
    await roleTx.wait();

    //mint fails
    // const mintTx = await tokenContract.connect(accounts[1]).mint(accounts[0].address, 2);
    // await mintTx.wait();

    //mint success
    const mintTx = await tokenContract.connect(accounts[2]).mint(accounts[0].address, 2);
    await mintTx.wait();

    const [name, symbol, decimals, totalSupply] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.totalSupply(),
    ]);
    console.log({ name, symbol, decimals, totalSupply });

    const tx = await tokenContract.transfer(accounts[1].address, 1);
    await tx.wait();

    // const myBalance = await tokenContract.balanceOf(accounts[0].address);
    // console.log(`My Balance is ${myBalance.toString()} decimals units`);
    // const otherBalance = await tokenContract.balanceOf(accounts[1].address);
    // console.log(
    //     `The Balance of Acc1 is ${otherBalance.toString()} decimals units`
    // );

    //converted balances
    const myBalance = await tokenContract.balanceOf(accounts[0].address);
    console.log(`My Balance is ${ethers.formatUnits(myBalance)} ${symbol} units`);
    const otherBalance = await tokenContract.balanceOf(accounts[1].address);
    console.log(
        `The Balance of Acc1 is ${ethers.formatUnits(otherBalance)} ${symbol} units`
    );
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});