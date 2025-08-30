'use client';

import LanguageIcon from '@mui/icons-material/Language';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { routing } from '@/libs/I18nRouting';

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const pathname = usePathname();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (locale?: string) => {
    setAnchorEl(null);
    if (locale) {
      // Replace locale in pathname or prepend if not present
      const segments = pathname.split('/');
      if (segments[1] && routing.locales.includes(segments[1])) {
        segments[1] = locale;
        router.push(segments.join('/'));
      } else {
        router.push(`/${locale}${pathname}`);
      }
    }
  };

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <span style={{ fontWeight: 700, letterSpacing: 1 }}>LOGO</span>
        </Typography>
        <Box>
          <IconButton
            size="large"
            aria-label="change language"
            aria-controls="lang-menu"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            id="lang-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose()}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {routing.locales.map(locale => (
              <MenuItem key={locale} onClick={() => handleClose(locale)}>
                {locale.toUpperCase()}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
