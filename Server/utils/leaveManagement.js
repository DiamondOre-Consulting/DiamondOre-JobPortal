import Employees from "../Models/Employees.js";
import Attendance from "../Models/Attendance.js";
import LeaveBalance from "../Models/LeaveBalance.js";
import LeaveLedger from "../Models/LeaveLedger.js";
import LeaveRequest from "../Models/LeaveRequest.js";
import MonthlyAttendanceSummary from "../Models/MonthlyAttendanceSummary.js";
import MonthlyLeaveSummary from "../Models/MonthlyLeaveSummary.js";

export const CL_MONTHLY_CREDIT = Number(process.env.CL_MONTHLY_CREDIT || 1);
export const EL_BIMONTHLY_CREDIT = Number(process.env.EL_BIMONTHLY_CREDIT || 1);
export const EL_CREDIT_INTERVAL_MONTHS = Number(
  process.env.EL_CREDIT_INTERVAL_MONTHS || 2
);

const CL_CARRY_FORWARD_CAP = Number(process.env.CL_CARRY_FORWARD_CAP || 0);
const EL_CARRY_FORWARD_CAP = Number(process.env.EL_CARRY_FORWARD_CAP || 0);

const hasCarryCap = (value) => Number.isFinite(value) && value > 0;

export const normalizeDateOnly = (dateValue) => {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }
  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

export const getLeaveYear = (dateValue = new Date()) => {
  const normalizedDate = normalizeDateOnly(dateValue) || new Date();
  return normalizedDate.getFullYear();
};

const enumerateDates = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const getMonthDateRange = ({ year, month }) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

export const buildMonthlyTransactionKey = ({
  employeeId,
  year,
  month,
  type,
}) => `${type}-${employeeId}-${year}-${month}`;

export const buildCarryForwardKey = ({ employeeId, previousYear, nextYear }) =>
  `carry-forward-${employeeId}-${previousYear}-${nextYear}`;

export const ensureLeaveBalance = async (employeeId, year) => {
  let leaveBalance = await LeaveBalance.findOne({ employeeId, year });
  if (!leaveBalance) {
    leaveBalance = await LeaveBalance.create({
      employeeId,
      year,
      clBalance: 0,
      elBalance: 0,
      lopUsed: 0,
    });
  }
  return leaveBalance;
};

export const recomputeMonthlyAttendanceSummary = async ({
  employeeId,
  year,
  month,
}) => {
  if (!employeeId) {
    throw new Error("employeeId is required for monthly attendance summary");
  }

  const parsedYear = Number(year);
  const parsedMonth = Number(month);
  if (
    !Number.isInteger(parsedYear) ||
    parsedYear <= 0 ||
    !Number.isInteger(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    throw new Error("Invalid year/month for monthly attendance summary");
  }

  const { startDate, endDate } = getMonthDateRange({
    year: parsedYear,
    month: parsedMonth,
  });

  const attendanceRows = await Attendance.find({
    employeeId,
    date: { $gte: startDate, $lte: endDate },
  }).select("status");

  let presentDays = 0;
  let absentDays = 0;
  let halfDays = 0;

  for (const row of attendanceRows) {
    if (row.status === "Absent") {
      absentDays += 1;
    } else if (row.status === "Half Day") {
      halfDays += 1;
    } else {
      presentDays += 1;
    }
  }

  const leaveUnits = absentDays + halfDays * 0.5;
  const totalMarkedDays = attendanceRows.length;

  const summary = await MonthlyAttendanceSummary.findOneAndUpdate(
    { employeeId, year: parsedYear, month: parsedMonth },
    {
      employeeId,
      year: parsedYear,
      month: parsedMonth,
      presentDays,
      absentDays,
      halfDays,
      leaveUnits,
      totalMarkedDays,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return summary;
};

export const getStoredMonthlyAttendanceSummary = async ({
  employeeId,
  year,
  recompute = true,
}) => {
  const parsedYear = Number(year);
  if (!Number.isInteger(parsedYear) || parsedYear <= 0) {
    throw new Error("Invalid year for monthly attendance summary");
  }

  if (recompute) {
    const computedMonths = [];
    for (let month = 1; month <= 12; month += 1) {
      const summary = await recomputeMonthlyAttendanceSummary({
        employeeId,
        year: parsedYear,
        month,
      });
      computedMonths.push(summary);
    }
    return computedMonths;
  }

  const existingRows = await MonthlyAttendanceSummary.find({
    employeeId,
    year: parsedYear,
  }).sort({ month: 1 });

  const byMonth = new Map(existingRows.map((row) => [row.month, row]));
  const months = [];
  for (let month = 1; month <= 12; month += 1) {
    const existing = byMonth.get(month);
    if (existing) {
      months.push(existing);
      continue;
    }

    months.push({
      employeeId,
      year: parsedYear,
      month,
      presentDays: 0,
      absentDays: 0,
      halfDays: 0,
      leaveUnits: 0,
      totalMarkedDays: 0,
    });
  }

  return months;
};

const toFiniteNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const roundTwo = (value) => Number(toFiniteNumber(value).toFixed(2));

const getMonthSummarySeed = ({ employeeId, year, month }) => ({
  employeeId,
  year,
  month,
  presentDays: 0,
  absentDays: 0,
  halfDays: 0,
  leaveUnits: 0,
  totalMarkedDays: 0,
  clCredited: 0,
  elCredited: 0,
  compOffCL: 0,
  compOffEL: 0,
  carryForwardCL: 0,
  carryForwardEL: 0,
  clUsed: 0,
  elUsed: 0,
  lopUsed: 0,
  manualAdjustmentCL: 0,
  manualAdjustmentEL: 0,
  manualAdjustmentLOP: 0,
  pendingRequests: 0,
  approvedRequests: 0,
  rejectedRequests: 0,
  modifiedRequests: 0,
  totalRequests: 0,
});

const getSummaryTotalsSeed = () => ({
  presentDays: 0,
  absentDays: 0,
  halfDays: 0,
  leaveUnits: 0,
  totalMarkedDays: 0,
  clCredited: 0,
  elCredited: 0,
  compOffCL: 0,
  compOffEL: 0,
  carryForwardCL: 0,
  carryForwardEL: 0,
  clUsed: 0,
  elUsed: 0,
  lopUsed: 0,
  manualAdjustmentCL: 0,
  manualAdjustmentEL: 0,
  manualAdjustmentLOP: 0,
  pendingRequests: 0,
  approvedRequests: 0,
  rejectedRequests: 0,
  modifiedRequests: 0,
  totalRequests: 0,
});

const parseAppliedBreakup = (breakup = {}) => ({
  cl: toFiniteNumber(breakup?.cl, 0),
  el: toFiniteNumber(breakup?.el, 0),
  lop: toFiniteNumber(breakup?.lop, 0),
});

const buildEffectiveDateForLeaveYear = (year, date = new Date()) => {
  const normalizedDate = normalizeDateOnly(date) || new Date();
  return new Date(year, normalizedDate.getMonth(), normalizedDate.getDate());
};

export const recomputeMonthlyLeaveSummary = async ({
  employeeId,
  year,
  month,
}) => {
  if (!employeeId) {
    throw new Error("employeeId is required for monthly leave summary");
  }

  const parsedYear = Number(year);
  const parsedMonth = Number(month);
  if (
    !Number.isInteger(parsedYear) ||
    parsedYear <= 0 ||
    !Number.isInteger(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    throw new Error("Invalid year/month for monthly leave summary");
  }

  const [attendanceSummary, leaveRequests, ledgerEntries] = await Promise.all([
    recomputeMonthlyAttendanceSummary({
      employeeId,
      year: parsedYear,
      month: parsedMonth,
    }),
    (() => {
      const { startDate, endDate } = getMonthDateRange({
        year: parsedYear,
        month: parsedMonth,
      });
      return LeaveRequest.find({
        employeeId,
        leaveYear: parsedYear,
        createdAt: { $gte: startDate, $lte: endDate },
      }).select("status");
    })(),
    (() => {
      const { startDate, endDate } = getMonthDateRange({
        year: parsedYear,
        month: parsedMonth,
      });
      return LeaveLedger.find({
        employeeId,
        leaveYear: parsedYear,
        effectiveDate: { $gte: startDate, $lte: endDate },
      }).select("entryType leaveType amount metadata");
    })(),
  ]);

  const nextSummary = getMonthSummarySeed({
    employeeId,
    year: parsedYear,
    month: parsedMonth,
  });
  nextSummary.presentDays = toFiniteNumber(attendanceSummary?.presentDays, 0);
  nextSummary.absentDays = toFiniteNumber(attendanceSummary?.absentDays, 0);
  nextSummary.halfDays = toFiniteNumber(attendanceSummary?.halfDays, 0);
  nextSummary.leaveUnits = toFiniteNumber(attendanceSummary?.leaveUnits, 0);
  nextSummary.totalMarkedDays = toFiniteNumber(
    attendanceSummary?.totalMarkedDays,
    0
  );

  for (const request of leaveRequests) {
    const status = String(request.status || "").toLowerCase();
    if (status === "pending") nextSummary.pendingRequests += 1;
    if (status === "approved") nextSummary.approvedRequests += 1;
    if (status === "rejected") nextSummary.rejectedRequests += 1;
    if (status === "modified") nextSummary.modifiedRequests += 1;
  }
  nextSummary.totalRequests =
    nextSummary.pendingRequests +
    nextSummary.approvedRequests +
    nextSummary.rejectedRequests +
    nextSummary.modifiedRequests;

  for (const entry of ledgerEntries) {
    const amount = toFiniteNumber(entry.amount, 0);

    if (entry.entryType === "accrual_cl") {
      nextSummary.clCredited += amount;
      continue;
    }
    if (entry.entryType === "accrual_el") {
      nextSummary.elCredited += amount;
      continue;
    }
    if (entry.entryType === "comp_off") {
      if (entry.leaveType === "CL") nextSummary.compOffCL += amount;
      if (entry.leaveType === "EL") nextSummary.compOffEL += amount;
      continue;
    }
    if (entry.entryType === "carry_forward") {
      const clCarry = toFiniteNumber(entry?.metadata?.clToCarry, 0);
      const elCarry = toFiniteNumber(entry?.metadata?.elToCarry, 0);
      if (clCarry > 0 || elCarry > 0) {
        nextSummary.carryForwardCL += clCarry;
        nextSummary.carryForwardEL += elCarry;
      } else if (amount > 0) {
        nextSummary.carryForwardCL += amount;
      }
      continue;
    }
    if (entry.entryType === "deduction") {
      const applied = parseAppliedBreakup(entry?.metadata?.appliedDeduction);
      if (applied.cl > 0 || applied.el > 0 || applied.lop > 0) {
        nextSummary.clUsed += applied.cl;
        nextSummary.elUsed += applied.el;
        nextSummary.lopUsed += applied.lop;
      } else if (entry.leaveType === "CL") {
        nextSummary.clUsed += Math.abs(amount);
      } else if (entry.leaveType === "EL") {
        nextSummary.elUsed += Math.abs(amount);
      } else if (entry.leaveType === "LOP") {
        nextSummary.lopUsed += Math.abs(amount);
      } else {
        nextSummary.lopUsed += Math.abs(amount);
      }
      continue;
    }
    if (entry.entryType === "restore") {
      const restored = parseAppliedBreakup(entry?.metadata?.restoredDeduction);
      if (restored.cl > 0 || restored.el > 0 || restored.lop > 0) {
        nextSummary.clUsed -= restored.cl;
        nextSummary.elUsed -= restored.el;
        nextSummary.lopUsed -= restored.lop;
      } else if (entry.leaveType === "CL") {
        nextSummary.clUsed -= Math.abs(amount);
      } else if (entry.leaveType === "EL") {
        nextSummary.elUsed -= Math.abs(amount);
      } else if (entry.leaveType === "LOP") {
        nextSummary.lopUsed -= Math.abs(amount);
      } else {
        nextSummary.lopUsed -= Math.abs(amount);
      }
      continue;
    }
    if (entry.entryType === "manual_adjust") {
      const delta = parseAppliedBreakup(
        entry?.metadata?.actualDelta || entry?.metadata?.delta
      );
      nextSummary.manualAdjustmentCL += delta.cl;
      nextSummary.manualAdjustmentEL += delta.el;
      nextSummary.manualAdjustmentLOP += delta.lop;
    }
  }

  nextSummary.clCredited = roundTwo(nextSummary.clCredited);
  nextSummary.elCredited = roundTwo(nextSummary.elCredited);
  nextSummary.compOffCL = roundTwo(nextSummary.compOffCL);
  nextSummary.compOffEL = roundTwo(nextSummary.compOffEL);
  nextSummary.carryForwardCL = roundTwo(nextSummary.carryForwardCL);
  nextSummary.carryForwardEL = roundTwo(nextSummary.carryForwardEL);
  nextSummary.clUsed = roundTwo(Math.max(0, nextSummary.clUsed));
  nextSummary.elUsed = roundTwo(Math.max(0, nextSummary.elUsed));
  nextSummary.lopUsed = roundTwo(Math.max(0, nextSummary.lopUsed));
  nextSummary.manualAdjustmentCL = roundTwo(nextSummary.manualAdjustmentCL);
  nextSummary.manualAdjustmentEL = roundTwo(nextSummary.manualAdjustmentEL);
  nextSummary.manualAdjustmentLOP = roundTwo(nextSummary.manualAdjustmentLOP);

  const savedSummary = await MonthlyLeaveSummary.findOneAndUpdate(
    { employeeId, year: parsedYear, month: parsedMonth },
    nextSummary,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return savedSummary;
};

export const getStoredMonthlyLeaveSummary = async ({
  employeeId,
  year,
  recompute = true,
}) => {
  const parsedYear = Number(year);
  if (!Number.isInteger(parsedYear) || parsedYear <= 0) {
    throw new Error("Invalid year for monthly leave summary");
  }

  if (recompute) {
    const computedMonths = [];
    for (let month = 1; month <= 12; month += 1) {
      const summary = await recomputeMonthlyLeaveSummary({
        employeeId,
        year: parsedYear,
        month,
      });
      computedMonths.push(summary);
    }
    return computedMonths;
  }

  const existingRows = await MonthlyLeaveSummary.find({
    employeeId,
    year: parsedYear,
  }).sort({ month: 1 });

  const byMonth = new Map(existingRows.map((row) => [row.month, row]));
  const months = [];

  for (let month = 1; month <= 12; month += 1) {
    const existing = byMonth.get(month);
    if (existing) {
      months.push(existing);
      continue;
    }
    months.push(getMonthSummarySeed({ employeeId, year: parsedYear, month }));
  }

  return months;
};

export const buildLeaveSummaryTotals = (monthlySummary = []) => {
  const totals = getSummaryTotalsSeed();

  for (const row of monthlySummary) {
    totals.presentDays += toFiniteNumber(row?.presentDays, 0);
    totals.absentDays += toFiniteNumber(row?.absentDays, 0);
    totals.halfDays += toFiniteNumber(row?.halfDays, 0);
    totals.leaveUnits += toFiniteNumber(row?.leaveUnits, 0);
    totals.totalMarkedDays += toFiniteNumber(row?.totalMarkedDays, 0);
    totals.clCredited += toFiniteNumber(row?.clCredited, 0);
    totals.elCredited += toFiniteNumber(row?.elCredited, 0);
    totals.compOffCL += toFiniteNumber(row?.compOffCL, 0);
    totals.compOffEL += toFiniteNumber(row?.compOffEL, 0);
    totals.carryForwardCL += toFiniteNumber(row?.carryForwardCL, 0);
    totals.carryForwardEL += toFiniteNumber(row?.carryForwardEL, 0);
    totals.clUsed += toFiniteNumber(row?.clUsed, 0);
    totals.elUsed += toFiniteNumber(row?.elUsed, 0);
    totals.lopUsed += toFiniteNumber(row?.lopUsed, 0);
    totals.manualAdjustmentCL += toFiniteNumber(row?.manualAdjustmentCL, 0);
    totals.manualAdjustmentEL += toFiniteNumber(row?.manualAdjustmentEL, 0);
    totals.manualAdjustmentLOP += toFiniteNumber(row?.manualAdjustmentLOP, 0);
    totals.pendingRequests += toFiniteNumber(row?.pendingRequests, 0);
    totals.approvedRequests += toFiniteNumber(row?.approvedRequests, 0);
    totals.rejectedRequests += toFiniteNumber(row?.rejectedRequests, 0);
    totals.modifiedRequests += toFiniteNumber(row?.modifiedRequests, 0);
    totals.totalRequests += toFiniteNumber(row?.totalRequests, 0);
  }

  for (const key of Object.keys(totals)) {
    totals[key] = roundTwo(totals[key]);
  }

  return totals;
};

export const getYearlyLeaveOverview = async ({
  employeeId,
  year,
  recompute = true,
}) => {
  const parsedYear = Number(year);
  if (!Number.isInteger(parsedYear) || parsedYear <= 0) {
    throw new Error("Invalid year for leave overview");
  }

  const [leaveBalance, monthlySummary] = await Promise.all([
    ensureLeaveBalance(employeeId, parsedYear),
    getStoredMonthlyLeaveSummary({
      employeeId,
      year: parsedYear,
      recompute,
    }),
  ]);

  const totals = buildLeaveSummaryTotals(monthlySummary);

  const totalCredited = roundTwo(
    totals.clCredited +
      totals.elCredited +
      totals.compOffCL +
      totals.compOffEL +
      totals.carryForwardCL +
      totals.carryForwardEL +
      Math.max(0, totals.manualAdjustmentCL) +
      Math.max(0, totals.manualAdjustmentEL)
  );
  const totalUsed = roundTwo(totals.clUsed + totals.elUsed + totals.lopUsed);
  const totalRemaining = roundTwo(
    toFiniteNumber(leaveBalance?.clBalance, 0) +
      toFiniteNumber(leaveBalance?.elBalance, 0)
  );

  return {
    year: parsedYear,
    leaveBalance,
    monthlySummary,
    totals: {
      ...totals,
      totalCredited,
      totalUsed,
      totalRemaining,
      yearlyClNetUsed: roundTwo(totals.clUsed - totals.manualAdjustmentCL),
      yearlyElNetUsed: roundTwo(totals.elUsed - totals.manualAdjustmentEL),
    },
  };
};

const createLedgerEntry = async ({
  employeeId,
  leaveYear,
  entryType,
  leaveType = "MIXED",
  amount = 0,
  requestId = null,
  transactionKey = null,
  metadata = {},
  effectiveDate = new Date(),
}) => {
  if (transactionKey) {
    const existingEntry = await LeaveLedger.findOne({ transactionKey });
    if (existingEntry) {
      return existingEntry;
    }
  }

  return LeaveLedger.create({
    employeeId,
    leaveYear,
    entryType,
    leaveType,
    amount,
    requestId,
    transactionKey,
    metadata,
    effectiveDate,
  });
};

const parsePositiveNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const manualAdjustLeaveBalance = async ({
  employeeId,
  year = getLeaveYear(),
  mode = "delta",
  clValue = 0,
  elValue = 0,
  lopValue = 0,
  reason = "",
  updatedBy = null,
  runDate = new Date(),
} = {}) => {
  if (!employeeId) {
    throw new Error("employeeId is required for manual leave adjustment");
  }

  const parsedYear = Number(year);
  if (!Number.isInteger(parsedYear) || parsedYear <= 0) {
    throw new Error("year must be a valid number");
  }

  const normalizedMode = String(mode || "delta").toLowerCase();
  if (!["delta", "set"].includes(normalizedMode)) {
    throw new Error("mode must be either delta or set");
  }

  const leaveBalance = await ensureLeaveBalance(employeeId, parsedYear);
  const currentCL = toFiniteNumber(leaveBalance.clBalance, 0);
  const currentEL = toFiniteNumber(leaveBalance.elBalance, 0);
  const currentLOP = toFiniteNumber(leaveBalance.lopUsed, 0);

  let nextCL = currentCL;
  let nextEL = currentEL;
  let nextLOP = currentLOP;

  if (normalizedMode === "set") {
    nextCL = Math.max(0, toFiniteNumber(clValue, currentCL));
    nextEL = Math.max(0, toFiniteNumber(elValue, currentEL));
    nextLOP = Math.max(0, toFiniteNumber(lopValue, currentLOP));
  } else {
    nextCL = Math.max(0, currentCL + toFiniteNumber(clValue, 0));
    nextEL = Math.max(0, currentEL + toFiniteNumber(elValue, 0));
    nextLOP = Math.max(0, currentLOP + toFiniteNumber(lopValue, 0));
  }

  const actualDelta = {
    cl: roundTwo(nextCL - currentCL),
    el: roundTwo(nextEL - currentEL),
    lop: roundTwo(nextLOP - currentLOP),
  };

  const hasChange =
    Math.abs(actualDelta.cl) > 0 ||
    Math.abs(actualDelta.el) > 0 ||
    Math.abs(actualDelta.lop) > 0;

  if (!hasChange) {
    return {
      leaveBalance,
      delta: actualDelta,
      year: parsedYear,
      month: null,
      ledgerEntry: null,
    };
  }

  leaveBalance.clBalance = nextCL;
  leaveBalance.elBalance = nextEL;
  leaveBalance.lopUsed = nextLOP;
  await leaveBalance.save();

  const effectiveDate = buildEffectiveDateForLeaveYear(parsedYear, runDate);

  const ledgerEntry = await createLedgerEntry({
    employeeId,
    leaveYear: parsedYear,
    entryType: "manual_adjust",
    leaveType: "MIXED",
    amount:
      Math.abs(actualDelta.cl) +
      Math.abs(actualDelta.el) +
      Math.abs(actualDelta.lop),
    metadata: {
      mode: normalizedMode,
      reason: String(reason || "").trim(),
      updatedBy,
      requestedValues: {
        cl: toFiniteNumber(clValue, 0),
        el: toFiniteNumber(elValue, 0),
        lop: toFiniteNumber(lopValue, 0),
      },
      actualDelta,
      previousBalance: {
        cl: currentCL,
        el: currentEL,
        lop: currentLOP,
      },
      nextBalance: {
        cl: nextCL,
        el: nextEL,
        lop: nextLOP,
      },
    },
    effectiveDate,
  });

  await recomputeMonthlyLeaveSummary({
    employeeId,
    year: parsedYear,
    month: effectiveDate.getMonth() + 1,
  });

  return {
    leaveBalance,
    delta: actualDelta,
    year: parsedYear,
    month: effectiveDate.getMonth() + 1,
    ledgerEntry,
  };
};

export const calculateLeaveUnits = ({ durationType, startDate, endDate }) => {
  if (durationType === "half_day") {
    return 0.5;
  }

  if (durationType === "full_day") {
    return 1;
  }

  const dayDifference =
    Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return dayDifference > 0 ? dayDifference : 0;
};

export const applyLeaveImpact = async ({
  employeeId,
  leaveType,
  durationType,
  startDateValue,
  endDateValue,
  requestId = null,
}) => {
  const startDate = normalizeDateOnly(startDateValue);
  const endDate = normalizeDateOnly(endDateValue);

  if (!startDate || !endDate) {
    throw new Error("Invalid leave dates");
  }
  if (endDate < startDate) {
    throw new Error("End date cannot be before start date");
  }
  if (startDate.getFullYear() !== endDate.getFullYear()) {
    throw new Error("Cross-year leave ranges are not supported");
  }
  if (
    durationType === "half_day" &&
    startDate.getTime() !== endDate.getTime()
  ) {
    throw new Error("Half-day leave must have same start and end date");
  }

  const leaveYear = startDate.getFullYear();
  const leaveBalance = await ensureLeaveBalance(employeeId, leaveYear);
  const requiredUnits = calculateLeaveUnits({ durationType, startDate, endDate });

  if (requiredUnits <= 0) {
    throw new Error("Invalid leave duration");
  }

  const deduction = { cl: 0, el: 0, lop: 0 };
  let remainingUnits = requiredUnits;

  if (leaveType === "CL") {
    const availableCL = Math.max(0, Number(leaveBalance.clBalance) || 0);
    deduction.cl = Math.min(availableCL, remainingUnits);
    remainingUnits -= deduction.cl;
    leaveBalance.clBalance = availableCL - deduction.cl;
  } else if (leaveType === "EL") {
    const availableEL = Math.max(0, Number(leaveBalance.elBalance) || 0);
    deduction.el = Math.min(availableEL, remainingUnits);
    remainingUnits -= deduction.el;
    leaveBalance.elBalance = availableEL - deduction.el;
  } else {
    throw new Error("Invalid leave type");
  }

  deduction.lop = Math.max(0, remainingUnits);
  leaveBalance.lopUsed = (Number(leaveBalance.lopUsed) || 0) + deduction.lop;
  await leaveBalance.save();

  const attendanceDates = enumerateDates(startDate, endDate);
  const appliedStatus = durationType === "half_day" ? "Half Day" : "Absent";
  const touchedMonthKeys = new Set();

  const attendanceSnapshot = [];
  for (const attendanceDate of attendanceDates) {
    const touchedKey = `${attendanceDate.getFullYear()}-${attendanceDate.getMonth() + 1}`;
    touchedMonthKeys.add(touchedKey);

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: attendanceDate,
    });

    attendanceSnapshot.push({
      date: attendanceDate,
      hadRecord: Boolean(existingAttendance),
      previousStatus: existingAttendance?.status || "Present",
      appliedStatus,
    });

    await Attendance.findOneAndUpdate(
      { employeeId, date: attendanceDate },
      {
        employeeId,
        date: attendanceDate,
        status: appliedStatus,
        leaveRequestId: requestId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  for (const touchedKey of touchedMonthKeys) {
    const [yearText, monthText] = touchedKey.split("-");
    const touchedYear = Number(yearText);
    const touchedMonth = Number(monthText);
    await recomputeMonthlyAttendanceSummary({
      employeeId,
      year: touchedYear,
      month: touchedMonth,
    });
    await recomputeMonthlyLeaveSummary({
      employeeId,
      year: touchedYear,
      month: touchedMonth,
    });
  }

  return {
    leaveYear,
    totalUnits: requiredUnits,
    appliedDeduction: deduction,
    attendanceSnapshot,
  };
};

export const restoreLeaveImpact = async ({
  employeeId,
  leaveYear,
  appliedDeduction,
  attendanceSnapshot,
}) => {
  const leaveBalance = await ensureLeaveBalance(employeeId, leaveYear);

  const clToRestore = parsePositiveNumber(appliedDeduction?.cl);
  const elToRestore = parsePositiveNumber(appliedDeduction?.el);
  const lopToRestore = parsePositiveNumber(appliedDeduction?.lop);

  leaveBalance.clBalance = (Number(leaveBalance.clBalance) || 0) + clToRestore;
  leaveBalance.elBalance = (Number(leaveBalance.elBalance) || 0) + elToRestore;
  leaveBalance.lopUsed = Math.max(
    0,
    (Number(leaveBalance.lopUsed) || 0) - lopToRestore
  );
  await leaveBalance.save();

  const touchedMonthKeys = new Set();
  for (const snapshot of attendanceSnapshot || []) {
    const attendanceDate = normalizeDateOnly(snapshot.date);
    if (!attendanceDate) {
      continue;
    }

    const touchedKey = `${attendanceDate.getFullYear()}-${attendanceDate.getMonth() + 1}`;
    touchedMonthKeys.add(touchedKey);

    if (!snapshot.hadRecord && snapshot.previousStatus === "Present") {
      await Attendance.deleteOne({ employeeId, date: attendanceDate });
      continue;
    }

    await Attendance.findOneAndUpdate(
      { employeeId, date: attendanceDate },
      {
        employeeId,
        date: attendanceDate,
        status: snapshot.previousStatus || "Present",
        leaveRequestId: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  for (const touchedKey of touchedMonthKeys) {
    const [yearText, monthText] = touchedKey.split("-");
    const touchedYear = Number(yearText);
    const touchedMonth = Number(monthText);
    await recomputeMonthlyAttendanceSummary({
      employeeId,
      year: touchedYear,
      month: touchedMonth,
    });
    await recomputeMonthlyLeaveSummary({
      employeeId,
      year: touchedYear,
      month: touchedMonth,
    });
  }
};

export const runMonthlyLeaveCredit = async ({ runDate = new Date() } = {}) => {
  const date = normalizeDateOnly(runDate) || new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const employees = await Employees.find({ activeStatus: true }).select(
    "_id probation"
  );

  const summary = {
    year,
    month,
    totalEmployees: employees.length,
    clCredited: 0,
    elCredited: 0,
    skipped: 0,
  };

  for (const employee of employees) {
    const leaveBalance = await ensureLeaveBalance(employee._id, year);

    const clTransactionKey = buildMonthlyTransactionKey({
      employeeId: employee._id,
      year,
      month,
      type: "cl-accrual",
    });

    const existingCLCredit = await LeaveLedger.findOne({
      transactionKey: clTransactionKey,
    });
    if (!existingCLCredit) {
      leaveBalance.clBalance =
        (Number(leaveBalance.clBalance) || 0) + CL_MONTHLY_CREDIT;
      leaveBalance.lastMonthlyCreditMonth = month;
      await leaveBalance.save();

      await createLedgerEntry({
        employeeId: employee._id,
        leaveYear: year,
        entryType: "accrual_cl",
        leaveType: "CL",
        amount: CL_MONTHLY_CREDIT,
        transactionKey: clTransactionKey,
        metadata: {
          source: "monthly-cron",
          month,
          probation: Boolean(employee.probation),
        },
        effectiveDate: date,
      });

      summary.clCredited += 1;
    } else {
      summary.skipped += 1;
    }

    const shouldCreditEL =
      month % EL_CREDIT_INTERVAL_MONTHS === 0 && !Boolean(employee.probation);

    if (!shouldCreditEL) {
      continue;
    }

    const elTransactionKey = buildMonthlyTransactionKey({
      employeeId: employee._id,
      year,
      month,
      type: "el-accrual",
    });

    const existingELCredit = await LeaveLedger.findOne({
      transactionKey: elTransactionKey,
    });
    if (existingELCredit) {
      continue;
    }

    leaveBalance.elBalance =
      (Number(leaveBalance.elBalance) || 0) + EL_BIMONTHLY_CREDIT;
    leaveBalance.lastELCreditMonth = month;
    await leaveBalance.save();

    await createLedgerEntry({
      employeeId: employee._id,
      leaveYear: year,
      entryType: "accrual_el",
      leaveType: "EL",
      amount: EL_BIMONTHLY_CREDIT,
      transactionKey: elTransactionKey,
      metadata: {
        source: "monthly-cron",
        month,
        probation: Boolean(employee.probation),
      },
      effectiveDate: date,
    });

    summary.elCredited += 1;
  }

  for (const employee of employees) {
    await recomputeMonthlyLeaveSummary({
      employeeId: employee._id,
      year,
      month,
    });
  }

  return summary;
};

export const runCarryForwardForEmployee = async ({
  employeeId,
  nextYear = getLeaveYear(),
  runDate = new Date(),
} = {}) => {
  if (!employeeId) {
    throw new Error("employeeId is required for carry forward");
  }

  const normalizedNextYear = Number(nextYear);
  if (!Number.isInteger(normalizedNextYear) || normalizedNextYear <= 0) {
    throw new Error("nextYear must be a valid year");
  }

  const date = normalizeDateOnly(runDate) || new Date();
  const effectiveDate = buildEffectiveDateForLeaveYear(normalizedNextYear, date);
  const previousYear = normalizedNextYear - 1;
  const transactionKey = buildCarryForwardKey({
    employeeId,
    previousYear,
    nextYear: normalizedNextYear,
  });

  const existingCarryEntry = await LeaveLedger.findOne({ transactionKey });
  if (existingCarryEntry) {
    const leaveBalance = await ensureLeaveBalance(employeeId, normalizedNextYear);
    return {
      carried: false,
      reason: "already_carried",
      previousYear,
      nextYear: normalizedNextYear,
      leaveBalance,
      carryEntry: existingCarryEntry,
    };
  }

  const previousBalance = await LeaveBalance.findOne({
    employeeId,
    year: previousYear,
  });

  if (!previousBalance) {
    const leaveBalance = await ensureLeaveBalance(employeeId, normalizedNextYear);
    return {
      carried: false,
      reason: "no_previous_year_balance",
      previousYear,
      nextYear: normalizedNextYear,
      leaveBalance,
    };
  }

  const nextYearBalance = await ensureLeaveBalance(employeeId, normalizedNextYear);

  const rawCLCarry = Number(previousBalance.clBalance) || 0;
  const rawELCarry = Number(previousBalance.elBalance) || 0;

  const clToCarry = hasCarryCap(CL_CARRY_FORWARD_CAP)
    ? Math.min(rawCLCarry, CL_CARRY_FORWARD_CAP)
    : rawCLCarry;
  const elToCarry = hasCarryCap(EL_CARRY_FORWARD_CAP)
    ? Math.min(rawELCarry, EL_CARRY_FORWARD_CAP)
    : rawELCarry;

  if (clToCarry <= 0 && elToCarry <= 0) {
    return {
      carried: false,
      reason: "no_balance_to_carry",
      previousYear,
      nextYear: normalizedNextYear,
      leaveBalance: nextYearBalance,
    };
  }

  nextYearBalance.clBalance = (Number(nextYearBalance.clBalance) || 0) + clToCarry;
  nextYearBalance.elBalance = (Number(nextYearBalance.elBalance) || 0) + elToCarry;
  await nextYearBalance.save();

  const carryEntry = await createLedgerEntry({
    employeeId,
    leaveYear: normalizedNextYear,
    entryType: "carry_forward",
    leaveType: "MIXED",
    amount: clToCarry + elToCarry,
    transactionKey,
    metadata: {
      previousYear,
      nextYear: normalizedNextYear,
      clToCarry,
      elToCarry,
    },
    effectiveDate,
  });

  await recomputeMonthlyLeaveSummary({
    employeeId,
    year: normalizedNextYear,
    month: effectiveDate.getMonth() + 1,
  });

  return {
    carried: true,
    reason: "carried",
    previousYear,
    nextYear: normalizedNextYear,
    clToCarry,
    elToCarry,
    leaveBalance: nextYearBalance,
    carryEntry,
  };
};

export const runYearEndCarryForward = async ({ runDate = new Date() } = {}) => {
  const date = normalizeDateOnly(runDate) || new Date();
  const nextYear = date.getFullYear();
  const previousYear = nextYear - 1;
  const employees = await Employees.find({ activeStatus: true }).select("_id");

  const summary = {
    previousYear,
    nextYear,
    totalEmployees: employees.length,
    carried: 0,
  };

  for (const employee of employees) {
    const result = await runCarryForwardForEmployee({
      employeeId: employee._id,
      nextYear,
      runDate: date,
    });
    if (result.carried) {
      summary.carried += 1;
    }
  }

  return summary;
};

export const addCompensationLeave = async ({
  employeeId,
  leaveType,
  amount,
  year = getLeaveYear(),
  reason = "",
  createdBy = null,
}) => {
  const creditAmount = parsePositiveNumber(amount);
  if (!creditAmount) {
    throw new Error("Compensation leave amount must be greater than 0");
  }
  if (!["CL", "EL"].includes(leaveType)) {
    throw new Error("Compensation leave type must be CL or EL");
  }

  const leaveBalance = await ensureLeaveBalance(employeeId, year);
  if (leaveType === "CL") {
    leaveBalance.clBalance = (Number(leaveBalance.clBalance) || 0) + creditAmount;
  } else {
    leaveBalance.elBalance = (Number(leaveBalance.elBalance) || 0) + creditAmount;
  }
  await leaveBalance.save();

  const effectiveDate = buildEffectiveDateForLeaveYear(year, new Date());

  await createLedgerEntry({
    employeeId,
    leaveYear: year,
    entryType: "comp_off",
    leaveType,
    amount: creditAmount,
    metadata: {
      reason,
      createdBy,
    },
    effectiveDate,
  });

  await recomputeMonthlyLeaveSummary({
    employeeId,
    year,
    month: effectiveDate.getMonth() + 1,
  });

  return leaveBalance;
};
