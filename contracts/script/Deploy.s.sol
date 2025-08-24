// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SIPDToken.sol";
import "../src/Rewards.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        SIPDToken token = new SIPDToken(10_000_000);

        Rewards goalRewards = new Rewards(address(token));

        token.transfer(address(goalRewards), 5_000_000 * 10 ** token.decimals());

        vm.stopBroadcast();
    }
}
