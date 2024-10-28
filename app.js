const { Web3 } = require('web3');
const web3 = new Web3("http://127.0.0.1:8545/");
const serverUrl = 'http://127.0.0.1:8080'

// Function to load ABI and contract address
async function loadContractData() {
    try {
        const abiResponse = await fetch(`${serverUrl}/VotingContractAbi.json`);
        const abi = await abiResponse.json();
        const addressResponse = await fetch(`${serverUrl}/VotingContractAddress.txt`);
        const address = await addressResponse.text();
        return { abi, address: address.trim() };
    } catch (error) {
        console.error("Error loading contract data:", error);
        throw error;
    }
}

const fetchCandidates = async() => {
    try {
        const { abi, address } = await loadContractData();
        const contract = new web3.eth.Contract(abi, address);

        // Fetch and display votes for all candidates
        const candidates = await contract.methods.listCandidates().call();
        const votesList = await Promise.all(
            candidates.map((candidate) =>
                contract.methods
                    .totalVotesFor(candidate)
                    .call()
                    .then((votes) => ({ candidate, votes }))
                )
        );

        let result = [];
        votesList.forEach(({ candidate, votes }) => {
            result.push({'candidate': candidate, 'votes': 
                    typeof votes === "bigint" ? votes.toString() + "n" : votes})
        });
        return result;
    } catch (error) {
        console.error(error);
    }
}

const voteForCandidate = async(candidate) => {
    try {
        if (!candidate) {
            return console.error('Invalid vote');
        }
        const { abi, address } = await loadContractData();
        const contract = new web3.eth.Contract(abi, address);

        const accounts = await web3.eth.getAccounts();
        const defaultAccount = accounts[0];

        const receipt = await contract.methods.voteFor(candidate)
            .send({from: defaultAccount, gas: 1000000, gasPrice: "10000000000"});
        console.log("Transaction Hash: " + receipt.transactionHash);
        console.log('Recept:', JSON.stringify(receipt, (key, value) => {
            return typeof value === "bigint" ? value.toString() + "n" : value
        }))

        // Fetch and return updated list
        return await fetchCandidates();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {fetchCandidates, voteForCandidate}