// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BankContract {
    // Store all customer accounts
    string[] public accounts;
    // Map acounts balances
    mapping(string => uint256) public balances;

    // Constructor to initialize the contract customer accounts
    constructor(string[] memory _acounts) {
        accounts = _accounts;
        // Set all balances to 1000
        for (uint i = 0; i < accounts.length; i++) {
            balances[accounts[i]] = 0;
        }
    }

    // Send fund method
    function sendFund(string memory sender, string memory receiver, uint amount) public {
        require(balances[sender] >= amount, "Insufficient balance");
        balances[sender] -= amount;
        balances[receiver] += amount;
    }

    // Fetch account balance
    function fetchBalance(string memory account) public view returns (uint256) {
        return balances[account];
    }

    // Fetch all accounts balances
    function fetchAccounts() public view returns (string[] memory) {
        return balances;
    }
}