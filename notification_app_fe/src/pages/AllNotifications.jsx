import React, { useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Divider } from '@mui/material';
import { IconRefresh as RefreshIcon, IconDoneAll as DoneAllIcon } from '../components/Icons';
import { Log } from 'logging_middleware';
import { useNotifications } from '../state/useNotifications';
import NotificationCard from '../components/NotificationCard';

const TYPES = ['All', 'Placement', 'Result', 'Event'];

export default function AllNotifications() {
  const { notifications, loading, error, readIds, markAsRead, markAllRead, reload } = useNotifications();
  const [activeFilter, setActiveFilter] = React.useState('All');

  useEffect(() => {
    Log('frontend', 'info', 'page', 'AllNotifications page mounted');
    return () => { Log('frontend', 'debug', 'page', 'AllNotifications page unmounted'); };
  }, []);

  const handleFilterChange = async (type) => {
    setActiveFilter(type);
    await Log('frontend', 'info', 'page', `AllNotifications: filter changed to "${type}"`);
  };

  const handleRefresh = async () => {
    await Log('frontend', 'info', 'page', 'AllNotifications: user triggered refresh');
    reload();
  };

  const displayed = activeFilter === 'All'
    ? notifications
    : notifications.filter(n => n.Type === activeFilter);

  const unreadCount = notifications.filter(n => !readIds.has(n.ID)).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e2e8f0', fontSize: '1.1rem' }}>
              All Notifications
            </Typography>
            <Typography variant="caption" sx={{ color: '#3d3d5c' }}>
              {notifications.length} total · {unreadCount} unread
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              id="mark-all-read-btn"
              size="small"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              sx={{
                fontSize: '0.75rem', color: '#4a4a6a', textTransform: 'none',
                '&:hover': { color: '#e2e8f0', bgcolor: '#1e1e30' },
              }}
              startIcon={<DoneAllIcon style={{ width: 14, height: 14 }} />}
            >
              Mark all read
            </Button>
            <Button
              id="refresh-btn"
              size="small"
              onClick={handleRefresh}
              sx={{
                fontSize: '0.75rem', color: '#4a4a6a', textTransform: 'none',
                '&:hover': { color: '#e2e8f0', bgcolor: '#1e1e30' },
              }}
              startIcon={<RefreshIcon style={{ width: 14, height: 14 }} />}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Filter tabs — solid filled active, plain text inactive */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 2.5 }}>
        {TYPES.map(type => (
          <Button
            id={`filter-chip-${type.toLowerCase()}`}
            key={type}
            size="small"
            onClick={() => handleFilterChange(type)}
            sx={{
              textTransform: 'none',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: activeFilter === type ? 600 : 400,
              fontSize: '0.8rem',
              px: 1.5,
              py: 0.4,
              borderRadius: 1,
              minWidth: 0,
              bgcolor: activeFilter === type ? '#f59e0b' : 'transparent',
              color: activeFilter === type ? '#0c0c14' : '#4a4a6a',
              '&:hover': {
                bgcolor: activeFilter === type ? '#f59e0b' : '#1a1a2e',
                color: activeFilter === type ? '#0c0c14' : '#e2e8f0',
              },
            }}
          >
            {type}
          </Button>
        ))}
      </Box>

      <Divider sx={{ borderColor: '#1a1a2e', mb: 1 }} />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={24} sx={{ color: '#f59e0b' }} />
        </Box>
      )}

      {error && !loading && (
        <Box sx={{ py: 3, px: 2, bgcolor: '#1a0a0a', borderRadius: 1.5, border: '1px solid #3d1515' }}>
          <Typography sx={{ color: '#f87171', fontSize: '0.85rem' }}>
            Failed to load: {error}
          </Typography>
        </Box>
      )}

      {!loading && !error && displayed.length === 0 && (
        <Typography sx={{ color: '#2a2a40', textAlign: 'center', py: 6, fontSize: '0.875rem' }}>
          No notifications here.
        </Typography>
      )}

      {!loading && !error && displayed.map(n => (
        <NotificationCard
          key={n.ID}
          notification={n}
          isRead={readIds.has(n.ID)}
          onMarkRead={markAsRead}
        />
      ))}
    </Box>
  );
}
