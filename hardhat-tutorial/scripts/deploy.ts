import { ethers } from "hardhat";
import "dotenv/config";
import { CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS } from "../constants/index";

// * Deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

async function main() {
    const cryptoDevTokenAddress = CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS;
    /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so exchangeContract here is a factory for instances of our Exchange contract.
  */
    const exchangeContract = await ethers.getContractFactory("Exchange");

    // here we deploy the contract
    const deployedExchangeContract = await exchangeContract.deploy(cryptoDevTokenAddress);
    await deployedExchangeContract.deployed();

    // print the address of the deployed contract
    console.log("Exchange Contract Address:", deployedExchangeContract.address);
}

// Call the main function and catch if there are any errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
