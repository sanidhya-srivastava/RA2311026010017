export const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzczI5MTVAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMzY0NCwiaWF0IjoxNzc3NzAyNzQ0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODQyMjZlMjMtZDVmZi00Y2I3LWIyYTktYTYyN2MyZTU4YjBlIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FuaWRoeWEgc3JpdmFzdGF2YSIsInN1YiI6ImRkYTYwNGM0LTEyNGYtNDNjMC1hZWFiLTA0MmI3ZmQyZTUxYyJ9LCJlbWFpbCI6InNzMjkxNUBzcm1pc3QuZWR1LmluIiwibmFtZSI6InNhbmlkaHlhIHNyaXZhc3RhdmEiLCJyb2xsTm8iOiJyYTIzMTEwMjYwMTAwMTciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJkZGE2MDRjNC0xMjRmLTQzYzAtYWVhYi0wNDJiN2ZkMmU1MWMiLCJjbGllbnRTZWNyZXQiOiJyU2hGYkdTSnlrYWh6a0ZRIn0.RU2Im3OXYhrEGCq6Qn2vHZ0GRY4wVvo9yUY1sEWy_N4";
const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

/**
 * Reusable Logging Middleware for Evaluation Server
 * @param {string} stack - "frontend" or "backend"
 * @param {string} level - "debug", "info", "warn", "error", or "fatal"
 * @param {string} packageName - See instructions for allowed values based on stack
 * @param {string} message - The descriptive log message
 */
export const Log = async (stack, level, packageName, message) => {
  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        stack: stack,
        level: level,
        package: packageName,
        message: message
      })
    });

    if (!response.ok) {
      // Do nothing, strict evaluation rules prohibit console.log or language loggers
    }
  } catch (error) {
    // Silence network errors to comply with "no console.log" rule
  }
};
