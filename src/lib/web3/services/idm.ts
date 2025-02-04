import { ethers } from 'ethers';
import { web3Service } from '../contracts';

interface Identity {
  id: string;
  owner: string;
  metadata: {
    name: string;
    description: string;
    attributes: Record<string, string>;
  };
  verifications: string[];
  status: 'pending' | 'verified' | 'rejected';
}

class IDMService {
  private static instance: IDMService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  static getInstance(): IDMService {
    if (!IDMService.instance) {
      IDMService.instance = new IDMService();
    }
    return IDMService.instance;
  }

  async initialize(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async createIdentity(metadata: any): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Wallet not connected');

    const contract = new ethers.Contract(
      process.env.IDM_CONTRACT_ADDRESS!,
      ['function createIdentity(string memory metadata) public returns (uint256)'],
      this.signer
    );

    return await contract.createIdentity(JSON.stringify(metadata));
  }

  async verifyIdentity(identityId: string, verifierAddress: string): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Wallet not connected');

    const contract = new ethers.Contract(
      process.env.IDM_CONTRACT_ADDRESS!,
      ['function verifyIdentity(uint256 identityId, address verifier) public returns (bool)'],
      this.signer
    );

    return await contract.verifyIdentity(identityId, verifierAddress);
  }

  async getIdentity(identityId: string): Promise<Identity> {
    if (!this.provider) throw new Error('Provider not initialized');

    const contract = new ethers.Contract(
      process.env.IDM_CONTRACT_ADDRESS!,
      ['function getIdentity(uint256 identityId) public view returns (tuple(address owner, string metadata, address[] verifications, uint8 status))'],
      this.provider
    );

    const identity = await contract.getIdentity(identityId);
    return {
      id: identityId,
      owner: identity.owner,
      metadata: JSON.parse(identity.metadata),
      verifications: identity.verifications,
      status: ['pending', 'verified', 'rejected'][identity.status]
    };
  }
}

export const idmService = IDMService.getInstance();
