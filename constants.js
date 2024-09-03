const networkConfig = {
    iotaevm : {
        rpc: "https://json-rpc.evm.iotaledger.net",
        addresses : {
            dWIOTA: '0x260817581206317E2665080A2E66854e922269d0',
            wIOTA: '0x6e47f8d48a01b44DF3fFF35d258A10A3AEdC114c'
            },
        abis : {
            erc20: [
            {
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                    "name": "",
                    "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
                }
            ],
            dToken: [
            {
                "inputs": [],
                "name": "supplyRatePerSecond",
                "outputs": [
                    {
                    "name": "",
                    "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "borrowRatePerSecond",
                "outputs": [
                    {
                    "name": "",
                    "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "exchangeRateCurrent",
                "outputs": [
                    {
                    "name": "",
                    "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
            ]

        }
    }
};


module.exports = {
    networkConfig
};
