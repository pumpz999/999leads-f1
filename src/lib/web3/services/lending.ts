import { ethers } from 'ethers';
import { web3Service } from '../contracts';

interface LendingPosition {
  token: string;
  amount: string;
  apy: number;
  collateralFactor: number;
}

class LendingService {
  private static instance: LendingService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  static getInstance(): LendingService {
    if (!LendingService.instance) {
      LendingService.instance = new LendingService();
    }
    return LendingService.instance;
  }

  async initialize(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async supply(token: string, amount: string): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Wallet not connected');
    
    const contract = new ethers.Contract(
      token,
      ['function approve(address spender, uint256 amount) public returns (bool)',
       'function deposit(uint256 amount) public returns (bool)'],
      this.signer
    );

    const tx1 = await contract.approve(token, amount);
    await tx1.wait();
    
    return await contract.deposit(amount);
  }

  async borrow(token: string, amount: string): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Wallet not connected');
    
    const contract = new ethers.Contract(
      token,
      ['function borrow(uint256 amount) public returns (bool)'],
      this.signer
    );
    
    return await contract.borrow(amount);
  }

  async getLendingPositions(account: string): Promise<LendingPosition[]> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const positions = await this.provider.send('eth_getLendingPositions', [account]);
    return positions.map((pos: any) => ({
      token: pos.token,
      amount: ethers.formatUnits(pos.amount, 18),
      apy: Number(pos.apy) / 100,
      collateralFactor: Number(pos.collateralFactor) / 100
    }));
  }
}

export const lendingService = LendingService.getInstance();
