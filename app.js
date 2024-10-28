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

        const trimmedAddress = address.trim();

        return { abi, address: trimmedAddress };
    } catch (error) {
        console.error("Error loading contract data:", error);
        throw error;
    }
}

// Function to load candidates
async function loadCandidates() {
    try {
        const { abi, address } = await loadContractData();
        const contract = new web3.eth.Contract(abi, address);

        // Get the list of candidates
        const candidates = await contract.methods.getCandidates().call();

        // Fetch and display votes for all candidates
        const votesList = await Promise.all(
            candidates.map((candidate) =>
                contract.methods
                    .totalVotesFor(candidate)
                    .call()
                    .then((votes) => ({ candidate, votes }))
                )
        );

        let result = "Candidates Votes:\n";
        // let result = "";
        votesList.forEach(({ candidate, votes }) => {
            // result.push({'candidate': candidate, 'votes': votes})
            result += `${candidate}: ${votes} votes\n`;
        });
        console.log(votesList)
        return result;
    } catch (error) {
        console.error(error);
    }
}

// Function to vote for a candidate
async function voteForCandidate(candidate) {
    try {
        if (!candidate) {
            return console.error('Invalid vote');
        }
        const { abi, address } = await loadContractData();
        const contract = new web3.eth.Contract(abi, address);

        const accounts = await web3.eth.getAccounts();
        const defaultAccount = accounts[0];

        // Cast a vote for the selected candidate
        const receipt = await contract.methods.voteForCandidate(candidate)
            .send({from: defaultAccount, gas: 1000000, gasPrice: "10000000000"});
        console.log("Transaction Hash: " + receipt.transactionHash);

        return await loadCandidates(); // Fetch list
    } catch (error) {
        console.error(error);
    }
}

module.exports = {loadCandidates, voteForCandidate}
// loadCandidates()
// voteForCandidate('Candidate1')
// voteForCandidate('Candidate1')
// voteForCandidate('Candidate3')