import { useVoting } from "../modules/midnight/voting-sdk/hooks/useVoting";
import { PollCard } from "./PollCard";

export function PollList() {
  const { contractState, loading } = useVoting();

  if (loading && !contractState) {
    return <div>Loading polls...</div>;
  }

  if (!contractState || contractState.polls.length === 0) {
    return <div>No polls found. Create one!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contractState.polls.map((poll) => {
        const votes = contractState.voteCount.find((v) => v.pollId === poll.id);
        return (
          <PollCard key={poll.id.toString()} poll={poll} voteCount={votes} />
        );
      })}
    </div>
  );
}
