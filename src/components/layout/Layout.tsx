import { Box, useTheme as useMuiTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUI } from '../../store/slices/uiSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Added useNavigate
import Dashboard from '../../pages/Dashboard';
import Templates from '../../pages/Templates';
import Analytics from '../../pages/Analytics';
import Settings from '../../pages/Settings';
import IDE from '../../pages/IDE';
import Forum from '../../pages/Forum';
import Chat from '../../pages/Chat';
import { useEffect } from 'react'; // Added useEffect

export default function Layout() {
  const { sidebarOpen } = useSelector(selectUI);
  const theme = useMuiTheme();
  const navigate = useNavigate(); // Added useNavigate hook

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch(e.key.toLowerCase()) {
          case 'w': 
            // Toggle wallet connection
            break;
          case 't':
            // Switch network
            break;
          case 'm':
            navigate('/marketplace');
            break;
          case 'd':
            navigate('/docs');
            break;
          case 's':
            navigate('/settings');
            break;
          case 'h':
            navigate('/analytics');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]); // Added navigate to dependency array

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: sidebarOpen ? '240px' : '64px',
        }}
      >
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ide" element={<IDE />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
