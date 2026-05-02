import { useState, useEffect, useCallback } from 'react';
import { Log } from 'logging_middleware';
import { fetchNotifications } from '../api/notifications';

const WEIGHT = { Placement: 3, Result: 2, Event: 1 };

function sortByPriority(list) {
  return [...list].sort((a, b) => {
    const wDiff = (WEIGHT[b.Type] || 0) - (WEIGHT[a.Type] || 0);
    if (wDiff !== 0) return wDiff;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Read/unread state stored in localStorage so it persists across page refreshes
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem('readNotificationIds');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const load = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    await Log('frontend', 'debug', 'hook', 'useNotifications: starting data load');
    try {
      const data = await fetchNotifications(params);
      setNotifications(data);
      await Log('frontend', 'info', 'hook', `useNotifications: loaded ${data.length} notifications`);
    } catch (err) {
      setError(err.message);
      await Log('frontend', 'error', 'hook', `useNotifications: load failed — ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markAsRead = useCallback(async (id) => {
    setReadIds(prev => {
      const updated = new Set(prev);
      updated.add(id);
      localStorage.setItem('readNotificationIds', JSON.stringify([...updated]));
      return updated;
    });
    await Log('frontend', 'debug', 'hook', `Marked notification ${id} as read`);
  }, []);

  const markAllRead = useCallback(async () => {
    const allIds = notifications.map(n => n.ID);
    setReadIds(prev => {
      const updated = new Set([...prev, ...allIds]);
      localStorage.setItem('readNotificationIds', JSON.stringify([...updated]));
      return updated;
    });
    await Log('frontend', 'info', 'hook', 'Marked all notifications as read');
  }, [notifications]);

  return {
    notifications,
    loading,
    error,
    readIds,
    markAsRead,
    markAllRead,
    reload: load,
    sortByPriority,
  };
}
