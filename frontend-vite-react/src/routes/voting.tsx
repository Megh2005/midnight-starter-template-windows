import { createFileRoute } from "@tanstack/react-router";
import { CreatePollDialog } from "@/components/CreatePollDialog";
import { PollList } from "@/components/PollList";
import { useVoting } from "@/modules/midnight/voting-sdk/hooks/useVoting";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/voting")({
  component: VotingPage,
});

function VotingPage() {
  const { isConnected, connectWallet, joinContract } = useVoting();
  const [contractAddress, setContractAddress] = useState("");

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Midnight Voting App</h1>
        <div className="flex gap-4">
          {!isConnected ? (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          ) : (
            <div className="flex gap-2 items-center">
              <span className="text-green-500 font-bold">Wallet Connected</span>
              <input
                type="text"
                placeholder="Contract Address"
                className="border p-2 rounded"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
              <Button onClick={() => joinContract(contractAddress)}>
                Join Contract
              </Button>
            </div>
          )}
          <CreatePollDialog />
        </div>
      </header>

      <main>
        <PollList />
      </main>
    </div>
  );
}
