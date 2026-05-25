import Employees from "../Models/Employees.js";
import Attendance from "../Models/Attendance.js";
import LeaveBalance from "../Models/LeaveBalance.js";
import LeaveLedger from "../Models/LeaveLedger.js";
import LeaveRequest from "../Models/LeaveRequest.js";
import MonthlyAttendanceSummary from "../Models/MonthlyAttendanceSummary.js";
import MonthlyLeaveSummary from "../Models/MonthlyLeaveSummary.js";
import { randomUUID } from "crypto";
import mongoose from "mongoose";

export const CL_MONTHLY_CREDIT = Number(process.env.CL_MONTHLY_CREDIT || 1);
export const EL_BIMONTHLY_CREDIT = Number(process.env.EL_BIMONTHLY_CREDIT || 1);
export const EL_CREDIT_INTERVAL_MONTHS = Number(
  process.env.EL_CREDIT_INTERVAL_MONTHS || 2
);

const CL_CARRY_FORWARD_CAP = Number(process.env.CL_CARRY_FORWARD_CAP || 0);
const EL_CARRY_FORWARD_CAP = Number(process.env.EL_CARRY_FORWARD_CAP || 0);

const hasCarryCap = (value) => Number.isFinite(value) && value > 0;

const isTransactionUnsupportedError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("transaction numbers are only allowed on a replica set") ||
    message.includes("replica set") ||
    message.includes("transactions are not supported")
  );
};

const withSession = (query, session) => (session ? query.session(session) : query);

const createModelRecord = async (Model, payload, session = null) => {
  if (!session) {
    return Model.create(payload);
  }

  const [record] = await Model.create([payload], { session });
  return record;
};

export const executeWithOptionalTransaction = async (operation) => {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await operation(session);
    });
    return result;
  } catch (error) {
    if (isTransactionUnsupportedError(error)) {
      return operation(null);
    }
    throw error;
  } finally {
    await session.endSession();
  }
};

export const normalizeDateOnly = (dateValue) => {
  let parsedDate = null;

  if (typeof dateValue === "string") {
    const normalizedText = dateValue.trim();
    const match = normalizedText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      parsedDate = new Date(year, month - 1, day);
    } else {
      parsedDate = new Date(dateValue);
    }
  } else {
    parsedDate = new Date(dateValue);
  }

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }
  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

export const formatDateKey = (dateValue) => {
  const normalizedDate = normalizeDateOnly(dateValue);
  if (!normalizedDate) {
    return null;
  }

  const year = normalizedDate.getFullYear();
  const month = String(normalizedDate.getMonth() + 1).padStart(2, "0");
  const day = String(normalizedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

export const ensureLeaveBalance = async (employeeId, year, session = null) => {
  let leaveBalance = await withSession(
    LeaveBalance.findOne({ employeeId, year }),
    session
  );
  if (!leaveBalance) {
    try {
      leaveBalance = await createModelRecord(
        LeaveBalance,
        {
          employeeId,
          year,
          clBalance: 0,
          elBalance: 0,
          carryForwardCL: 0,
          carryForwardEL: 0,
          lopUsed: 0,
        },
        session
      );
    } catch (error) {
      if (Number(error?.code) !== 11000) {
        throw error;
      }
      leaveBalance = await withSession(
        LeaveBalance.findOne({ employeeId, year }),
        session
      );
    }
  }

  if (
    leaveBalance &&
    (leaveBalance.carryForwardCL === undefined ||
      leaveBalance.carryForwardEL === undefined)
  ) {
    const carryEntries = await withSession(
      LeaveLedger.find({
        employeeId,
        leaveYear: year,
        entryType: "carry_forward",
      }).select("amount metadata"),
      session
    );

    let clCarryTotal = 0;
    let elCarryTotal = 0;
    for (const entry of carryEntries) {
      const clToCarry = toFiniteNumber(entry?.metadata?.clToCarry, 0);
      const elToCarry = toFiniteNumber(entry?.metadata?.elToCarry, 0);
      const amount = toFiniteNumber(entry?.amount, 0);
      if (clToCarry > 0 || elToCarry > 0) {
        clCarryTotal += clToCarry;
        elCarryTotal += elToCarry;
      } else {
        clCarryTotal += amount;
      }
    }

    const clBalance = toFiniteNumber(leaveBalance?.clBalance, 0);
    const elBalance = toFiniteNumber(leaveBalance?.elBalance, 0);
    leaveBalance.carryForwardCL = roundTwo(
      Math.min(clBalance, Math.max(0, clCarryTotal))
    );
    leaveBalance.carryForwardEL = roundTwo(
      Math.min(elBalance, Math.max(0, elCarryTotal))
    );
    await leaveBalance.save(session ? { session } : {});
  }

  clampCarryForwardBuckets(leaveBalance);
  return leaveBalance;
};

export const recomputeMonthlyAttendanceSummary = async ({
  employeeId,
  year,
  month,
  session = null,
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

  const attendanceRows = await withSession(
    Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    }).select("status"),
    session
  );

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
    { upsert: true, new: true, setDefaultsOnInsert: true, session }
  );

  return summary;
};

export const getStoredMonthlyAttendanceSummary = async ({
  employeeId,
  year,
  recompute = true,
  session = null,
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
        session,
      });
      computedMonths.push(summary);
    }
    return computedMonths;
  }

  const existingRows = await withSession(
    MonthlyAttendanceSummary.find({
      employeeId,
      year: parsedYear,
    }).sort({ month: 1 }),
    session
  );

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
  clCarry: toFiniteNumber(breakup?.clCarry, 0),
  elCarry: toFiniteNumber(breakup?.elCarry, 0),
});

const getCarryForwardBuckets = (leaveBalance) => {
  const clBalance = toFiniteNumber(leaveBalance?.clBalance, 0);
  const elBalance = toFiniteNumber(leaveBalance?.elBalance, 0);
  const carryForwardCL = Math.min(
    Math.max(0, toFiniteNumber(leaveBalance?.carryForwardCL, 0)),
    clBalance
  );
  const carryForwardEL = Math.min(
    Math.max(0, toFiniteNumber(leaveBalance?.carryForwardEL, 0)),
    elBalance
  );

  return {
    carryForwardCL: roundTwo(carryForwardCL),
    carryForwardEL: roundTwo(carryForwardEL),
  };
};

const clampCarryForwardBuckets = (leaveBalance) => {
  const { carryForwardCL, carryForwardEL } = getCarryForwardBuckets(leaveBalance);
  leaveBalance.carryForwardCL = carryForwardCL;
  leaveBalance.carryForwardEL = carryForwardEL;
};

const buildEffectiveDateForLeaveYear = (year, date = new Date()) => {
  const normalizedDate = normalizeDateOnly(date) || new Date();
  return new Date(year, normalizedDate.getMonth(), normalizedDate.getDate());
};

const parseCarryBreakupFromEntry = (entry) => {
  const clToCarry = toFiniteNumber(entry?.metadata?.clToCarry, 0);
  const elToCarry = toFiniteNumber(entry?.metadata?.elToCarry, 0);
  const amount = toFiniteNumber(entry?.amount, 0);

  if (clToCarry > 0 || elToCarry > 0) {
    return {
      cl: roundTwo(clToCarry),
      el: roundTwo(elToCarry),
    };
  }

  return {
    cl: roundTwo(amount),
    el: 0,
  };
};

const computeDesiredCarryFromBalance = (balance) => {
  const rawCLCarry = toFiniteNumber(balance?.clBalance, 0);
  const rawELCarry = toFiniteNumber(balance?.elBalance, 0);

  const clToCarry = hasCarryCap(CL_CARRY_FORWARD_CAP)
    ? Math.min(rawCLCarry, CL_CARRY_FORWARD_CAP)
    : rawCLCarry;
  const elToCarry = hasCarryCap(EL_CARRY_FORWARD_CAP)
    ? Math.min(rawELCarry, EL_CARRY_FORWARD_CAP)
    : rawELCarry;

  return {
    cl: roundTwo(Math.max(0, clToCarry)),
    el: roundTwo(Math.max(0, elToCarry)),
  };
};

const applyCarryDeltaToBalance = (leaveBalance, clDelta, elDelta) => {
  const currentCL = toFiniteNumber(leaveBalance?.clBalance, 0);
  const currentEL = toFiniteNumber(leaveBalance?.elBalance, 0);
  const currentLOP = toFiniteNumber(leaveBalance?.lopUsed, 0);
  const { carryForwardCL: currentCarryCL, carryForwardEL: currentCarryEL } =
    getCarryForwardBuckets(leaveBalance);

  let nextCL = roundTwo(currentCL + clDelta);
  let nextEL = roundTwo(currentEL + elDelta);
  let nextCarryCL = roundTwo(currentCarryCL + clDelta);
  let nextCarryEL = roundTwo(currentCarryEL + elDelta);
  let lopDeficit = 0;

  if (nextCL < 0) {
    lopDeficit += Math.abs(nextCL);
    nextCL = 0;
  }
  if (nextEL < 0) {
    lopDeficit += Math.abs(nextEL);
    nextEL = 0;
  }
  if (nextCarryCL < 0) {
    nextCarryCL = 0;
  }
  if (nextCarryEL < 0) {
    nextCarryEL = 0;
  }
  if (nextCarryCL > nextCL) {
    nextCarryCL = nextCL;
  }
  if (nextCarryEL > nextEL) {
    nextCarryEL = nextEL;
  }

  leaveBalance.clBalance = roundTwo(nextCL);
  leaveBalance.elBalance = roundTwo(nextEL);
  leaveBalance.carryForwardCL = roundTwo(nextCarryCL);
  leaveBalance.carryForwardEL = roundTwo(nextCarryEL);
  leaveBalance.lopUsed = roundTwo(currentLOP + lopDeficit);
};

const syncSingleCarryForwardYear = async ({
  employeeId,
  nextYear,
  runDate = new Date(),
  session = null,
}) => {
  const normalizedNextYear = Number(nextYear);
  if (!Number.isInteger(normalizedNextYear) || normalizedNextYear <= 0) {
    throw new Error("nextYear must be a valid year");
  }

  const previousYear = normalizedNextYear - 1;
  const effectiveDate = buildEffectiveDateForLeaveYear(normalizedNextYear, runDate);
  const transactionKey = buildCarryForwardKey({
    employeeId,
    previousYear,
    nextYear: normalizedNextYear,
  });

  const previousBalance = await withSession(
    LeaveBalance.findOne({ employeeId, year: previousYear }),
    session
  );
  const desiredCarry = previousBalance
    ? computeDesiredCarryFromBalance(previousBalance)
    : { cl: 0, el: 0 };

  const existingCarryEntry = await withSession(
    LeaveLedger.findOne({ transactionKey }),
    session
  );
  const existingCarry = parseCarryBreakupFromEntry(existingCarryEntry);

  const clDelta = roundTwo(desiredCarry.cl - existingCarry.cl);
  const elDelta = roundTwo(desiredCarry.el - existingCarry.el);
  const hasCarryDelta = Math.abs(clDelta) > 0 || Math.abs(elDelta) > 0;

  const nextYearBalance = await ensureLeaveBalance(employeeId, normalizedNextYear, session);

  if (hasCarryDelta) {
    applyCarryDeltaToBalance(nextYearBalance, clDelta, elDelta);
  }

  clampCarryForwardBuckets(nextYearBalance);
  nextYearBalance.lastCarryForwardFromYear = previousYear;
  await nextYearBalance.save(session ? { session } : {});

  const carryAmount = roundTwo(desiredCarry.cl + desiredCarry.el);
  if (existingCarryEntry) {
    existingCarryEntry.amount = carryAmount;
    existingCarryEntry.metadata = {
      ...(existingCarryEntry.metadata || {}),
      previousYear,
      nextYear: normalizedNextYear,
      clToCarry: desiredCarry.cl,
      elToCarry: desiredCarry.el,
      syncMode: "auto",
      syncedAt: new Date().toISOString(),
    };
    existingCarryEntry.effectiveDate = effectiveDate;
    await existingCarryEntry.save(session ? { session } : {});
  } else if (carryAmount > 0) {
    await createLedgerEntry({
      employeeId,
      leaveYear: normalizedNextYear,
      entryType: "carry_forward",
      leaveType: "MIXED",
      amount: carryAmount,
      transactionKey,
      metadata: {
        previousYear,
        nextYear: normalizedNextYear,
        clToCarry: desiredCarry.cl,
        elToCarry: desiredCarry.el,
        syncMode: "auto",
      },
      effectiveDate,
      session,
    });
  }

  await recomputeMonthlyLeaveSummary({
    employeeId,
    year: normalizedNextYear,
    month: effectiveDate.getMonth() + 1,
    session,
  });

  return {
    nextYear: normalizedNextYear,
    previousYear,
    desiredCarry,
    existingCarry,
    clDelta,
    elDelta,
    updated: hasCarryDelta,
  };
};

export const syncCarryForwardChainFromYear = async ({
  employeeId,
  changedYear,
  runDate = new Date(),
  session = null,
}) => {
  const parsedChangedYear = Number(changedYear);
  if (!Number.isInteger(parsedChangedYear) || parsedChangedYear <= 0) {
    return { synced: false, reason: "invalid_year", updates: [] };
  }

  const currentYear = getLeaveYear(runDate);
  if (parsedChangedYear >= currentYear) {
    return { synced: false, reason: "not_old_year", updates: [] };
  }

  const highestBalanceYearRow = await withSession(
    LeaveBalance.findOne({ employeeId }).sort({ year: -1 }).select("year"),
    session
  );
  const highestBalanceYear = Number(highestBalanceYearRow?.year || 0);
  const maxSyncYear = Math.max(currentYear, highestBalanceYear);

  const updates = [];
  for (let year = parsedChangedYear + 1; year <= maxSyncYear; year += 1) {
    const row = await syncSingleCarryForwardYear({
      employeeId,
      nextYear: year,
      runDate,
      session,
    });
    updates.push(row);
  }

  return {
    synced: true,
    reason: "done",
    updates,
  };
};

export const recomputeMonthlyLeaveSummary = async ({
  employeeId,
  year,
  month,
  session = null,
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
      session,
    }),
    (() => {
      const { startDate, endDate } = getMonthDateRange({
        year: parsedYear,
        month: parsedMonth,
      });
      return withSession(
        LeaveRequest.find({
          employeeId,
          leaveYear: parsedYear,
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        }).select("status startDate endDate durationType appliedDeduction impactApplied"),
        session
      );
    })(),
    (() => {
      const { startDate, endDate } = getMonthDateRange({
        year: parsedYear,
        month: parsedMonth,
      });
      return withSession(
        LeaveLedger.find({
          employeeId,
          leaveYear: parsedYear,
          effectiveDate: { $gte: startDate, $lte: endDate },
        }).select("entryType leaveType amount metadata"),
        session
      );
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

  let approvedRequests = 0;
  let rejectedRequests = 0;
  const approvedImpactRequests = [];

  for (const request of leaveRequests) {
    const status = String(request.status || "").toLowerCase();
    const requestStart = normalizeDateOnly(request.startDate);
    if (
      requestStart &&
      requestStart.getFullYear() === parsedYear &&
      requestStart.getMonth() + 1 === parsedMonth
    ) {
      if (status === "approved") approvedRequests += 1;
      if (status === "rejected") rejectedRequests += 1;
    }

    if (status === "approved" && request.impactApplied) {
      approvedImpactRequests.push(request);
    }
  }

  nextSummary.pendingRequests = 0;
  nextSummary.modifiedRequests = 0;
  nextSummary.approvedRequests = approvedRequests;
  nextSummary.rejectedRequests = rejectedRequests;
  nextSummary.totalRequests = approvedRequests + rejectedRequests;

  const monthStart = new Date(parsedYear, parsedMonth - 1, 1);
  const monthEnd = new Date(parsedYear, parsedMonth, 0);

  for (const request of approvedImpactRequests) {
    const requestStart = normalizeDateOnly(request.startDate);
    const requestEnd = normalizeDateOnly(request.endDate);
    const durationType = String(request.durationType || "").toLowerCase();

    if (!requestStart || !requestEnd || requestEnd < requestStart) {
      continue;
    }

    const overlapStart = requestStart > monthStart ? requestStart : monthStart;
    const overlapEnd = requestEnd < monthEnd ? requestEnd : monthEnd;
    if (overlapEnd < overlapStart) {
      continue;
    }

    const totalUnits = calculateLeaveUnits({
      durationType,
      startDate: requestStart,
      endDate: requestEnd,
    });
    if (totalUnits <= 0) {
      continue;
    }

    let overlapUnits = 0;
    if (durationType === "half_day") {
      overlapUnits =
        requestStart.getTime() >= monthStart.getTime() &&
        requestStart.getTime() <= monthEnd.getTime()
          ? 0.5
          : 0;
    } else {
      overlapUnits =
        Math.floor(
          (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
    }

    if (overlapUnits <= 0) {
      continue;
    }

    const ratio = overlapUnits / totalUnits;
    const applied = parseAppliedBreakup(request.appliedDeduction);
    nextSummary.clUsed += applied.cl * ratio;
    nextSummary.elUsed += applied.el * ratio;
    nextSummary.lopUsed += applied.lop * ratio;
  }

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
    { upsert: true, new: true, setDefaultsOnInsert: true, session }
  );

  return savedSummary;
};

export const getStoredMonthlyLeaveSummary = async ({
  employeeId,
  year,
  recompute = true,
  session = null,
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
        session,
      });
      computedMonths.push(summary);
    }
    return computedMonths;
  }

  const existingRows = await withSession(
    MonthlyLeaveSummary.find({
      employeeId,
      year: parsedYear,
    }).sort({ month: 1 }),
    session
  );

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
  session = null,
}) => {
  const parsedYear = Number(year);
  if (!Number.isInteger(parsedYear) || parsedYear <= 0) {
    throw new Error("Invalid year for leave overview");
  }

  const [leaveBalance, monthlySummary] = await Promise.all([
    ensureLeaveBalance(employeeId, parsedYear, session),
    getStoredMonthlyLeaveSummary({
      employeeId,
      year: parsedYear,
      recompute,
      session,
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
  transactionKey = undefined,
  metadata = {},
  effectiveDate = new Date(),
  session = null,
}) => {
  const normalizedTransactionKey =
    typeof transactionKey === "string" ? transactionKey.trim() : "";
  const fallbackTransactionKey = `ledger-${entryType}-${employeeId}-${leaveYear}-${Date.now()}-${randomUUID()}`;
  const finalTransactionKey = normalizedTransactionKey || fallbackTransactionKey;

  if (normalizedTransactionKey) {
    const existingEntry = await withSession(
      LeaveLedger.findOne({
        transactionKey: normalizedTransactionKey,
      }),
      session
    );
    if (existingEntry) {
      return existingEntry;
    }
  }

  const payload = {
    employeeId,
    leaveYear,
    entryType,
    leaveType,
    amount,
    requestId,
    metadata,
    effectiveDate,
    transactionKey: finalTransactionKey,
  };

  return createModelRecord(LeaveLedger, payload, session);
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
  carryForwardCLDelta = 0,
  carryForwardELDelta = 0,
  reason = "",
  updatedBy = null,
  runDate = new Date(),
  session = null,
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

  const leaveBalance = await ensureLeaveBalance(employeeId, parsedYear, session);
  const currentCL = toFiniteNumber(leaveBalance.clBalance, 0);
  const currentEL = toFiniteNumber(leaveBalance.elBalance, 0);
  const currentLOP = toFiniteNumber(leaveBalance.lopUsed, 0);
  const { carryForwardCL: currentCarryCL, carryForwardEL: currentCarryEL } =
    getCarryForwardBuckets(leaveBalance);
  const requestedCarryForwardCLDelta = toFiniteNumber(carryForwardCLDelta, 0);
  const requestedCarryForwardELDelta = toFiniteNumber(carryForwardELDelta, 0);

  let nextCL = currentCL;
  let nextEL = currentEL;
  let nextLOP = currentLOP;
  let nextCarryCL = currentCarryCL;
  let nextCarryEL = currentCarryEL;

  if (normalizedMode === "set") {
    nextCL = Math.max(0, toFiniteNumber(clValue, currentCL));
    nextEL = Math.max(0, toFiniteNumber(elValue, currentEL));
    nextLOP = Math.max(0, toFiniteNumber(lopValue, currentLOP));
  } else {
    nextCL = Math.max(0, currentCL + toFiniteNumber(clValue, 0));
    nextEL = Math.max(0, currentEL + toFiniteNumber(elValue, 0));
    nextLOP = Math.max(0, currentLOP + toFiniteNumber(lopValue, 0));
    nextCarryCL = currentCarryCL + requestedCarryForwardCLDelta;
    nextCarryEL = currentCarryEL + requestedCarryForwardELDelta;
  }

  nextCarryCL = Math.min(nextCL, Math.max(0, nextCarryCL));
  nextCarryEL = Math.min(nextEL, Math.max(0, nextCarryEL));

  const actualDelta = {
    cl: roundTwo(nextCL - currentCL),
    el: roundTwo(nextEL - currentEL),
    lop: roundTwo(nextLOP - currentLOP),
    carryForwardCL: roundTwo(nextCarryCL - currentCarryCL),
    carryForwardEL: roundTwo(nextCarryEL - currentCarryEL),
  };

  const hasChange =
    Math.abs(actualDelta.cl) > 0 ||
    Math.abs(actualDelta.el) > 0 ||
    Math.abs(actualDelta.lop) > 0 ||
    Math.abs(actualDelta.carryForwardCL) > 0 ||
    Math.abs(actualDelta.carryForwardEL) > 0;

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
  leaveBalance.carryForwardCL = nextCarryCL;
  leaveBalance.carryForwardEL = nextCarryEL;
  leaveBalance.lopUsed = nextLOP;
  clampCarryForwardBuckets(leaveBalance);
  await leaveBalance.save({ session });

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
        carryForwardCLDelta: requestedCarryForwardCLDelta,
        carryForwardELDelta: requestedCarryForwardELDelta,
      },
      actualDelta,
      previousBalance: {
        cl: currentCL,
        el: currentEL,
        lop: currentLOP,
        carryForwardCL: currentCarryCL,
        carryForwardEL: currentCarryEL,
      },
      nextBalance: {
        cl: nextCL,
        el: nextEL,
        lop: nextLOP,
        carryForwardCL: nextCarryCL,
        carryForwardEL: nextCarryEL,
      },
    },
    effectiveDate,
    session,
  });

  await recomputeMonthlyLeaveSummary({
    employeeId,
    year: parsedYear,
    month: effectiveDate.getMonth() + 1,
    session,
  });

  const carrySyncResult = await syncCarryForwardChainFromYear({
    employeeId,
    changedYear: parsedYear,
    runDate,
    session,
  });

  return {
    leaveBalance,
    delta: actualDelta,
    year: parsedYear,
    month: effectiveDate.getMonth() + 1,
    ledgerEntry,
    carrySyncResult,
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
  session = null,
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
  const leaveBalance = await ensureLeaveBalance(employeeId, leaveYear, session);
  const requiredUnits = calculateLeaveUnits({ durationType, startDate, endDate });

  if (requiredUnits <= 0) {
    throw new Error("Invalid leave duration");
  }

  const deduction = { cl: 0, el: 0, lop: 0, clCarry: 0, elCarry: 0 };
  let remainingUnits = requiredUnits;

  if (leaveType === "CL") {
    const availableCL = Math.max(0, Number(leaveBalance.clBalance) || 0);
    deduction.cl = Math.min(availableCL, remainingUnits);
    const availableCarryCL = Math.min(
      Math.max(0, Number(leaveBalance.carryForwardCL) || 0),
      availableCL
    );
    deduction.clCarry = Math.min(availableCarryCL, deduction.cl);
    remainingUnits -= deduction.cl;
    leaveBalance.carryForwardCL = roundTwo(Math.max(0, availableCarryCL - deduction.clCarry));
    leaveBalance.clBalance = availableCL - deduction.cl;
  } else if (leaveType === "EL") {
    const availableEL = Math.max(0, Number(leaveBalance.elBalance) || 0);
    deduction.el = Math.min(availableEL, remainingUnits);
    const availableCarryEL = Math.min(
      Math.max(0, Number(leaveBalance.carryForwardEL) || 0),
      availableEL
    );
    deduction.elCarry = Math.min(availableCarryEL, deduction.el);
    remainingUnits -= deduction.el;
    leaveBalance.carryForwardEL = roundTwo(Math.max(0, availableCarryEL - deduction.elCarry));
    leaveBalance.elBalance = availableEL - deduction.el;
  } else {
    throw new Error("Invalid leave type");
  }

  deduction.lop = Math.max(0, remainingUnits);
  deduction.cl = roundTwo(deduction.cl);
  deduction.el = roundTwo(deduction.el);
  deduction.lop = roundTwo(deduction.lop);
  deduction.clCarry = roundTwo(deduction.clCarry);
  deduction.elCarry = roundTwo(deduction.elCarry);
  leaveBalance.lopUsed = (Number(leaveBalance.lopUsed) || 0) + deduction.lop;
  clampCarryForwardBuckets(leaveBalance);
  await leaveBalance.save({ session });

  const attendanceDates = enumerateDates(startDate, endDate);
  const appliedStatus = durationType === "half_day" ? "Half Day" : "Absent";
  const touchedMonthKeys = new Set();

  const attendanceSnapshot = [];
  for (const attendanceDate of attendanceDates) {
    const touchedKey = `${attendanceDate.getFullYear()}-${attendanceDate.getMonth() + 1}`;
    touchedMonthKeys.add(touchedKey);

    const existingAttendance = await withSession(
      Attendance.findOne({
        employeeId,
        date: attendanceDate,
      }),
      session
    );

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
      { upsert: true, new: true, setDefaultsOnInsert: true, session }
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
      session,
    });
    await recomputeMonthlyLeaveSummary({
      employeeId,
      year: touchedYear,
      month: touchedMonth,
      session,
    });
  }

  const carrySyncResult = await syncCarryForwardChainFromYear({
    employeeId,
    changedYear: leaveYear,
    runDate: new Date(),
    session,
  });

  return {
    leaveYear,
    totalUnits: requiredUnits,
    appliedDeduction: deduction,
    attendanceSnapshot,
    carrySyncResult,
  };
};

export const restoreLeaveImpact = async ({
  employeeId,
  leaveYear,
  appliedDeduction,
  attendanceSnapshot,
  restoreAttendanceToPresent = false,
  session = null,
}) => {
  const leaveBalance = await ensureLeaveBalance(employeeId, leaveYear, session);

  const clToRestore = parsePositiveNumber(appliedDeduction?.cl);
  const elToRestore = parsePositiveNumber(appliedDeduction?.el);
  const lopToRestore = parsePositiveNumber(appliedDeduction?.lop);
  const clCarryToRestore = parsePositiveNumber(appliedDeduction?.clCarry);
  const elCarryToRestore = parsePositiveNumber(appliedDeduction?.elCarry);
  const { carryForwardCL: currentCarryCL, carryForwardEL: currentCarryEL } =
    getCarryForwardBuckets(leaveBalance);

  leaveBalance.clBalance = (Number(leaveBalance.clBalance) || 0) + clToRestore;
  leaveBalance.elBalance = (Number(leaveBalance.elBalance) || 0) + elToRestore;
  const restoredCarryCL = Math.min(clToRestore, clCarryToRestore);
  const restoredCarryEL = Math.min(elToRestore, elCarryToRestore);
  leaveBalance.carryForwardCL = currentCarryCL + restoredCarryCL;
  leaveBalance.carryForwardEL = currentCarryEL + restoredCarryEL;
  leaveBalance.lopUsed = Math.max(
    0,
    (Number(leaveBalance.lopUsed) || 0) - lopToRestore
  );
  clampCarryForwardBuckets(leaveBalance);
  await leaveBalance.save({ session });

  const touchedMonthKeys = new Set();
  for (const snapshot of attendanceSnapshot || []) {
    const attendanceDate = normalizeDateOnly(snapshot.date);
    if (!attendanceDate) {
      continue;
    }

    const touchedKey = `${attendanceDate.getFullYear()}-${attendanceDate.getMonth() + 1}`;
    touchedMonthKeys.add(touchedKey);

    if (restoreAttendanceToPresent) {
      await Attendance.findOneAndUpdate(
        { employeeId, date: attendanceDate },
        {
          employeeId,
          date: attendanceDate,
          status: "Present",
          leaveRequestId: null,
          note: "",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, session }
      );
      continue;
    }

    if (!snapshot.hadRecord && snapshot.previousStatus === "Present") {
      await Attendance.deleteOne({ employeeId, date: attendanceDate }, { session });
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
      { upsert: true, new: true, setDefaultsOnInsert: true, session }
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
      session,
    });
    await recomputeMonthlyLeaveSummary({
      employeeId,
      year: touchedYear,
      month: touchedMonth,
      session,
    });
  }

  const carrySyncResult = await syncCarryForwardChainFromYear({
    employeeId,
    changedYear: leaveYear,
    runDate: new Date(),
    session,
  });

  return { carrySyncResult };
};

export const hasOverlappingApprovedLeave = async ({
  employeeId,
  startDateValue,
  endDateValue,
  excludeRequestId = null,
  session = null,
}) => {
  const startDate = normalizeDateOnly(startDateValue);
  const endDate = normalizeDateOnly(endDateValue);

  if (!startDate || !endDate) {
    throw new Error("Invalid leave dates for overlap validation");
  }

  const filter = {
    employeeId,
    status: "approved",
    impactApplied: true,
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };

  if (excludeRequestId) {
    filter._id = { $ne: excludeRequestId };
  }

  const overlap = await withSession(LeaveRequest.exists(filter), session);
  return Boolean(overlap);
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
    const creditResult = await executeWithOptionalTransaction(async (session) => {
      const leaveBalance = await ensureLeaveBalance(employee._id, year, session);
      let clCredited = 0;
      let elCredited = 0;
      let skipped = 0;

      const clUpdateResult = await LeaveBalance.updateOne(
        {
          _id: leaveBalance._id,
          lastMonthlyCreditMonth: { $ne: month },
        },
        {
          $inc: { clBalance: CL_MONTHLY_CREDIT },
          $set: { lastMonthlyCreditMonth: month },
        },
        session ? { session } : {}
      );

      if (Number(clUpdateResult?.modifiedCount || 0) > 0) {
        const clTransactionKey = buildMonthlyTransactionKey({
          employeeId: employee._id,
          year,
          month,
          type: "cl-accrual",
        });

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
          session,
        });
        clCredited += 1;
      } else {
        skipped += 1;
      }

      const shouldCreditEL =
        month % EL_CREDIT_INTERVAL_MONTHS === 0 && !Boolean(employee.probation);

      if (shouldCreditEL) {
        const elUpdateResult = await LeaveBalance.updateOne(
          {
            _id: leaveBalance._id,
            lastELCreditMonth: { $ne: month },
          },
          {
            $inc: { elBalance: EL_BIMONTHLY_CREDIT },
            $set: { lastELCreditMonth: month },
          },
          session ? { session } : {}
        );

        if (Number(elUpdateResult?.modifiedCount || 0) > 0) {
          const elTransactionKey = buildMonthlyTransactionKey({
            employeeId: employee._id,
            year,
            month,
            type: "el-accrual",
          });

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
            session,
          });
          elCredited += 1;
        }
      }

      return { clCredited, elCredited, skipped };
    });

    summary.clCredited += Number(creditResult?.clCredited || 0);
    summary.elCredited += Number(creditResult?.elCredited || 0);
    summary.skipped += Number(creditResult?.skipped || 0);
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

  return executeWithOptionalTransaction(async (session) => {
    const date = normalizeDateOnly(runDate) || new Date();
    const effectiveDate = buildEffectiveDateForLeaveYear(normalizedNextYear, date);
    const previousYear = normalizedNextYear - 1;
    const transactionKey = buildCarryForwardKey({
      employeeId,
      previousYear,
      nextYear: normalizedNextYear,
    });

    const existingCarryEntry = await withSession(
      LeaveLedger.findOne({ transactionKey }),
      session
    );
    if (existingCarryEntry) {
      const leaveBalance = await ensureLeaveBalance(employeeId, normalizedNextYear, session);
      return {
        carried: false,
        reason: "already_carried",
        previousYear,
        nextYear: normalizedNextYear,
        leaveBalance,
        carryEntry: existingCarryEntry,
      };
    }

    const previousBalance = await withSession(
      LeaveBalance.findOne({
        employeeId,
        year: previousYear,
      }),
      session
    );

    if (!previousBalance) {
      const leaveBalance = await ensureLeaveBalance(employeeId, normalizedNextYear, session);
      return {
        carried: false,
        reason: "no_previous_year_balance",
        previousYear,
        nextYear: normalizedNextYear,
        leaveBalance,
      };
    }

    const nextYearBalance = await ensureLeaveBalance(employeeId, normalizedNextYear, session);

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

    const carryUpdateResult = await LeaveBalance.updateOne(
      {
        _id: nextYearBalance._id,
        lastCarryForwardFromYear: { $ne: previousYear },
      },
      {
        $inc: {
          clBalance: clToCarry,
          elBalance: elToCarry,
          carryForwardCL: clToCarry,
          carryForwardEL: elToCarry,
        },
        $set: { lastCarryForwardFromYear: previousYear },
      },
      session ? { session } : {}
    );

    if (Number(carryUpdateResult?.modifiedCount || 0) === 0) {
      const refreshedBalance = await ensureLeaveBalance(employeeId, normalizedNextYear, session);
      const existingEntryAfterSkip = await withSession(
        LeaveLedger.findOne({ transactionKey }),
        session
      );
      return {
        carried: false,
        reason: "already_carried",
        previousYear,
        nextYear: normalizedNextYear,
        leaveBalance: refreshedBalance,
        carryEntry: existingEntryAfterSkip || null,
      };
    }

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
      session,
    });

    await recomputeMonthlyLeaveSummary({
      employeeId,
      year: normalizedNextYear,
      month: effectiveDate.getMonth() + 1,
      session,
    });

    const refreshedBalance = await ensureLeaveBalance(employeeId, normalizedNextYear, session);
    return {
      carried: true,
      reason: "carried",
      previousYear,
      nextYear: normalizedNextYear,
      clToCarry,
      elToCarry,
      leaveBalance: refreshedBalance,
      carryEntry,
    };
  });
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
  session = null,
}) => {
  const creditAmount = parsePositiveNumber(amount);
  if (!creditAmount) {
    throw new Error("Compensation leave amount must be greater than 0");
  }
  if (!["CL", "EL"].includes(leaveType)) {
    throw new Error("Compensation leave type must be CL or EL");
  }

  const leaveBalance = await ensureLeaveBalance(employeeId, year, session);
  if (leaveType === "CL") {
    leaveBalance.clBalance = (Number(leaveBalance.clBalance) || 0) + creditAmount;
  } else {
    leaveBalance.elBalance = (Number(leaveBalance.elBalance) || 0) + creditAmount;
  }
  await leaveBalance.save({ session });

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
    session,
  });

  await recomputeMonthlyLeaveSummary({
    employeeId,
    year,
    month: effectiveDate.getMonth() + 1,
    session,
  });

  await syncCarryForwardChainFromYear({
    employeeId,
    changedYear: year,
    runDate: new Date(),
    session,
  });

  return leaveBalance;
};
