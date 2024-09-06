import { networkConfig } from '../constants.js';
import { createPublicClient, http, defineChain, formatUnits } from 'viem';

const customChain = defineChain(networkConfig.iotaevm.viemConfig);

const rpcUrl = networkConfig.rpc;
const publicClient = createPublicClient({
  chain: customChain,
  transport: http(rpcUrl),
});

async function main() {
    try {
        console.log("\ndToken Exchange Rate calculation")
        const dTokenDecimals = 8; // all dTokens have 8 decimal places

        const underlyingDecimals = await publicClient.readContract({
            address: networkConfig.iotaevm.addresses.wIOTA,
            abi: networkConfig.iotaevm.abis.erc20,
            functionName: 'decimals'
        })

        const exchangeRateCurrent = await publicClient.readContract({
            address: networkConfig.iotaevm.addresses.dWIOTA,
            abi: networkConfig.iotaevm.abis.dToken,
            functionName: 'exchangeRateCurrent'
        })
        const mantissa = 18 + parseInt(underlyingDecimals) - dTokenDecimals;
        const exchangeRateCurrentNumber = parseFloat(formatUnits(exchangeRateCurrent.toString(), mantissa));

        console.log(`\t1 dWIOTA can be redeemed for ${exchangeRateCurrentNumber} wIOTA`);

        // Accrued Interest calculation

        console.log("\nAccrued Interest calculation")
        const secondsPerDay = 86400;
        const daysPerYear = 365;

        const supplyRatePerSecond = await publicClient.readContract({
            address: networkConfig.iotaevm.addresses.dWIOTA,
            abi: networkConfig.iotaevm.abis.dToken,
            functionName: 'supplyRatePerSecond'
        })

        const borrowRatePerSecond = await publicClient.readContract({
            address: networkConfig.iotaevm.addresses.dWIOTA,
            abi: networkConfig.iotaevm.abis.dToken,
            functionName: 'borrowRatePerSecond'
        })

        const supplyRatePerSecondNumber = parseFloat(formatUnits(supplyRatePerSecond.toString(),18));
        const borrowRatePerSecondNumber = parseFloat(formatUnits(borrowRatePerSecond.toString(),18));

        const supplyApr = supplyRatePerSecondNumber * (secondsPerDay * daysPerYear) * 100;
        console.log(`\n\tSupply APR for IOTA: ${supplyApr} %`);
        const borrowApr = borrowRatePerSecondNumber * (secondsPerDay * daysPerYear) * 100;;
        console.log(`\tBorrow APR for IOTA: ${borrowApr} %`);

        const supplyApy =
            (Math.pow(
                (supplyRatePerSecondNumber) * secondsPerDay + 1,
                daysPerYear
            ) - 1) * 100;
        
        const borrowApy =
            (Math.pow(
                (borrowRatePerSecondNumber) * secondsPerDay + 1,
                daysPerYear
            ) - 1) * 100;
        
        console.log(`\n\tSupply APY for IOTA: ${supplyApy} %`);
        console.log(`\tBorrow APY for IOTA: ${borrowApy} %`);
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
}

main();

