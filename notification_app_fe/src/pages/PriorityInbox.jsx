import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Slider, Button, CircularProgress, Divider, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { IconStar as StarIcon } from '../components/Icons';
import { Log } from 'logging_middleware';
import { useNotifications } from '../state/useNotifications';
import NotificationCard from '../components/NotificationCard';

const WEIGHT = { Placement: 3, Result: 2, Event: 1 };
const TYPE_FILTERS = ['All', 'Placement', 'Result', 'Event'];

export default function PriorityInbox() {
  const { notifications, loading, error, readIds, markAsRead, sortByPriority } = useNotifications();
  const [topN, setTopN] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    Log('frontend', 'info', 'page', 'PriorityInbox page mounted');
    return () => { Log('frontend', 'debug', 'page', 'PriorityInbox page unmounted'); };
  }, []);

  const handleTopNChange = async (_, newVal) => {
    setTopN(newVal);
    await Log('frontend', 'info', 'page', `PriorityInbox: top-N changed to ${newVal}`);
  };

  const handleTypeFilter = async (_, newVal) => {
    if (newVal !== null) {
      setTypeFilter(newVal);
      await Log('frontend', 'info', 'page', `PriorityInbox: type filter changed to "${newVal}"`);
    }
  };

  const sorted = sortByPriority(notifications);
  const topNotifications = sorted.slice(0, topN);
  const displayed = typeFilter === 'All'
    ? topNotifications
    : topNotifications.filter(n => n.Type === typeFilter);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
          <Box sx={{ color: '#f59e0b', display: 'flex' }}>
            <StarIcon style={{ width: 18, height: 18 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0' }}>
            Priority Inbox
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.75rem', color: '#3d3d5c' }}>
          Placement &rsaquo; Result &rsaquo; Event &nbsp;·&nbsp; then by recency
        </Typography>
      </Box>

      {/* Top-N control */}
      <Box sx={{ mb: 3, p: 2, bgcolor: '#13131f', borderRadius: 1.5, border: '1px solid #1a1a2e' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#4a4a6a' }}>
            Showing top
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>
            {topN} notifications
          </Typography>
        </Box>
        <Slider
          id="top-n-slider"
          value={topN}
          min={5}
          max={20}
          step={5}
          marks={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 15, label: '15' },
            { value: 20, label: '20' },
          ]}
          onChange={handleTopNChange}
          sx={{
            color: '#f59e0b',
            '& .MuiSlider-markLabel': { color: '#2d2d42', fontSize: '0.7rem' },
            '& .MuiSlider-thumb': { width: 14, height: 14 },
          }}
        />
      </Box>

      {/* Type filter */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {TYPE_FILTERS.map(t => (
            <Button
              key={t}
              id={`type-toggle-${t.toLowerCase()}`}
              size="small"
              onClick={() => handleTypeFilter(null, t)}
              sx={{
                textTransform: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: typeFilter === t ? 600 : 400,
                fontSize: '0.8rem',
                px: 1.5, py: 0.4,
                borderRadius: 1,
                minWidth: 0,
                bgcolor: typeFilter === t ? '#f59e0b' : 'transparent',
                color: typeFilter === t ? '#0c0c14' : '#4a4a6a',
                '&:hover': {
                  bgcolor: typeFilter === t ? '#f59e0b' : '#1a1a2e',
                  color: typeFilter === t ? '#0c0c14' : '#e2e8f0',
                },
              }}
            >
              {t}
            </Button>
          ))}
        </Box>
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
          No notifications found.
        </Typography>
      )}

      {!loading && !error && displayed.map((n, idx) => (
        <Box key={n.ID} sx={{ position: 'relative' }}>
          <Typography sx={{
            position: 'absolute', left: -20, top: 14,
            fontSize: '0.6rem', color: '#252540', fontWeight: 700,
            display: { xs: 'none', md: 'block' },
          }}>
            {idx + 1}
          </Typography>
          <NotificationCard
            notification={n}
            isRead={readIds.has(n.ID)}
            onMarkRead={markAsRead}
          />
        </Box>
      ))}
    </Box>
  );
}
