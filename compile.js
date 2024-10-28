const fs = require("fs");
const solc = require("solc");
const path = require("path");

const contractName = "VotingContract";
const fileName = `${contractName}.sol`;

// Read the Solidity source code from the file system
const contractPath = path.join(__dirname, fileName);
const sourceCode = fs.readFileSync(contractPath, "utf8");

// solc compiler config
const input = {
    language: "Solidity",
    sources: {
        [fileName]: {
        content: sourceCode,
        },
    },
    settings: {
        outputSelection: {
        "*": {
            "*": ["*"],
        },
        },
    },
};

// Compile Solidity
const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

const bytecode =
    compiledCode.contracts[fileName][contractName].evm.bytecode.object;

const bytecodePath = path.join(__dirname, "VotingContractBytecode.bin");
fs.writeFileSync(bytecodePath, bytecode);

// Get the ABI from the compiled contract and write it to a json file
const abi = compiledCode.contracts[fileName][contractName].abi;
const abiPath = path.join(__dirname, "VotingContractAbi.json");
fs.writeFileSync(abiPath, JSON.stringify(abi, null, "\t"));