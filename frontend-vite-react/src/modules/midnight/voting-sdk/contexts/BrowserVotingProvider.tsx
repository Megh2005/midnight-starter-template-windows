import {
  type DAppConnectorWallet,
  type ServiceUriEnum,
  type DAppConnectorAPI,
} from "@midnight-ntwrk/dapp-connector-api";
import {
  type VotingProviders,
  type DeployedVotingContract,
  type VotingPrivateState,
  type DerivedState,
  VotingPrivateStateId,
  type VotingLedger,
} from "../api/common-types";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import {
  type BalancedTransaction,
  type UnbalancedTransaction,
  createBalancedTx,
} from "@midnight-ntwrk/midnight-js-types";
import { type TransactionId } from "@midnight-ntwrk/ledger-v7";
import { getZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import * as api from "../api";

// Use same logger as before or simplified
const logger = {
  info: console.log,
  error: console.error,
  debug: console.debug,
  trace: console.trace,
  warn: console.warn,
};

export interface VotingContextType {
  wallet: DAppConnectorWallet | undefined;
  walletApi: DAppConnectorAPI | undefined;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  contract: DeployedVotingContract | undefined;
  contractState: DerivedState | undefined;
  loading: boolean;
  error: string | null;
  joinContract: (address: string) => Promise<void>;
  createPoll: (
    id: bigint,
    question: string,
    option1: string,
    option2: string,
  ) => Promise<void>;
  voteOption1: (id: bigint) => Promise<void>;
  voteOption2: (id: bigint) => Promise<void>;
  closePoll: (id: bigint) => Promise<void>;
}

export const VotingContext = createContext<VotingContextType | undefined>(
  undefined,
);

export const BrowserVotingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wallet, setWallet] = useState<DAppConnectorWallet | undefined>(
    undefined,
  );
  const [walletApi, setWalletApi] = useState<DAppConnectorAPI | undefined>(
    undefined,
  );
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState<DeployedVotingContract | undefined>(
    undefined,
  );
  const [contractState, setContractState] = useState<DerivedState | undefined>(
    undefined,
  );
  const [providers, setProviders] = useState<VotingProviders | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      if (window.midnight) {
        const api = await window.midnight.mnLace;
        const state = await api.isEnabled();
        setWallet(window.midnight.mnLace); // Use proper typing or casting if needed
        setWalletApi(api);
        if (state) {
          setIsConnected(true);
        } else {
          const enabled = await api.enable();
          setIsConnected(enabled);
        }
      } else {
        logger.error("Midnight wallet not found");
        setError("Midnight wallet not found");
      }
    } catch (e: any) {
      logger.error("Failed to connect wallet", e);
      setError(e.message);
    }
  }, []);

  // Initialize Providers
  useEffect(() => {
    const initProviders = async () => {
      if (!walletApi) return;
      try {
        const uris = await walletApi.serviceUriConfig();
        const indexerUri = uris.indexer;
        const proofServerUri = uris.proofServer;

        const newProviders: VotingProviders = {
          privateStateProvider: levelPrivateStateProvider({
            privateStateStoreName: VotingPrivateStateId,
          }),
          publicDataProvider: indexerPublicDataProvider(indexerUri, uris.node),
          zkConfigProvider: getZkConfigProvider(indexerUri, uris.node),
          proofProvider: httpClientProofProvider(proofServerUri),
          walletProvider: {
            coinPublicKey: await walletApi.coinPublicKey(),
            balanceTx(
              tx: UnbalancedTransaction,
              newCoins: any,
            ): Promise<BalancedTransaction> {
              return walletApi.balanceTransaction(tx, newCoins);
            },
            submitTx(tx: BalancedTransaction): Promise<TransactionId> {
              return walletApi.submitTransaction(tx);
            },
          },
        };
        setProviders(newProviders);
      } catch (e: any) {
        logger.error("Failed to init providers", e);
      }
    };
    if (isConnected && walletApi) {
      initProviders();
    }
  }, [isConnected, walletApi]);

  const joinContract = useCallback(
    async (address: string) => {
      if (!providers) return;
      try {
        setLoading(true);
        const deployedContract = await api.joinVotingContract(
          providers,
          address,
        );
        setContract(deployedContract);

        // Subscribe to state changes
        // @ts-expect-error - Contract types mocked
        deployedContract.publicSubject.subscribe((ledger: VotingLedger) => {
          setContractState({
            polls: ledger.polls,
            voteCount: ledger.voteCount,
          });
        });
      } catch (e: any) {
        logger.error("Failed to join contract", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [providers],
  );

  const createPoll = async (
    id: bigint,
    question: string,
    option1: string,
    option2: string,
  ) => {
    if (!contract || !providers) return;
    try {
      await contract.callTx.createPoll(id, question, option1, option2);
    } catch (e: any) {
      logger.error("Create poll failed", e);
      throw e;
    }
  };

  const voteOption1 = async (id: bigint) => {
    if (!contract) return;
    await contract.callTx.voteOption1(id);
  };

  const voteOption2 = async (id: bigint) => {
    if (!contract) return;
    await contract.callTx.voteOption2(id);
  };

  const closePoll = async (id: bigint) => {
    if (!contract) return;
    await contract.callTx.closePoll(id);
  };

  return (
    <VotingContext.Provider
      value={{
        wallet,
        walletApi,
        isConnected,
        connectWallet,
        contract,
        contractState,
        loading,
        error,
        joinContract,
        createPoll,
        voteOption1,
        voteOption2,
        closePoll,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
