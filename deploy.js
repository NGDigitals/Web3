const { Web3 } = require('web3');
const path = require("path");
const fs = require("fs");

// Importing the ABI (Application Binary Interface) for the contract
const abi = require("./VotingContractAbi.json");

// Creating a new instance of web3 by connecting to the local Ethereum node
const web3 = new Web3("http://localhost:8545/");

const bytecodePath = path.join(__dirname, "VotingContractBytecode.bin"); // Path to the bytecode file
const bytecode = fs.readFileSync(bytecodePath, "utf8"); // Reading the bytecode from the file

// Creating a new instance of the contract using the ABI
// And set the handleRevert property to true to handle revert errors
const votingContract = new web3.eth.Contract(abi);
votingContract.handleRevert = true;

// Function to deploy the contract
async function deploy() {
    const accounts = await web3.eth.getAccounts(); // Getting the list of accounts
    // Selecting the first account as the deployer/default account
    const defaultAccount = accounts[0];
    console.log("Deployer account:", defaultAccount);

    // Create sample bank accounts
    const contractDeployer = votingContract.deploy({
        data: "0x" + bytecode,
        arguments: [["Candidate1", "Candidate2", "Candidate3"]],
    });

    const gas = await contractDeployer.estimateGas({
        from: defaultAccount,
    });
    console.log("Estimated gas:", gas);

    try {
        const tx = await contractDeployer.send({from: defaultAccount, gas, gasPrice: "10000000000",});
        console.log("Contract deployed at address: " + tx.options.address);

        const deployedAddressPath = path.join(__dirname, "VotingContractAddress.txt");
        fs.writeFileSync(deployedAddressPath, tx.options.address); // Writing the deployed contract address to a file
    } catch (error) {
        console.error(error);
    }
}

deploy();