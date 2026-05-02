import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemText,
  Typography, useMediaQuery, useTheme, IconButton, AppBar, Toolbar, Badge,
} from '@mui/material';
import {
  IconNotifications as NotificationsNoneIcon,
  IconStarBorder as StarBorderIcon,
  IconMenu as MenuIcon,
} from './Icons';
import { Log } from 'logging_middleware';
import AllNotifications from '../pages/AllNotifications';
import PriorityInbox from '../pages/PriorityInbox';

const NAV_ITEMS = [
  { label: 'All Notifications', icon: <NotificationsNoneIcon />, key: 'all' },
  { label: 'Priority Inbox',    icon: <StarBorderIcon />,        key: 'priority' },
];

const DRAWER_WIDTH = 210;

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activePage, setActivePage] = useState('all');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = async (key) => {
    setActivePage(key);
    setMobileOpen(false);
    await Log('frontend', 'info', 'component', `Navigation: user switched to "${key}" view`);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f0f1c', borderRight: '1px solid #1a1a2e' }}>
      {/* Branding */}
      <Box sx={{ px: 2.5, py: 2.5, borderBottom: '1px solid #1a1a2e' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0', letterSpacing: '-0.2px' }}>
          campus<span style={{ color: '#f59e0b' }}>notify</span>
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: '#3d3d5c', mt: 0.2 }}>
          notification centre
        </Typography>
      </Box>

      {/* Nav */}
      <List sx={{ px: 1.5, pt: 1.5, flexGrow: 1 }}>
        {NAV_ITEMS.map(item => {
          const isActive = activePage === item.key;
          return (
            <ListItem key={item.key} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                id={`nav-${item.key}`}
                onClick={() => handleNavClick(item.key)}
                sx={{
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 0.9,
                  bgcolor: isActive ? '#1e1e30' : 'transparent',
                  // Left accent bar replaces glow effects
                  borderLeft: isActive ? '2px solid #f59e0b' : '2px solid transparent',
                  '&:hover': { bgcolor: '#17172a' },
                  transition: 'all 0.15s',
                  gap: 1.2,
                }}
              >
                <Box sx={{ color: isActive ? '#f59e0b' : '#3d3d5c', display: 'flex', flexShrink: 0 }}>
                  {item.icon}
                </Box>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#e2e8f0' : '#4a4a6a',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer hint */}
      <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid #1a1a2e' }}>
        <Typography sx={{ fontSize: '0.65rem', color: '#252540' }}>
          SRM Campus Platform
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile && (
        <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#0f0f1c', borderBottom: '1px solid #1a1a2e' }}>
          <Toolbar sx={{ minHeight: '52px !important' }}>
            <IconButton id="mobile-menu-btn" edge="start" onClick={() => setMobileOpen(true)} sx={{ color: '#4a4a6a', mr: 1.5 }}>
              <MenuIcon />
            </IconButton>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#e2e8f0' }}>
              campus<span style={{ color: '#f59e0b' }}>notify</span>
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'transparent',
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3.5 },
          mt: { xs: '52px', md: 0 },
          maxWidth: 760,
          width: '100%',
        }}
      >
        {activePage === 'all'      && <AllNotifications />}
        {activePage === 'priority' && <PriorityInbox />}
      </Box>
    </Box>
  );
}
