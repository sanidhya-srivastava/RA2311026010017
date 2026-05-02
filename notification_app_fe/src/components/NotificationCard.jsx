import React from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import {
  IconCheckCircleOutline as CheckCircleOutlineIcon,
  IconCheckCircle as CheckCircleIcon,
  IconEvent as EventIcon,
  IconWork as WorkIcon,
  IconAssessment as AssessmentIcon,
} from './Icons';

const TYPE_CONFIG = {
  Placement: { label: 'Placement', icon: <WorkIcon />,       color: '#f59e0b' },
  Result:    { label: 'Result',    icon: <AssessmentIcon />, color: '#60a5fa' },
  Event:     { label: 'Event',     icon: <EventIcon />,      color: '#34d399' },
};

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now - d;
  const diffHrs = diffMs / (1000 * 60 * 60);

  if (diffHrs < 1) return `${Math.floor(diffMs / 60000)}m ago`;
  if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function NotificationCard({ notification, isRead, onMarkRead }) {
  const config = TYPE_CONFIG[notification.Type] || TYPE_CONFIG.Event;

  return (
    <Box
      id={`notification-card-${notification.ID}`}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        px: 2,
        py: 1.8,
        mb: 1,
        borderRadius: 2,
        bgcolor: isRead ? 'transparent' : '#16162a',
        border: '1px solid',
        borderColor: isRead ? '#1e1e30' : '#252540',
        borderLeft: isRead ? '1px solid #1e1e30' : `3px solid ${config.color}`,
        transition: 'background 0.15s',
        '&:hover': {
          bgcolor: '#16162a',
        },
      }}
    >
      {/* Type icon */}
      <Box sx={{
        mt: 0.3,
        color: isRead ? '#3d3d5c' : config.color,
        flexShrink: 0,
        display: 'flex',
      }}>
        {config.icon}
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: isRead ? 400 : 600,
              color: isRead ? '#4a4a6a' : '#e2e8f0',
              textTransform: 'capitalize',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {notification.Message}
          </Typography>
          {!isRead && (
            <Box sx={{
              width: 6, height: 6, borderRadius: '50%',
              bgcolor: config.color, flexShrink: 0,
            }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#3d3d5c', fontSize: '0.7rem' }}>
            {config.label}
          </Typography>
          <Typography variant="caption" sx={{ color: '#2a2a40', fontSize: '0.7rem' }}>·</Typography>
          <Typography variant="caption" sx={{ color: '#3d3d5c', fontSize: '0.7rem' }}>
            {formatTime(notification.Timestamp)}
          </Typography>
        </Box>
      </Box>

      {/* Mark read */}
      <IconButton
        id={`mark-read-btn-${notification.ID}`}
        size="small"
        disabled={isRead}
        onClick={() => onMarkRead(notification.ID)}
        sx={{
          color: isRead ? '#252540' : '#3d3d5c',
          '&:hover': { color: config.color },
          p: 0.5,
          flexShrink: 0,
        }}
      >
        {isRead
          ? <CheckCircleIcon style={{ width: 16, height: 16 }} />
          : <CheckCircleOutlineIcon style={{ width: 16, height: 16 }} />}
      </IconButton>
    </Box>
  );
}
