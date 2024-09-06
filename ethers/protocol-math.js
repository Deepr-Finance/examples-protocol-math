import { ethers, formatUnits } from 'ethers';
import { networkConfig } from '../constants.js';

const provider = new ethers.JsonRpcProvider(networkConfig.iotaevm.rpc);

async function main() {
    try {
        console.log("\ndToken Exchange Rate calculation")
        const dTokenDecimals = 8; // all dTokens have 8 decimal places
        const underlying = new ethers.Contract(networkConfig.iotaevm.addresses.wIOTA, networkConfig.iotaevm.abis.erc20, provider);
        const dToken = new ethers.Contract(networkConfig.iotaevm.addresses.dWIOTA, networkConfig.iotaevm.abis.dToken, provider);
    
        const underlyingDecimals = await underlying.decimals();
        const exchangeRateCurrent = await dToken.exchangeRateCurrent();
        const mantissa = 18 + parseInt(underlyingDecimals) - dTokenDecimals;
    
        const exchangeRateCurrentNumber = parseFloat(formatUnits(exchangeRateCurrent.toString(), mantissa));
    
        console.log(`\t1 dWIOTA can be redeemed for ${exchangeRateCurrentNumber} wIOTA`);
    
        // Accrued Interest calculation
        console.log("\nAccrued Interest calculation")
        const secondsPerDay = 86400;
        const daysPerYear = 365;
    
        const supplyRatePerSecond = await dToken.supplyRatePerSecond();
        const borrowRatePerSecond = await dToken.borrowRatePerSecond();
    
        const supplyRatePerSecondNumber = parseFloat(formatUnits(supplyRatePerSecond.toString(), "ether"));
        const borrowRatePerSecondNumber = parseFloat(formatUnits(borrowRatePerSecond.toString(), "ether"));

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
