// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    // Mapping from candidate names to vote counts to create a smart contract
    mapping(string => uint256) public votesReceived;
    // Array to store all candidate names
    string[] public candidateList;

    // Constructor to initialize the contract with a list of candidates
    constructor(string[] memory _candidates) {
        candidateList = _candidates;
        // Initialize votes for each candidate to 0
        for (uint i = 0; i < _candidates.length; i++) {
            votesReceived[_candidates[i]] = 0;
        }
    }

    // Function to vote for a candidate
    function voteForCandidate(string memory candidate) public {
        require(votesReceived[candidate] >= 0, "Candidate does not exist");
        votesReceived[candidate] += 1;
    }

    // Function to get the total number of votes for a candidate
    function totalVotesFor(string memory candidate) public view returns (uint256) {
        require(votesReceived[candidate] >= 0, "Candidate does not exist");
        return votesReceived[candidate];
    }

    // Function to get the list of candidates
    function getCandidates() public view returns (string[] memory) {
        return candidateList;
    }
}