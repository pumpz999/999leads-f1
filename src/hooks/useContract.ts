import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { web3Service } from '../lib/web3/contracts';
import { transactionService } from '../lib/web3/transactions';

export function useContract(address: string, abi: any[]) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = useCallback(async (
    method: string,
    args: any[] = [],
    options: ethers.TransactionRequest = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const contract = await web3Service.initializeContract(address, abi);
      const tx = await contract[method](...args, options);
      const receipt = await transactionService.waitForTransaction(tx.hash);
      return receipt;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address, abi]);

  const readContract = useCallback(async (method: string, args: any[] = []) => {
    try {
      const contract = await web3Service.initializeContract(address, abi);
      return await contract[method](...args);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read contract');
      throw err;
    }
  }, [address, abi]);

  return {
    loading,
    error,
    executeTransaction,
    readContract,
  };
}

const getContractAddressForNetwork = (address: string, chainId: number) => {
    // This is a placeholder.  A real implementation would need a mapping of addresses
    // to different chain IDs.  This example assumes a simple mapping.  More robust
    // solutions might involve config files or other strategies.

    // Example:  Different addresses for different networks (Goerli vs Mainnet)
    if (chainId === 5) { // Goerli
      return "0xGoerliTestnetAddress"; // Replace with your Goerli contract address
    } else if (chainId === 1) { // Mainnet
      return "0xMainnetAddress"; // Replace with your Mainnet contract address
    } else {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
};
