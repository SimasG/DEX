import { BigNumber, Contract, ethers } from "ethers";
import {
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
} from "../constants/index";

/**
 * addLiquidity helps add liquidity to the exchange,
 * If the user is adding initial liquidity, user decides the ether and CD tokens he wants to add
 * to the exchange. If he is adding the liquidity after the initial liquidity has already been added
 * then we calculate the Crypto Dev tokens he can add, given the Eth he wants to add by keeping the ratios
 * constant
 */
// ** These are BigNumbers, right?
export const addLiquidity = async (
    signer: ethers.providers.JsonRpcSigner,
    addCDAmountWei: BigNumber,
    addEtherAmountWei: BigNumber
) => {
    try {
        // create a new instance of the token contract
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);
        // create a new instance of the exchange contract
        const exchangeContract = new Contract(EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI, signer);
        // Because CD tokens are an ERC20, user would need to give the contract allowance
        // to take the required number CD tokens out of his contract
        let tx = await tokenContract.approve(EXCHANGE_CONTRACT_ADDRESS, addCDAmountWei.toString());
        await tx.wait();
        // After the contract has the approval, add the ether and cd tokens in the liquidity
        tx = await exchangeContract.addLiquidity(addCDAmountWei, {
            value: addEtherAmountWei,
        });
        await tx.wait();
    } catch (error) {
        console.error(error);
    }
};

// ** Does it matter if we first write to deposit CD & then choose/calculate the required ETH amount, or does it have to be
// ** 1. Specify ETH amount 2. Then choose/calculate CD amount? It seems like it's the latter.
/**
 * calculateCD calculates the CD tokens that need to be added to the liquidity
 * given `_addEtherAmountWei` amount of ether
 */
// If `addEther` isn't specified, it's 0 by default
// ** These are BigNumbers, right?
export const calculateCD = async (_addEther = "0", etherBalanceContract: BigNumber | 0, cdTokenReserve: BigNumber) => {
    // `_addEther` is a string, we need to convert it to a Bignumber before we can do our calculations
    // We do that using the `parseEther` function from `ethers.js`
    const _addEtherAmountWei = ethers.utils.parseEther(_addEther);

    // Ratio needs to be maintained when we add liquidity.
    // We need to let the user know for a specific amount of ether how many `CD` tokens
    // He can add so that the price impact is not large
    // ** Is it `Crypto Dev tokens balance`? Shouldn't it be `Crypto Dev tokens balance reserve in the contract?`
    // The ratio we follow is (amount of Crypto Dev tokens to be added) / (Crypto Dev tokens balance) = (Eth that would be added) / (Eth reserve in the contract)
    // So by maths we get (amount of Crypto Dev tokens to be added) = (Eth that would be added * Crypto Dev tokens balance) / (Eth reserve in the contract)

    const cryptoDevTokenAmount = _addEtherAmountWei.mul(cdTokenReserve).div(etherBalanceContract);
    return cryptoDevTokenAmount;
};
