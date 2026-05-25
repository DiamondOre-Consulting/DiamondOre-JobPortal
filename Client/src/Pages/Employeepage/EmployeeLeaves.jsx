import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarIcon } from "lucide-react";
import EmployeeNavbar from "./EmployeeNavbar";
import Footer from "../HomePage/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../Components/ui/popover";
import { Calendar } from "../../Components/ui/calendar";
import { toast } from "sonner";

const statusBadgeClasses = {
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const attendanceStyleByStatus = {
  Present: {
    bg: "#dcfce7",
    border: "#86efac",
    text: "#166534",
  },
  Absent: {
    bg: "#ffe4e6",
    border: "#fda4af",
    text: "#9f1239",
  },
  "Half Day": {
    bg: "#e0e7ff",
    border: "#a5b4fc",
    text: "#3730a3",
  },
};

const toLocalDateKey = (dateValue) => {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateValue) => {
  if (!dateValue) {
    return undefined;
  }

  const [year, month, day] = String(dateValue)
    .split("-")
    .map((value) => Number(value));

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
};

const formatDateLabel = (dateValue) => {
  const parsedDate = parseDateKey(dateValue);
  if (!parsedDate) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getAttendanceDateKey = (row) => {
  const explicitDateKey = String(row?.dateKey || "").trim();
  if (explicitDateKey) {
    return explicitDateKey;
  }
  return toLocalDateKey(row?.date);
};

const getRequestDateKey = (request, field) => {
  if (field === "start") {
    return String(request?.startDateKey || "").trim() || toLocalDateKey(request?.startDate);
  }
  return String(request?.endDateKey || "").trim() || toLocalDateKey(request?.endDate);
};

const EmployeeLeaves = ({ embedded = false }) => {
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const latestFetchIdRef = useRef(0);
  const latestStatsFetchIdRef = useRef(0);
  const [leaveBalanceState, setLeaveBalanceState] = useState({ year: null, data: null });
  const [overallBalanceState, setOverallBalanceState] = useState(null);
  const [availableBalanceYears, setAvailableBalanceYears] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [attendanceYear, setAttendanceYear] = useState(new Date().getFullYear());
  const [statsFilter, setStatsFilter] = useState("overall");
  const [statsYear, setStatsYear] = useState(new Date().getFullYear());
  const [statsYearBalanceState, setStatsYearBalanceState] = useState({ year: null, data: null });
  const [calendarViewMode, setCalendarViewMode] = useState("month");
  const [activeCalendarLabel, setActiveCalendarLabel] = useState(
    new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })
  );
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "CL",
    durationType: "full_day",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const token = useMemo(() => localStorage.getItem("token"), []);
  const todayDateKey = useMemo(() => toLocalDateKey(new Date()), []);
  const endDateMin =
    leaveForm.startDate && leaveForm.startDate > todayDateKey
      ? leaveForm.startDate
      : todayDateKey;
  const startDateObject = parseDateKey(leaveForm.startDate);
  const endDateObject = parseDateKey(leaveForm.endDate);
  const todayDateObject = parseDateKey(todayDateKey);
  const endDateMinObject = parseDateKey(endDateMin);

  const fetchStatsBalanceForYear = async (targetYear) => {
    if (!token) {
      return;
    }

    const parsedYear = Number(targetYear);
    if (!Number.isInteger(parsedYear) || parsedYear <= 0) {
      return;
    }

    const fetchId = latestStatsFetchIdRef.current + 1;
    latestStatsFetchIdRef.current = fetchId;

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/employee/leave/balance`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year: parsedYear },
      });

      if (fetchId !== latestStatsFetchIdRef.current) {
        return;
      }

      if (response.status === 200) {
        const responseYear = Number(response.data?.year);
        setStatsYearBalanceState({
          year:
            Number.isInteger(responseYear) && responseYear > 0 ? responseYear : parsedYear,
          data: response.data?.leaveBalance || null,
        });
        setOverallBalanceState(response.data?.overallBalance || null);
        setAvailableBalanceYears(
          Array.isArray(response.data?.availableYears) ? response.data.availableYears : []
        );
      }
    } catch (statsError) {
      if (fetchId !== latestStatsFetchIdRef.current) {
        return;
      }
      setError(statsError?.response?.data?.message || "Failed to fetch stats data");
    }
  };

  const fetchLeaveData = async () => {
    if (!token) {
      navigate("/employee-login");
      return;
    }

    const requestedYear = attendanceYear;
    const fetchId = latestFetchIdRef.current + 1;
    latestFetchIdRef.current = fetchId;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [balanceResponse, overviewResponse, requestsResponse, attendanceResponse] =
        await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/employee/leave/balance`, {
          headers,
          params: { year: requestedYear },
        }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/employee/leave/overview`, {
          headers,
          params: { year: requestedYear },
        }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/employee/leave/requests`, {
          headers,
        }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/employee/leave/attendance`, {
          headers,
          params: { year: requestedYear },
        }),
      ]);

      if (fetchId !== latestFetchIdRef.current) {
        return;
      }

      if (balanceResponse.status === 200) {
        const responseYear = Number(balanceResponse.data?.year);
        const responseOverallBalance = balanceResponse.data?.overallBalance || null;
        const responseAvailableYears = Array.isArray(balanceResponse.data?.availableYears)
          ? balanceResponse.data.availableYears
          : [];
        const currentYearBalance = balanceResponse.data?.leaveBalance || null;
        setLeaveBalanceState({
          year:
            Number.isInteger(responseYear) && responseYear > 0
              ? responseYear
              : requestedYear,
          data: currentYearBalance,
        });
        setOverallBalanceState(responseOverallBalance);
        setAvailableBalanceYears(responseAvailableYears);
        if (statsFilter !== "overall" && statsYear === requestedYear) {
          setStatsYearBalanceState({
            year: requestedYear,
            data: currentYearBalance,
          });
        }
      } else {
        setLeaveBalanceState({ year: requestedYear, data: null });
        setOverallBalanceState(null);
        setAvailableBalanceYears([]);
        if (statsFilter !== "overall" && statsYear === requestedYear) {
          setStatsYearBalanceState({ year: requestedYear, data: null });
        }
      }

      if (overviewResponse.status === 200) {
        setMonthlySummary(overviewResponse.data?.monthlySummary || []);
      } else {
        setMonthlySummary([]);
      }

      if (requestsResponse.status === 200) {
        setLeaveRequests(requestsResponse.data.leaveRequests || []);
      } else {
        setLeaveRequests([]);
      }
      if (attendanceResponse.status === 200) {
        setAttendanceRecords(attendanceResponse.data.attendance || []);
      } else {
        setAttendanceRecords([]);
      }
    } catch (fetchError) {
      if (fetchId !== latestFetchIdRef.current) {
        return;
      }
      setError(fetchError?.response?.data?.message || "Failed to fetch leave data");
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [attendanceYear]);

  useEffect(() => {
    if (!message) return;
    toast.success(message);
    setMessage("");
  }, [message]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    setError("");
  }, [error]);

  const monthlyCalendarSummary = useMemo(() => {
    const monthMap = new Map(
      monthlySummary.map((monthRow) => [Number(monthRow.month || 0), monthRow])
    );

    return Array.from({ length: 12 }, (_, index) => {
      const monthIndex = index + 1;
      const row = monthMap.get(monthIndex) || {};
      const clNetTaken = Number(
        (
          Number(row.clUsed || 0) - Number(row.manualAdjustmentCL || 0)
        ).toFixed(2)
      );
      const elNetTaken = Number(
        (
          Number(row.elUsed || 0) - Number(row.manualAdjustmentEL || 0)
        ).toFixed(2)
      );
      const lopNetTaken = Number(
        (
          Number(row.lopUsed || 0) - Number(row.manualAdjustmentLOP || 0)
        ).toFixed(2)
      );

      return {
        index,
        label: new Date(attendanceYear, index, 1).toLocaleString("en-IN", {
          month: "long",
        }),
        leaveUnits: Number(row.leaveUnits || 0),
        absentDays: Number(row.absentDays || 0),
        halfDays: Number(row.halfDays || 0),
        clTaken: clNetTaken,
        elTaken: elNetTaken,
        lopTaken: lopNetTaken,
      };
    });
  }, [monthlySummary, attendanceYear]);

  const selectedYearBalance =
    leaveBalanceState.year === attendanceYear ? leaveBalanceState.data : null;
  const clBalance = Number(selectedYearBalance?.clBalance || 0);
  const elBalance = Number(selectedYearBalance?.elBalance || 0);
  const lopUsed = Number(selectedYearBalance?.lopUsed || 0);
  const selectedStatsYearBalance =
    statsYearBalanceState.year === statsYear
      ? statsYearBalanceState.data
      : statsYear === attendanceYear
        ? selectedYearBalance
        : null;
  const statsYearWiseBalance = {
    clBalance: Number(selectedStatsYearBalance?.clBalance || 0),
    elBalance: Number(selectedStatsYearBalance?.elBalance || 0),
    lopUsed: Number(selectedStatsYearBalance?.lopUsed || 0),
  };
  const overallBalance = {
    clBalance: Number(overallBalanceState?.clBalance || 0),
    elBalance: Number(overallBalanceState?.elBalance || 0),
    lopUsed: Number(overallBalanceState?.lopUsed || 0),
  };
  const isOverallStats = statsFilter === "overall";
  const activeStatsBalance =
    isOverallStats && overallBalanceState ? overallBalance : statsYearWiseBalance;
  const activeRemaining = activeStatsBalance.clBalance + activeStatsBalance.elBalance;
  const currentYear = new Date().getFullYear();
  const statsYearOptions = useMemo(() => {
    const yearSet = new Set();
    availableBalanceYears.forEach((yearValue) => {
      const parsedYear = Number(yearValue);
      if (Number.isInteger(parsedYear) && parsedYear > 0) {
        yearSet.add(parsedYear);
      }
    });
    yearSet.add(attendanceYear);
    yearSet.add(statsYear);
    yearSet.add(currentYear);
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [availableBalanceYears, attendanceYear, statsYear, currentYear]);

  const handleStatsFilterChange = (value) => {
    if (value === "overall") {
      setStatsFilter("overall");
      return;
    }

    const parsedYear = Number(value);
    if (Number.isInteger(parsedYear) && parsedYear > 0) {
      setStatsFilter(String(parsedYear));
      setStatsYear(parsedYear);
      setStatsYearBalanceState((previous) => {
        if (parsedYear === attendanceYear) {
          return { year: parsedYear, data: selectedYearBalance };
        }
        if (previous.year === parsedYear) {
          return previous;
        }
        return { year: parsedYear, data: null };
      });
      fetchStatsBalanceForYear(parsedYear);
    }
  };

  const topCards = [
    {
      title: "Remaining Leaves",
      value: activeRemaining,
      note: isOverallStats ? "Overall Remaining (All Years)" : `Remaining (${statsYear})`,
      colors: "from-violet-500 to-indigo-500",
    },
    {
      title: "Casual Leaves",
      value: activeStatsBalance.clBalance,
      note: isOverallStats ? "CL Total (All Years)" : `CL Balance (${statsYear})`,
      colors: "from-cyan-500 to-sky-500",
    },
    {
      title: "Earned Leaves",
      value: activeStatsBalance.elBalance,
      note: isOverallStats ? "EL Total (All Years)" : `EL Balance (${statsYear})`,
      colors: "from-emerald-500 to-teal-500",
    },
    {
      title: "LOP",
      value: activeStatsBalance.lopUsed,
      note: isOverallStats ? "LOP Total (All Years)" : `LOP Used (${statsYear})`,
      colors: "from-rose-500 to-pink-500",
    },
  ];
  const recentRequests = leaveRequests.slice(0, 5);

  const attendanceEvents = useMemo(
    () => {
      const requestMap = new Map();
      leaveRequests.forEach((request) => {
        const requestId = String(request?._id || "");
        if (!requestId) {
          return;
        }
        requestMap.set(requestId, request);
      });

      return attendanceRecords
        .filter((row) => row.status === "Absent" || row.status === "Half Day")
        .map((row) => {
        const dateKey = getAttendanceDateKey(row);
        if (!dateKey) {
          return null;
        }
        const style = attendanceStyleByStatus[row.status] || {
          bg: "#f1f5f9",
          border: "#cbd5e1",
          text: "#334155",
        };
        const linkedRequest = requestMap.get(String(row.leaveRequestId || ""));
        const manualLeaveType = String(row?.leaveType || "").toUpperCase();
        const leaveType =
          linkedRequest &&
          String(linkedRequest?.status || "").toLowerCase() !== "rejected"
            ? String(linkedRequest?.leaveType || "").toUpperCase()
            : ["CL", "EL", "LOP"].includes(manualLeaveType)
              ? manualLeaveType
              : "";
        const leavePortion =
          row.status === "Half Day" ? "Half" : row.status === "Absent" ? "Full" : "";

        return {
          id: row._id,
          title: row.status || "Present",
          start: dateKey,
          allDay: true,
          backgroundColor: style.bg,
          borderColor: style.border,
          textColor: style.text,
          extendedProps: {
            note: String(row.note || "").trim(),
            source: row.leaveRequestId ? "Leave Request" : "Attendance",
            leaveType,
            leavePortion,
          },
        };
      })
      .filter(Boolean);
    },
    [attendanceRecords, leaveRequests]
  );

  useEffect(() => {
    if (calendarViewMode === "year") {
      return;
    }

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi && calendarApi.view.type !== "dayGridMonth") {
      calendarApi.changeView("dayGridMonth");
    }
  }, [calendarViewMode]);

  useEffect(() => {
    if (calendarViewMode === "year") {
      setActiveCalendarLabel(`Year ${attendanceYear}`);
    }
  }, [calendarViewMode, attendanceYear]);

  const handleCalendarModeChange = (mode) => {
    setCalendarViewMode(mode);

    if (mode === "year") {
      return;
    }

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView("dayGridMonth");
    }
  };

  const handleCalendarNavigation = (action) => {
    if (calendarViewMode === "year") {
      if (action === "prev") {
        setAttendanceYear((previous) => previous - 1);
      } else if (action === "next") {
        setAttendanceYear((previous) => previous + 1);
      } else if (action === "today") {
        setAttendanceYear(new Date().getFullYear());
      }
      return;
    }

    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) {
      return;
    }

    if (action === "prev") {
      calendarApi.prev();
    } else if (action === "next") {
      calendarApi.next();
    } else if (action === "today") {
      calendarApi.today();
    }
  };

  const handleCalendarDatesSet = (arg) => {
    const currentStart = arg.view?.currentStart || new Date();
    const nextYear = currentStart.getFullYear();
    setActiveCalendarLabel(
      currentStart.toLocaleString("en-IN", { month: "long", year: "numeric" })
    );

    setAttendanceYear((previousYear) =>
      previousYear === nextYear ? previousYear : nextYear
    );
  };

  const handleEventDidMount = (info) => {
    const note = info.event.extendedProps?.note;
    const source = info.event.extendedProps?.source;
    const leaveType = info.event.extendedProps?.leaveType;
    const leavePortion = info.event.extendedProps?.leavePortion;
    const details = [
      info.event.title,
      leaveType ? `Leave: ${leaveType}` : "",
      leavePortion ? `Duration: ${leavePortion}` : "",
      source,
      note,
    ]
      .filter(Boolean)
      .join(" | ");
    info.el.title = details;
  };

  const handleEventContent = (eventInfo) => {
    const leaveType = String(eventInfo.event.extendedProps?.leaveType || "");
    const leavePortion = String(eventInfo.event.extendedProps?.leavePortion || "");
    const leaveMeta = [leaveType, leavePortion].filter(Boolean).join(" • ");
    const showLeaveMeta = Boolean(leaveMeta);

    return (
      <div className="leading-tight">
        <div>{eventInfo.event.title}</div>
        {showLeaveMeta ? (
          <div className="mt-0.5 text-[10px] font-semibold uppercase opacity-90">{leaveMeta}</div>
        ) : null}
      </div>
    );
  };

  const handleReasonChange = (event) => {
    const { value } = event.target;
    setLeaveForm((previous) => ({
      ...previous,
      reason: value,
    }));
  };

  const handleLeaveTypeChange = (value) => {
    setLeaveForm((previous) => ({
      ...previous,
      leaveType: value,
    }));
  };

  const handleDurationTypeChange = (value) => {
    setLeaveForm((previous) => {
      if (value === "multiple_days") {
        return {
          ...previous,
          durationType: value,
          endDate: previous.endDate || previous.startDate || "",
        };
      }

      return {
        ...previous,
        durationType: value,
        endDate: previous.startDate || "",
      };
    });
  };

  const handleStartDateSelect = (dateValue) => {
    if (!dateValue) {
      return;
    }

    const nextStartDate = toLocalDateKey(dateValue);

    setLeaveForm((previous) => {
      return {
        ...previous,
        startDate: nextStartDate,
        endDate:
          previous.durationType === "multiple_days"
            ? !previous.endDate || previous.endDate < nextStartDate
              ? nextStartDate
              : previous.endDate
            : nextStartDate,
      };
    });
  };

  const handleEndDateSelect = (dateValue) => {
    if (!dateValue) {
      return;
    }

    const nextEndDate = toLocalDateKey(dateValue);
    setLeaveForm((previous) => ({
      ...previous,
      endDate: nextEndDate,
    }));
  };

  const handleApplyLeave = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!leaveForm.startDate) {
      setError("Please select start date");
      setLoading(false);
      return;
    }

    if (!leaveForm.endDate) {
      setError("Please select end date");
      setLoading(false);
      return;
    }

    const selectedStartDate = parseDateKey(leaveForm.startDate);
    const selectedEndDate = parseDateKey(
      leaveForm.durationType === "multiple_days" ? leaveForm.endDate : leaveForm.startDate
    );
    if (!selectedStartDate || !selectedEndDate) {
      setError("Invalid date selection");
      setLoading(false);
      return;
    }

    if (selectedEndDate < selectedStartDate) {
      setError("End date cannot be before start date");
      setLoading(false);
      return;
    }

    const payload = {
      leaveType: leaveForm.leaveType,
      durationType: leaveForm.durationType,
      startDate: leaveForm.startDate,
      endDate: toLocalDateKey(selectedEndDate),
      reason: leaveForm.reason,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/employee/leave/apply`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage(response.data?.message || "Leave applied successfully");
        setLeaveForm({
          leaveType: "CL",
          durationType: "full_day",
          startDate: "",
          endDate: "",
          reason: "",
        });
        await fetchLeaveData();
      }
    } catch (submitError) {
      setError(submitError?.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!embedded ? <EmployeeNavbar /> : null}

      <div className={`${embedded ? "px-0 py-2 md:px-0" : "px-4 py-6 md:px-8"} bg-slate-50`}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Attendance Dashboard</h1>
          <div className="w-52">
            <p className="mb-1 text-xs font-medium text-slate-600">Top Stats</p>
            <Select value={statsFilter} onValueChange={handleStatsFilterChange}>
              <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm">
                <SelectValue placeholder="Select Stats View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall</SelectItem>
                {statsYearOptions.map((yearValue) => (
                  <SelectItem key={`stats-year-${yearValue}`} value={String(yearValue)}>
                    Year {yearValue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl bg-gradient-to-r ${card.colors} p-5 text-white shadow-sm`}
            >
              <p className="text-xl font-semibold">{card.title}</p>
              <p className="mt-5 text-4xl font-bold">{Math.max(0, card.value).toFixed(2)}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-white/80">{card.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Attendance Calendar</h2>
                <p className="mt-0.5 text-sm text-slate-600">{activeCalendarLabel}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCalendarNavigation("prev")}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCalendarNavigation("today")}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCalendarNavigation("next")}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Next
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {[
                    { id: "month", label: "Month" },
                    { id: "year", label: "Year" },
                  ].map((viewOption) => (
                    <button
                      key={viewOption.id}
                      type="button"
                      onClick={() => handleCalendarModeChange(viewOption.id)}
                      className={`rounded-md px-2 py-1 text-sm ${
                        calendarViewMode === viewOption.id
                          ? "bg-slate-900 text-white"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {viewOption.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4">
              {calendarViewMode === "year" ? (
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700">
                    Monthly Leave Totals for {attendanceYear}
                  </p>
                  <div className="overflow-hidden rounded-lg">
                    <div className="grid grid-cols-2 border-l border-t border-slate-300 sm:grid-cols-3 xl:grid-cols-4">
                      {monthlyCalendarSummary.map((monthRow) => (
                        <div
                          key={monthRow.index}
                          className="flex min-h-[150px] flex-col border-b border-r border-slate-300 bg-white p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900">{monthRow.label}</p>
                            <span className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-xs font-semibold text-slate-700">
                              {monthRow.leaveUnits.toFixed(1)}
                            </span>
                          </div>
                          <div className="mt-4 space-y-2.5">
                            <div className="block w-full rounded border border-sky-300 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
                              CL: {monthRow.clTaken.toFixed(1)}
                            </div>
                            <div className="block w-full rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                              EL: {monthRow.elTaken.toFixed(1)}
                            </div>
                            <div className="block w-full rounded border border-rose-300 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
                              LOP: {monthRow.lopTaken.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <FullCalendar
                  ref={calendarRef}
                  plugins={[
                    dayGridPlugin,
                    interactionPlugin,
                  ]}
                  initialView="dayGridMonth"
                  headerToolbar={false}
                  events={attendanceEvents}
                  height="auto"
                  dayMaxEventRows={2}
                  displayEventTime={false}
                  datesSet={handleCalendarDatesSet}
                  eventDidMount={handleEventDidMount}
                  eventContent={handleEventContent}
                  noEventsContent="No attendance records in this range"
                />
              )}
            </div>
          </div>

          <div className="space-y-4 xl:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Apply Leaves</h3>
              <form onSubmit={handleApplyLeave} className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Select value={leaveForm.leaveType} onValueChange={handleLeaveTypeChange}>
                    <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm focus:ring-indigo-100">
                      <SelectValue placeholder="Select Leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CL">Casual Leave (CL)</SelectItem>
                      <SelectItem value="EL">Earned Leave (EL)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={leaveForm.durationType} onValueChange={handleDurationTypeChange}>
                    <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm focus:ring-indigo-100">
                      <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="half_day">Half Day</SelectItem>
                      <SelectItem value="full_day">Full Day</SelectItem>
                      <SelectItem value="multiple_days">Multiple Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 px-3 text-sm text-slate-900 hover:bg-slate-50"
                      >
                        <span className={leaveForm.startDate ? "text-slate-900" : "text-slate-500"}>
                          {leaveForm.startDate
                            ? formatDateLabel(leaveForm.startDate)
                            : "Start Date"}
                        </span>
                        <CalendarIcon className="h-4 w-4 text-slate-500" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDateObject}
                        onSelect={handleStartDateSelect}
                        disabled={(date) => (todayDateObject ? date < todayDateObject : false)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        disabled={leaveForm.durationType !== "multiple_days"}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 px-3 text-sm text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <span
                          className={
                            leaveForm.durationType === "multiple_days" && leaveForm.endDate
                              ? "text-slate-900"
                              : leaveForm.startDate
                                ? "text-slate-700"
                                : "text-slate-500"
                          }
                        >
                          {leaveForm.durationType === "multiple_days"
                            ? leaveForm.endDate
                              ? formatDateLabel(leaveForm.endDate)
                              : "End Date"
                            : leaveForm.startDate
                              ? formatDateLabel(leaveForm.startDate)
                              : "End Date"}
                        </span>
                        <CalendarIcon className="h-4 w-4 text-slate-500" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          leaveForm.durationType === "multiple_days"
                            ? endDateObject
                            : startDateObject
                        }
                        onSelect={handleEndDateSelect}
                        disabled={(date) => (endDateMinObject ? date < endDateMinObject : false)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <textarea
                  name="reason"
                  value={leaveForm.reason}
                  onChange={handleReasonChange}
                  rows={2}
                  placeholder="Leave Reason"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Recent Leave Requests</h3>
              <div className="space-y-3">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <div key={request._id} className="rounded-md border border-slate-200 p-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-800">
                          {request.leaveType} ({request.durationType.replaceAll("_", " ")})
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            statusBadgeClasses[request.status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDateLabel(getRequestDateKey(request, "start"))} to{" "}
                        {formatDateLabel(getRequestDateKey(request, "end"))}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No leave requests found.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">My Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left text-xs uppercase text-slate-700">
                  <th className="px-3 py-2">Applied On</th>
                  <th className="px-3 py-2">Leave Type</th>
                  <th className="px-3 py-2">Dates</th>
                  <th className="px-3 py-2">Duration</th>
                  <th className="px-3 py-2">Units</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Remark</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((request) => (
                    <tr key={request._id} className="border-b border-slate-200">
                      <td className="px-3 py-2">{new Date(request.createdAt).toLocaleDateString("en-IN")}</td>
                      <td className="px-3 py-2">{request.leaveType}</td>
                    <td className="px-3 py-2">
                      {formatDateLabel(getRequestDateKey(request, "start"))} to{" "}
                      {formatDateLabel(getRequestDateKey(request, "end"))}
                    </td>
                      <td className="px-3 py-2">{request.durationType.replaceAll("_", " ")}</td>
                      <td className="px-3 py-2">{Number(request.totalUnits || 0).toFixed(2)}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            statusBadgeClasses[request.status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">{request?.adminReview?.remark || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!embedded ? <Footer /> : null}
    </>
  );
};

export default EmployeeLeaves;


