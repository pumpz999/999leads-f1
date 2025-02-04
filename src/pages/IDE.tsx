import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { compile } from 'solc';

export default function IDE() {
  const [code, setCode] = useState('');
  const [compiledCode, setCompiledCode] = useState(null);
  const [error, setError] = useState('');

  const compileContract = async () => {
    try {
      const input = {
        language: 'Solidity',
        sources: {
          'contract.sol': {
            content: code
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };

      const output = JSON.parse(await compile(JSON.stringify(input)));
      setCompiledCode(output);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Smart Contract IDE
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <MonacoEditor
              height="600px"
              language="sol"
              theme="vs-dark"
              value={code}
              onChange={setCode}
              options={{
                minimap: { enabled: false },
                automaticLayout: true
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '600px', overflow: 'auto' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={compileContract}
              sx={{ mb: 2 }}
            >
              Compile Contract
            </Button>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            {compiledCode && (
              <pre>
                {JSON.stringify(compiledCode, null, 2)}
              </pre>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
