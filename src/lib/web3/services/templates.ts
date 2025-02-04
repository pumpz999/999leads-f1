import { ethers } from 'ethers';
import { TEMPLATE_MARKETPLACE_ABI } from '../abis';

export const VERIFIED_TEMPLATES = [
  {
    id: 1,
    name: 'ERC20 Token',
    description: 'Standard ERC20 token implementation with basic features',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}`
  },
  {
    id: 2,
    name: 'NFT Collection',
    description: 'ERC721 NFT collection with minting and metadata',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721, Ownable {
    constructor() ERC721("MyNFT", "MNFT") {}

    function mint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}`
  }
  // Add more templates here...
];

export class TemplateService {
  private contract: ethers.Contract;

  constructor(address: string, signer: ethers.Signer) {
    this.contract = new ethers.Contract(address, TEMPLATE_MARKETPLACE_ABI, signer);
  }

  async initializeTemplates() {
    for (const template of VERIFIED_TEMPLATES) {
      await this.contract.createTemplate(
        template.name,
        JSON.stringify({
          description: template.description,
          code: template.code
        }),
        ethers.parseEther('0.1'),
        0
      );
    }
  }

  async getTemplateCode(templateId: number) {
    const template = await this.contract.getTemplate(templateId);
    const metadata = JSON.parse(template.metadata);
    return metadata.code;
  }
}
