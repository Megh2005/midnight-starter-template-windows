import { useState } from "react";
import { useVoting } from "../modules/midnight/voting-sdk/hooks/useVoting";
import { Button } from "./ui/button"; // Assuming shadcn/ui generic button exists or I need to create it
import { Input } from "./ui/input"; // Assuming shadcn/ui generic input exists or I need to create it
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";

export function CreatePollDialog() {
  const { createPoll, contract, loading } = useVoting();
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    // Generate a random ID for now
    const pollId = BigInt(Math.floor(Math.random() * 1000000));

    try {
      await createPoll(pollId, question, option1, option2);
      setIsOpen(false);
      setQuestion("");
      setOption1("");
      setOption2("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Poll</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Poll</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question" className="text-right">
              Question
            </Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="option1" className="text-right">
              Option 1
            </Label>
            <Input
              id="option1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="option2" className="text-right">
              Option 2
            </Label>
            <Input
              id="option2"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
