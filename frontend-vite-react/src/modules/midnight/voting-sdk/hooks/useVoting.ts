
import { useContext } from 'react';
import { VotingContext, type VotingContextType } from '../contexts/BrowserVotingProvider';

export const useVoting = (): VotingContextType => {
    const context = useContext(VotingContext);
    if (context === undefined) {
        throw new Error('useVoting must be used within a BrowserVotingProvider');
    }
    return context;
};
