import { Contract, ethers } from "ethers";
import {
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
} from "../constants/index";

/**
 * getEtherBalance: Retrieves the ether balance of the user or the contract
 */
export const getEtherBalance = async (
    provider: ethers.providers.Web3Provider,
    address: string | null,
    contract = false
) => {
    try {
        // If the caller has set the `contract` boolean to true, retrieve the balance of
        // ether in the `exchange contract`, if it is set to false, retrieve the balance
        // of the user's address
        if (contract) {
            // ** `getBalance` is an ethers func. It only returns `eth` right? Ask in the community
            const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
            return balance;
        } else {
            // @ts-ignore
            // ** Ignoring this TS error for now
            const balance = await provider.getBalance(address);
            return balance;
        }
    } catch (err) {
        console.error(err);
        // ** Why are we returning specifically 0 here?
        return 0;
    }
};

/**
 * getCDTokensBalance: Retrieves the Crypto Dev tokens in the account
 * of the provided `address`
 */
export const getCDTokensBalance = async (provider: ethers.providers.Web3Provider, address: string) => {
    try {
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
        // ** ethers' `balanceOf()` can be used to fetch non-eth token balance, right?
        // `tokenContract` is an ERC20 contract with its native token of CD
        const balanceOfCryptoDevTokens = await tokenContract.balanceOf(address);
        return balanceOfCryptoDevTokens;
    } catch (err) {
        console.error(err);
    }
};

/**
 * getLPTokensBalance: Retrieves the amount of LP tokens in the account
 * of the provided `address`
 */
export const getLPTokensBalance = async (provider: ethers.providers.Web3Provider, address: string) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        // `exchangeContract` is an ERC20 contract with its native token of CDLP -> CDLP token
        // reserves are stored there
        // ** How does it work though? Where do the DEXes keep their liquidity pools then? Does it all
        // ** stay in this same contract?
        const balanceOfLPTokens = await exchangeContract.balanceOf(address);
        return balanceOfLPTokens;
    } catch (error) {
        console.error(error);
    }
};

/**
 * getReserveOfCDTokens: Retrieves the amount of CD tokens in the
 * exchange contract address
 */
export const getReserveOfCDTokens = async (provider: ethers.providers.Web3Provider) => {
    try {
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, provider);
        // `getReserve()` -> a func from `Exchange.sol` that fetches CD token reserve
        // It doesn't seem possible to fetch the reserve value of tokens that aren't the native token of the ERC20 contract
        const reserve = await exchangeContract.getReserve();
        return reserve;
    } catch (error) {
        console.error(error);
    }
};
