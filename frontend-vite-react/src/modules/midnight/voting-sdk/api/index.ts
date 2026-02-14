
import { type VotingContract, type VotingProviders, type DeployedVotingContract, type VotingPrivateState } from './common-types';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';

export const joinVotingContract = async (
    providers: VotingProviders,
    contractAddress: ContractAddress
): Promise<DeployedVotingContract> => {
    const contract = await providers.foundContract(contractAddress, {
        privateStateKey: 'votingPrivateState',
        initialPrivateState: {},
    });
    return contract;
};

export const createPoll = async (
    providers: VotingProviders,
    contractAddress: ContractAddress,
    pollId: bigint,
    question: string,
    option1: string,
    option2: string
): Promise<void> => {
    const contract = await joinVotingContract(providers, contractAddress);
    await contract.callTx.createPoll(pollId, question, option1, option2);
};

export const voteOption1 = async (
    providers: VotingProviders,
    contractAddress: ContractAddress,
    pollId: bigint
): Promise<void> => {
    const contract = await joinVotingContract(providers, contractAddress);
    await contract.callTx.voteOption1(pollId);
};

export const voteOption2 = async (
    providers: VotingProviders,
    contractAddress: ContractAddress,
    pollId: bigint
): Promise<void> => {
    const contract = await joinVotingContract(providers, contractAddress);
    await contract.callTx.voteOption2(pollId);
};

export const closePoll = async (
    providers: VotingProviders,
    contractAddress: ContractAddress,
    pollId: bigint
): Promise<void> => {
    const contract = await joinVotingContract(providers, contractAddress);
    await contract.callTx.closePoll(pollId);
};
