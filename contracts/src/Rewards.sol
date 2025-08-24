// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract Rewards {
    IERC20 public token;
    mapping(uint256 => uint256) public goalRewards;
    mapping(address => mapping(uint256 => bool)) public goalClaimed;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
        goalRewards[1] = 100;    
        goalRewards[2] = 200;     
        goalRewards[3] = 400;   
        goalRewards[4] = 800;   
        goalRewards[5] = 1200;  
        goalRewards[6] = 2400;   
        goalRewards[7] = 4800;    
        goalRewards[8] = 9600;    
        goalRewards[9] = 19200;   
        goalRewards[10] = 38400;  
    }

    function claimGoal(uint256 goalId) external {
        require(!goalClaimed[msg.sender][goalId], "Already claimed");

        uint256 reward = goalRewards[goalId];
        require(reward > 0, "Invalid goal");

        goalClaimed[msg.sender][goalId] = true;
        require(token.transfer(msg.sender, reward * 10 ** 18), "Reward transfer failed");
    }
}
