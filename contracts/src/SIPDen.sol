// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SIPDen is ERC20, Ownable {
    ///GOAL REQEUREMNTS
    struct Goal {
        uint256 tapTarget;
        uint256 reward;
    }
    ///DECLARE GOALS AS ARRAY, MAP TAPS AND CLAIMATIONED?
    Goal[] public goals;
    mapping(address => uint256) public tapCounts;
    mapping(address => mapping(uint256 => bool)) public goalClaimed;
    ///PLAYERS
    address[] public players;


    /// uNLI MINT NO LIMIT TOKENS
    constructor(uint256 initialSupply) ERC20("SIPDen", "SIPD") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /// ADD GOAL
    function addGoal(uint256 tapTarget, uint256 reward) external onlyOwner {
        goals.push(Goal(tapTarget, reward * 10 ** decimals()));
    }

    /// INCREMENATION OF TAOPS
    function tap() external {
        /// REGHISTRATIONS
        if (tapCounts[msg.sender] == 0) {
            players.push(msg.sender); 
        }

        tapCounts[msg.sender] += 1;

        /// CHECK KUNG MAY NA ACHIEVE
        for (uint256 i = 0; i < goals.length; i++) {
            if (tapCounts[msg.sender] >= goals[i].tapTarget && !goalClaimed[msg.sender][i]) {
                goalClaimed[msg.sender][i] = true;
                _transfer(owner(), msg.sender, goals[i].reward);
            }
        }
    }

    /// LEADERBOARDS
    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        uint256[] memory taps = new uint256[](players.length);
        for (uint256 i = 0; i < players.length; i++) {
            taps[i] = tapCounts[players[i]];
        }
        return (players, taps);
    }
}
