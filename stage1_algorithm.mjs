import { Log } from './logging_middleware/logger.js';

// Define priority weights according to the requirements
const PRIORITY_WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

/**
 * Compares two notifications based on Weight and Recency.
 * Returns > 0 if b should appear before a (b is higher priority)
 * Returns < 0 if a should appear before b (a is higher priority)
 */
function comparePriority(a, b) {
    const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
    const weightB = PRIORITY_WEIGHTS[b.Type] || 0;

    // 1. Compare by weight first
    if (weightA !== weightB) {
        return weightB - weightA; // Descending order of weight
    }

    // 2. If weights are equal, compare by recency (timestamp)
    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    
    return timeB - timeA; // Descending order of time (newest first)
}

/**
 * Finds the top N notifications from an array.
 */
function getTopNNotifications(notifications, n) {
    // Clone array and sort using our custom comparator
    const sorted = [...notifications].sort(comparePriority);
    return sorted.slice(0, n);
}

// ==========================================
// TEST EXECUTION
// ==========================================
async function runStage1Test() {
    // Requirement: Extensive use of custom logger
    await Log("backend", "info", "utils", "Initializing Stage 1 Priority Algorithm Test...");

    // Sample data simulating the API response
    const incomingNotifications = [
        { ID: "1", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:50:54" },
        { ID: "2", Type: "Event", Message: "tech-fest", Timestamp: "2026-04-22 17:51:06" },
        { ID: "3", Type: "Placement", Message: "CSX Corporation hiring", Timestamp: "2026-04-22 17:51:18" },
        { ID: "4", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:49:54" },
        { ID: "5", Type: "Placement", Message: "Advanced Micro Devices Inc. hiring", Timestamp: "2026-04-22 17:49:42" },
        { ID: "6", Type: "Event", Message: "farewell", Timestamp: "2026-04-22 17:48:00" },
    ];

    console.log("--- Incoming Notifications (Unsorted) ---");
    incomingNotifications.forEach(n => console.log(`[${n.Type}] - ${n.Timestamp} - ${n.Message}`));

    const topNCount = 3;
    await Log("backend", "debug", "utils", `Calculating top ${topNCount} priority notifications.`);
    
    const topNotifications = getTopNNotifications(incomingNotifications, topNCount);

    console.log(`\n--- Top ${topNCount} Priority Notifications ---`);
    topNotifications.forEach((n, index) => {
        console.log(`${index + 1}. [${n.Type}] - ${n.Timestamp} - ${n.Message}`);
    });

    await Log("backend", "info", "utils", "Stage 1 Priority Algorithm Test completed successfully.");
}

// Run the test
runStage1Test();
