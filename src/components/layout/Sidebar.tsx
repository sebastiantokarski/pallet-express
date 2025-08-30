'use client';

import Box from '@mui/material/Box';

// Always visible sidebar, not toggled
export const Sidebar = () => {
  return (
    <Box component="aside" sx={{ width: 250, height: '100vh', borderRight: '1px solid', borderColor: 'divider', position: 'fixed', top: 0, left: 0, bgcolor: 'background.paper', pt: 8 }}></Box>

  );
};
