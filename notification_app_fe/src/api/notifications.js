import { Log } from 'logging_middleware';

// All requests go through the Vite proxy at /api which forwards to the evaluation server
// This avoids the server's broken CORS headers
const BASE_URL = '/api/evaluation-service';
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

/**
 * Fetches notifications from the evaluation API.
 * Supports optional query params: limit, page, notification_type.
 */
export async function fetchNotifications(params = {}) {
  await Log('frontend', 'info', 'api', `Fetching notifications with params: ${JSON.stringify(params)}`);

  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${BASE_URL}/notifications?${queryString}`
    : `${BASE_URL}/notifications`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      await Log('frontend', 'error', 'api', `Notification API responded with status ${response.status}`);
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    await Log('frontend', 'info', 'api', `Successfully fetched ${data.notifications?.length ?? 0} notifications`);
    return data.notifications || [];
  } catch (err) {
    await Log('frontend', 'fatal', 'api', `Network error while fetching notifications: ${err.message}`);
    throw err;
  }
}
