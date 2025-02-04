import React from 'react';
import { Globe } from 'lucide-react';

const TESTNET_NETWORKS = [
  { chainId: 5, name: 'Goerli Testnet' },
  { chainId: 97, name: 'BSC Testnet' }
];

export function NetworkSelector({
  currentChainId,
  onNetworkChange,
}: {
  currentChainId: number | null;
  onNetworkChange: (chainId: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <select
        value={currentChainId || ''}
        onChange={(e) => onNetworkChange(Number(e.target.value))}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Select Network</option>
        {TESTNET_NETWORKS.map((network) => (
          <option key={network.chainId} value={network.chainId}>
            {network.name}
          </option>
        ))}
      </select>
    </div>
  );
}
