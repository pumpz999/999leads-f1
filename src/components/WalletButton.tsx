import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Wallet } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';
import { useSelector } from 'react-redux';
import { selectWallet } from '../store/slices/walletSlice';

export function WalletButton() {
  const { connectWallet, loading, error } = useWeb3();
  const wallet = useSelector(selectWallet);
  
  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  if (loading) {
    return (
      <Button
        variant="contained"
        disabled
        startIcon={<CircularProgress size={20} />}
      >
        Connecting...
      </Button>
    );
  }

  if (wallet.isConnected) {
    return (
      <Button
        variant="outlined"
        startIcon={<Wallet />}
      >
        {`${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)}`}
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      startIcon={<Wallet />}
      onClick={handleConnect}
    >
      Connect Wallet
    </Button>
  );
}
