import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useVoting } from "../modules/midnight/voting-sdk/hooks/useVoting";
import {
  type Poll,
  type VoteCount,
} from "../modules/midnight/voting-sdk/api/common-types";

interface PollCardProps {
  poll: Poll;
  voteCount?: VoteCount;
}

export function PollCard({ poll, voteCount }: PollCardProps) {
  const { voteOption1, voteOption2, closePoll, loading } = useVoting();

  const handleVote1 = async () => {
    try {
      await voteOption1(poll.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote2 = async () => {
    try {
      await voteOption2(poll.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = async () => {
    try {
      await closePoll(poll.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
        <CardDescription>{poll.isActive ? "Active" : "Closed"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex justify-between items-center">
            <span>{poll.option1}</span>
            <span className="font-bold">
              {voteCount?.votes1 ? voteCount.votes1.toString() : "0"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>{poll.option2}</span>
            <span className="font-bold">
              {voteCount?.votes2 ? voteCount.votes2.toString() : "0"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {poll.isActive && (
          <div className="flex gap-2 w-full">
            <Button className="flex-1" onClick={handleVote1} disabled={loading}>
              Vote {poll.option1}
            </Button>
            <Button className="flex-1" onClick={handleVote2} disabled={loading}>
              Vote {poll.option2}
            </Button>
          </div>
        )}
        {poll.isActive && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleClose}
            disabled={loading}
          >
            Close Poll
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
