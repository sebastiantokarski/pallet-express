import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import TrailerSelect from '@/components/TrailerSelect/TrailerSelect';

export const Sidebar = () => {
  return (
    <Box component="aside" sx={{ width: 250, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 4 }}>
      <Toolbar />
      <TrailerSelect />
    </Box>

  );
};
