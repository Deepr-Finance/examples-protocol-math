import Web3 from 'web3';
import { networkConfig } from '../constants.js';

const web3 = new Web3(networkConfig.iotaevm.rpc);

async function main() {
  try {
    console.log("\ndToken Exchange Rate calculation")
    const dTokenDecimals = 8; // all dTokens have 8 decimal places
    const underlying = new web3.eth.Contract(networkConfig.iotaevm.abis.erc20, networkConfig.iotaevm.addresses.wIOTA);
    const dToken = new web3.eth.Contract(networkConfig.iotaevm.abis.dToken, networkConfig.iotaevm.addresses.dWIOTA);

    const underlyingDecimals = await underlying.methods.decimals().call();
    const exchangeRateCurrent = await dToken.methods.exchangeRateCurrent().call();
    const mantissa = 18 + parseInt(underlyingDecimals) - dTokenDecimals;

    const exchangeRateCurrentNumber = parseFloat(web3.utils.fromWei(exchangeRateCurrent.toString(), mantissa));

    console.log(`\t1 dWIOTA can be redeemed for ${exchangeRateCurrentNumber} wIOTA`);

    // Accrued Interest calculation
    console.log("\nAccrued Interest calculation")
    const secondsPerDay = 86400;
    const daysPerYear = 365;

    const supplyRatePerSecond = await dToken.methods.supplyRatePerSecond().call();
    const borrowRatePerSecond = await dToken.methods.borrowRatePerSecond().call();

    const supplyRatePerSecondNumber = parseFloat(web3.utils.fromWei(supplyRatePerSecond.toString(), "ether"));
    const borrowRatePerSecondNumber = parseFloat(web3.utils.fromWei(borrowRatePerSecond.toString(), "ether"));


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
