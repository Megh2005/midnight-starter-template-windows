# 🗳️ Midnight Voting DApp

## Project Description

The **Midnight Voting DApp** is a privacy-first decentralized application built on the **Midnight Network**. Leverage the power of zero-knowledge proofs (ZKPs) to conduct secure and transparent polls where user choices can remain confidential while ensuring the integrity of the vote count. This project demonstrates how to build and deploy smart contracts using the Compact language and interact with them through a modern React frontend. It serves as a comprehensive example for developers looking to explore dataless apps on the Midnight blockchain.

## What it does

This application allows users to create and participate in decentralized polls. A user can **create a new poll** by defining a question and two options. Once a poll is active, other users can connect their wallets and **cast their votes** for their preferred option. The smart contract ensures that votes are counted correctly and stored on the ledger. The poll creator retains the ability to **close the poll** when voting is finished. All of this is powered by Midnight's privacy-preserving architecture, ensuring that while the results are verifiable, the specific actions can be protected by ZK technology where applicable.

## ✨ Features

- **Create Polls**: Users can initialize new polls with a custom question and two distinct voting options.
- **Secure Voting**: Participants can cast votes for "Option 1" or "Option 2" directly on the blockchain.
- **Real-time Counting**: The contract maintains a public tally of votes for each option, updatable in real-time.
- **Poll Management**: The creator of a poll has the exclusive authority to close it, ensuring controlled voting periods.
- **Privacy Preserved**: Built on Midnight, leveraging ZK proofs to enable privacy-preserving interactions.
- **Modern Frontend**: A responsive React-based user interface for easy interaction with the smart contract.

## 📜 Deployed Smart Contract

You can interact with the deployed voting contract at the following address:

```
d9eceafb52a63da8fee268f705b0062605773ef907745d3ae4d43690625c2641
```



## 📁 Project Structure

```
├── voting-contract/     # Compact smart contracts for voting logic
├── frontend-vite-react/ # React application for the implementation
├── package.json         # Workspace configuration
└── turbo.json           # Turborepo configuration
```
