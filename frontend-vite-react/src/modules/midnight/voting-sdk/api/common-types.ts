
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';

/**
 * Manually defining types based on voting.compact structure
 * because the generated package seems to be out of sync.
 */

export type Poll = {
  id: bigint;
  creator: Uint8Array; // Address
  question: string;
  option1: string;
  option2: string;
  isActive: boolean;
};

export type VoteCount = {
  pollId: bigint;
  votes1: bigint;
  votes2: bigint;
};

export type VotingLedger = {
  polls: Poll[];
  voteCount: VoteCount[];
};

export type VotingPrivateState = Record<string, never>;

// Mocking the Contract shape expected by Midnight JS
export interface VotingContract {
  impureCircuits: {
    createPoll(context: any, pollId: bigint, question: string, option1: string, option2: string): any;
    voteOption1(context: any, pollId: bigint): any;
    voteOption2(context: any, pollId: bigint): any;
    closePoll(context: any, pollId: bigint): any;
  };
}

export type VotingCircuits = 'createPoll' | 'voteOption1' | 'voteOption2' | 'closePoll';

export const VotingPrivateStateId = 'votingPrivateState';

export type VotingProviders = MidnightProviders<VotingCircuits, typeof VotingPrivateStateId, VotingPrivateState>;

export type DeployedVotingContract = DeployedContract<VotingContract> | FoundContract<VotingContract>;

export type DerivedState = {
  readonly polls: Poll[];
  readonly voteCount: VoteCount[];
};
