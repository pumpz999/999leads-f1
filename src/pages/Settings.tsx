import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Alert, Tabs, Tab } from '@mui/material';
import { Save, Settings as SettingsIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateSettingsMutation } from '../store/api';
import { useTheme } from '@mui/material/styles';

interface SettingsForm {
  // Network Settings
  rpcEndpoints: {
    ethereum: string;
    bsc: string;
    polygon: string;
  };
  chainIds: {
    ethereum: number;
    bsc: number;
    polygon: number;
  };
  
  // API Keys
  defiApiKey: string;
  dexApiKey: string;
  chainlinkApiKey: string;
  theGraphApiKey: string;
  ipfsApiKey: string;
  walletConnectProjectId: string;
  
  // Contract Addresses
  contractAddresses: {
    marketplace: string;
    idm: string;
    tokenFactory: string;
    nftStudio: string;
  };
  
  // Platform Settings
  platformFees: {
    trading: number;
    minting: number;
    staking: number;
  };
  
  // Security Settings
  securityConfig: {
    minConfirmations: number;
    maxGasPrice: number;
    emergencyWallet: string;
  };
}

export default function Settings() {
  const theme = useTheme();
  const { control, handleSubmit } = useForm<SettingsForm>();
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const onSubmit = async (data: SettingsForm) => {
    try {
      await updateSettings(data).unwrap();
      setError(null);
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon fontSize="large" />
        Platform Settings
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Network" />
        <Tab label="API Keys" />
        <Tab label="Contracts" />
        <Tab label="Platform" />
        <Tab label="Security" />
      </Tabs>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {tabValue === 0 && (
              <>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="rpcEndpoints.ethereum"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Ethereum RPC Endpoint" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="rpcEndpoints.bsc"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="BSC RPC Endpoint" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="rpcEndpoints.polygon"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Polygon RPC Endpoint" fullWidth />
                    )}
                  />
                </Grid>
              </>
            )}

            {tabValue === 1 && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="defiApiKey"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="DeFi API Key" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dexApiKey"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="DEX API Key" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="ipfsApiKey"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="IPFS API Key" fullWidth />
                    )}
                  />
                </Grid>
              </>
            )}

            {tabValue === 2 && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contractAddresses.marketplace"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Marketplace Contract" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="contractAddresses.idm"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="IDM Contract" fullWidth />
                    )}
                  />
                </Grid>
              </>
            )}

            {tabValue === 3 && (
              <>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="platformFees.trading"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField {...field} label="Trading Fee %" type="number" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="platformFees.minting"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField {...field} label="Minting Fee %" type="number" fullWidth />
                    )}
                  />
                </Grid>
              </>
            )}

            {tabValue === 4 && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="securityConfig.emergencyWallet"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Emergency Wallet Address" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="securityConfig.maxGasPrice"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField {...field} label="Max Gas Price (GWEI)" type="number" fullWidth />
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Save />}
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
