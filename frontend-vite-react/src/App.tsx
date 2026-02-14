import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

import { BrowserVotingProvider } from "@/modules/midnight/voting-sdk/contexts/BrowserVotingProvider";

function App() {
  return (
    <BrowserVotingProvider>
      <RouterProvider router={router} />
    </BrowserVotingProvider>
  );
}

export default App;
