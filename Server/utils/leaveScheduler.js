import { runMonthlyLeaveCredit, runYearEndCarryForward } from "./leaveManagement.js";

let schedulerInitialized = false;
let schedulerInterval = null;
let isJobRunning = false;
let lastMonthlyRunKey = "";
let lastYearEndRunKey = "";

const SCHEDULER_INTERVAL_MS = 60 * 1000;

const shouldRunMonthlyJob = (date) =>
  date.getDate() >= 1 && date.getDate() <= 7;

const shouldRunYearEndJob = (date) =>
  date.getMonth() === 0 && date.getDate() >= 1 && date.getDate() <= 7;

const runScheduledJobs = async () => {
  if (isJobRunning) {
    return;
  }

  isJobRunning = true;
  try {
    const now = new Date();
    if (shouldRunMonthlyJob(now)) {
      const monthlyRunKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
      if (monthlyRunKey !== lastMonthlyRunKey) {
        const monthlySummary = await runMonthlyLeaveCredit({ runDate: now });
        lastMonthlyRunKey = monthlyRunKey;
        console.log("[leave-scheduler] Monthly leave credit summary:", monthlySummary);
      }
    }

    if (shouldRunYearEndJob(now)) {
      const yearEndRunKey = `${now.getFullYear()}`;
      if (yearEndRunKey !== lastYearEndRunKey) {
        const carrySummary = await runYearEndCarryForward({ runDate: now });
        lastYearEndRunKey = yearEndRunKey;
        console.log("[leave-scheduler] Year-end carry forward summary:", carrySummary);
      }
    }
  } catch (error) {
    console.error("[leave-scheduler] Job failed:", error);
  } finally {
    isJobRunning = false;
  }
};

export const initializeLeaveScheduler = () => {
  if (schedulerInitialized) {
    return;
  }

  schedulerInitialized = true;
  schedulerInterval = setInterval(runScheduledJobs, SCHEDULER_INTERVAL_MS);
  runScheduledJobs().catch((error) => {
    console.error("[leave-scheduler] Initial run failed:", error);
  });
  console.log("[leave-scheduler] Initialized (runs every minute)");
};

export const stopLeaveScheduler = () => {
  if (!schedulerInitialized || !schedulerInterval) {
    return;
  }
  clearInterval(schedulerInterval);
  schedulerInterval = null;
  schedulerInitialized = false;
  lastMonthlyRunKey = "";
  lastYearEndRunKey = "";
};
