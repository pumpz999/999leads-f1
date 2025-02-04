import { ethers } from 'ethers';
import { TEMPLATE_MARKETPLACE_ABI } from './abis';

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contracts: { [key: string]: ethers.Contract } = {};
  
  private readonly TESTNET_CONFIG = {
    5: {  // Goerli
      rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}',
      chainName: 'Goerli Testnet',
      nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' }
    },
    97: { // BSC Testnet
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainName: 'BSC Testnet',
      nativeCurrency: { name: 'tBNB', decimals: 18, symbol: 'tBNB' }
    }
  };

  async initialize() {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      throw error;
    }
  }

  async connectWallet() {
    if (!this.provider) {
      await this.initialize();
    }

    const accounts = await this.provider!.send('eth_requestAccounts', []);
    const network = await this.provider!.getNetwork();
    const balance = await this.provider!.getBalance(accounts[0]);

    return {
      address: accounts[0],
      chainId: Number(network.chainId),
      balance: ethers.formatEther(balance),
      signer: this.signer,
    };
  }

  async initializeContract(address: string, abi: any) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const contract = new ethers.Contract(address, abi, this.signer);
    return contract;
  }

  async switchNetwork(chainId: number) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        return false;
      }
      throw error;
    }
  }

  async signMessage(message: string) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return await this.signer.signMessage(message);
  }

  async getGasPrice() {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return await this.provider.getFeeData();
  }

  async estimateGas(transaction: any) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return await this.provider.estimateGas(transaction);
  }
}

export const web3Service = new Web3Service();
