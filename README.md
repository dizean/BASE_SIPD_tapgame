This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-onchain`]().


## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Learn More

To learn more about OnchainKit, see our [documentation](https://onchainkit.xyz/getting-started).

To learn more about Next.js, see the [Next.js documentation](https://nextjs.org/docs).
FOLLOW THROUGH


CREATING BASE CHAIN APP
mkdir contracts && cd contracts
curl -L https://foundry.paradigm.xyz | bash
foundryup
forge init --no-git
create .env file inside contracts
copy paste
BASE_RPC_URL="https://mainnet.base.org"
BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
load env -> source .env

PRIVATE KEY

OPEN YOUR WALLET->PREFER COINBASE
OPEN SETTINGS -> DEVELOPER -> SHOW PRIVATE KEY -> COPY & PASTE PK IN ENV (export PRIVATE_KEY)
cast wallet import deployer --interactive
prompt -> enter pk (COPY FROM ENV) and password

DEPLOYING CONTRACTS

USE ->forge create ./src/Counter.sol:Counter --rpc-url $BASE_SEPOLIA_RPC_URL --account deployer --broadcast 
CONTRACT ADDRESS -> deployed to : is your contract address. copy and paste it on https://sepolia.basescan.org/ 
look for contract path: contract name -> add this in the contract env file then  -> source .env



TO CREATE NEW DEPLOYER


cd ~/.foundry/keystores
ls - if theres a deployer
rm deployer
go back to contracts folder -> go back to PRIVATE KEY
