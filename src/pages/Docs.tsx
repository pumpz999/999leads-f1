import React from 'react';
import { Box, Typography, Grid, Paper, Link, Divider, List, ListItem, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Docs() {
  const sections = [
    {
      title: 'Getting Started',
      content: [
        { title: 'Connect Wallet', path: '/dashboard', description: 'Connect your Web3 wallet to access platform features' },
        { title: 'Platform Overview', path: '/dashboard', description: 'View available services and features' }
      ]
    },
    {
      title: 'Token Services',
      content: [
        { title: 'Token Factory', path: '/token-factory', description: 'Create ERC20/BEP20 tokens with automatic liquidity' },
        { title: 'Token Trading', path: '/marketplace', description: 'Trade tokens across multiple chains' }
      ]
    },
    {
      title: 'NFT Features',
      content: [
        { title: 'NFT Studio', path: '/nft-studio', description: 'Create and manage NFT collections' },
        { title: 'NFT Trading', path: '/marketplace', description: 'Trade NFTs in the marketplace' }
      ]
    },
    {
      title: 'DeFi Integration',
      content: [
        { title: 'Swap Tokens', path: '/marketplace', description: 'Access DEX aggregator for best rates' },
        { title: 'Liquidity Provision', path: '/marketplace', description: 'Provide liquidity and earn fees' }
      ]
    },
    {
      title: 'Identity Management',
      content: [
        { title: 'Create Identity', path: '/idm', description: 'Create blockchain-based identity' },
        { title: 'Manage Templates', path: '/idm/templates', description: 'Access pre-verified identity templates' }
      ]
    },
    {
      title: 'Development Tools',
      content: [
        { title: 'Smart Contract Templates', path: '/templates', description: '100+ verified smart contract templates' },
        { title: 'Web3 IDE', path: '/ide', description: 'Integrated development environment for Web3' }
      ]
    },
    {
      title: 'Platform Analytics',
      content: [
        { title: 'Transaction History', path: '/analytics', description: 'View detailed transaction metrics' },
        { title: 'Platform Metrics', path: '/analytics', description: 'Monitor platform performance' }
      ]
    }
  ];

  const shortcuts = {
    'Ctrl + W': 'Connect/Disconnect Wallet',
    'Ctrl + T': 'Switch Network',
    'Ctrl + M': 'Open Marketplace',
    'Ctrl + D': 'Open Documentation',
    'Ctrl + S': 'Quick Settings',
    'Ctrl + H': 'Transaction History'
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>Platform Documentation</Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Keyboard Shortcuts</Typography>
        <Grid container spacing={2}>
          {Object.entries(shortcuts).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <code>{key}</code>
                <Typography>{value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {sections.map((section) => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>{section.title}</Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {section.content.map((item) => (
              <ListItem key={item.title}>
                <ListItemText
                  primary={
                    <Link component={RouterLink} to={item.path}>
                      {item.title}
                    </Link>
                  }
                  secondary={item.description}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}
