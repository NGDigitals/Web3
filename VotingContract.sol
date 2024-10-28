// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    string[] public candidates;
    mapping(string => uint256) public votes;
    
    constructor(string[] memory _candidates) {
        candidates = _candidates;
        // Initialize votes for each candidate to 0
        for (uint i = 0; i < candidates.length; i++) {
            votes[candidates[i]] = 0;
        }
    }

    function listCandidates() public view returns (string[] memory) {
        return candidates;
    }
    
    // Function to vote for a candidate
    function voteFor(string memory candidate) public {
        require(votes[candidate] >= 0, "Candidate does not exist");
        votes[candidate] += 1;
    }

    // Function to get the total number of votes for a candidate
    function totalVotesFor(string memory candidate) public view returns (uint256) {
        require(votes[candidate] >= 0, "Candidate does not exist");
        return votes[candidate];
    }
}