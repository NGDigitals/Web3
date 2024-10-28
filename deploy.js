const { Web3 } = require('web3');
const path = require("path");
const fs = require("fs");

// Importing the ABI (Application Binary Interface) for the contract
const abi = require("./VotingContractAbi.json");

const web3 = new Web3("http://localhost:8545/");

const bytecodePath = path.join(__dirname, "VotingContractBytecode.bin");
const bytecode = fs.readFileSync(bytecodePath, "utf8");

// Creating a new instance of the contract using the ABI
// And set the handleRevert property to true to handle revert errors
const votingContract = new web3.eth.Contract(abi);
votingContract.handleRevert = true;

// Function to deploy the contract
async function deploy() {
    const accounts = await web3.eth.getAccounts();
    // Selecting the first account as the deployer/default account
    const defaultAccount = accounts[0];
    console.log("Default account:", defaultAccount);

    // Create candidate list
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

        // Writing the deployed contract address to a file
        const deployedAddressPath = path.join(__dirname, "VotingContractAddress.txt");
        fs.writeFileSync(deployedAddressPath, tx.options.address);
    } catch (error) {
        console.error(error);
    }
}

// Call the deploy function
deploy();