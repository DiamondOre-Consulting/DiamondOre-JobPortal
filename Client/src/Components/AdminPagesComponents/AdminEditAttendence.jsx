import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarIcon } from "lucide-react";
import AdminNav from "./AdminNav";
import Footer from "../../Pages/HomePage/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { toast } from "sonner";

const statusBadgeClasses = {
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const attendanceStyleByStatus = {
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

const normalizeEditableAttendanceStatus = (statusValue) => {
  if (statusValue === "Half Day") return "Half Day";
  if (statusValue === "Present") return "Present";
  return "Absent";
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
  if (!dateValue) return undefined;
  const [year, month, day] = String(dateValue)
    .split("-")
    .map((value) => Number(value));
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const formatDateLabel = (dateValue) => {
  const parsedDate = parseDateKey(dateValue);
  if (!parsedDate) return "";
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

const LabeledInput = ({ id, label, className = "", ...inputProps }) => {
  return (
    <div className="space-y-0">
      <label htmlFor={id} className="text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className={`h-10 w-full rounded-md border border-slate-300 px-3 text-sm ${className}`.trim()}
      />
    </div>
  );
};

const AdminEditAttendence = ({ embedded = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const latestFetchIdRef = useRef(0);
  const latestStatsFetchIdRef = useRef(0);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [employee, setEmployee] = useState(null);
  const [leaveBalanceState, setLeaveBalanceState] = useState({ year: null, data: null });
  const [overallBalanceState, setOverallBalanceState] = useState(null);
  const [previousYearBalance, setPreviousYearBalance] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceYear, setAttendanceYear] = useState(new Date().getFullYear());
  const [attendanceMonth, setAttendanceMonth] = useState(new Date().getMonth() + 1);
  const [statsFilter, setStatsFilter] = useState("overall");
  const [statsYear, setStatsYear] = useState(new Date().getFullYear());
  const [statsYearBalanceState, setStatsYearBalanceState] = useState({ year: null, data: null });
  const [calendarViewMode, setCalendarViewMode] = useState("month");
  const [activeCalendarLabel, setActiveCalendarLabel] = useState(
    new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })
  );

  const [loading, setLoading] = useState(false);
  const [carryLoading, setCarryLoading] = useState(false);
  const [manualAttendanceLoading, setManualAttendanceLoading] = useState(false);
  const [balanceAdjustLoading, setBalanceAdjustLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [compensationForm, setCompensationForm] = useState({
    leaveType: "CL",
    amount: "",
    reason: "",
  });
  const [manualAttendance, setManualAttendance] = useState({
    date: toLocalDateKey(new Date()),
    status: "Absent",
    leaveType: "CL",
    note: "",
  });
  const [manualBalanceForm, setManualBalanceForm] = useState({
    clValue: "",
    elValue: "",
    lopValue: "",
  });
  const [updateSheetOpen, setUpdateSheetOpen] = useState(false);

  const [modifyTarget, setModifyTarget] = useState(null);
  const [modifyForm, setModifyForm] = useState({
    leaveType: "CL",
    durationType: "full_day",
    startDate: "",
    endDate: "",
    reason: "",
    remark: "",
  });

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
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/balance/${id}`,
        {
          headers,
          params: { year: parsedYear },
        }
      );

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
      }
    } catch (statsError) {
      if (fetchId !== latestStatsFetchIdRef.current) {
        return;
      }
      setError(statsError?.response?.data?.message || "Failed to fetch stats data");
    }
  };

  const fetchData = async () => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const requestedYear = attendanceYear;
    const requestedMonth = attendanceMonth;
    const fetchId = latestFetchIdRef.current + 1;
    latestFetchIdRef.current = fetchId;

    const [
      employeeResult,
      overviewResult,
      currentBalanceResult,
      previousBalanceResult,
      requestsResult,
      attendanceResult,
    ] = await Promise.allSettled([
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees/${id}`, { headers }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/leave/overview/${id}`, {
        headers,
        params: { year: requestedYear },
      }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/leave/balance/${id}`, {
        headers,
        params: { year: requestedYear },
      }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/leave/balance/${id}`, {
        headers,
        params: { year: requestedYear - 1 },
      }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/leave/requests`, {
        headers,
        params: { employeeId: id },
      }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/leave/attendance/${id}`, {
        headers,
        params: { year: requestedYear, month: requestedMonth },
      }),
    ]);

    if (fetchId !== latestFetchIdRef.current) {
      return;
    }

    if (employeeResult.status === "fulfilled" && employeeResult.value.status === 201) {
      setEmployee(employeeResult.value.data);
    }

    if (currentBalanceResult.status === "fulfilled" && currentBalanceResult.value.status === 200) {
      const balanceYear = Number(currentBalanceResult.value.data?.year);
      const responseOverallBalance = currentBalanceResult.value.data?.overallBalance || null;
      const currentYearBalance = currentBalanceResult.value.data?.leaveBalance || null;
      setLeaveBalanceState({
        year:
          Number.isInteger(balanceYear) && balanceYear > 0 ? balanceYear : requestedYear,
        data: currentYearBalance,
      });
      setOverallBalanceState(responseOverallBalance);
      if (statsFilter !== "overall" && statsYear === requestedYear) {
        setStatsYearBalanceState({
          year: requestedYear,
          data: currentYearBalance,
        });
      }
    } else if (overviewResult.status === "fulfilled" && overviewResult.value.status === 200) {
      const overviewYear = Number(overviewResult.value.data?.year);
      setLeaveBalanceState({
        year:
          Number.isInteger(overviewYear) && overviewYear > 0 ? overviewYear : requestedYear,
        data: overviewResult.value.data?.leaveBalance || null,
      });
      setOverallBalanceState(null);
    } else {
      setLeaveBalanceState({ year: requestedYear, data: null });
      setOverallBalanceState(null);
      if (statsFilter !== "overall" && statsYear === requestedYear) {
        setStatsYearBalanceState({ year: requestedYear, data: null });
      }
    }

    if (overviewResult.status === "fulfilled" && overviewResult.value.status === 200) {
      setMonthlySummary(overviewResult.value.data.monthlySummary || []);
    } else {
      setMonthlySummary([]);
    }

    if (
      previousBalanceResult.status === "fulfilled" &&
      previousBalanceResult.value.status === 200
    ) {
      setPreviousYearBalance(previousBalanceResult.value.data.leaveBalance);
    } else {
      setPreviousYearBalance(null);
    }

    if (requestsResult.status === "fulfilled" && requestsResult.value.status === 200) {
      setLeaveRequests(requestsResult.value.data.leaveRequests || []);
    } else {
      setLeaveRequests([]);
    }

    if (attendanceResult.status === "fulfilled" && attendanceResult.value.status === 200) {
      setAttendanceRecords(attendanceResult.value.data.attendance || []);
    } else {
      setAttendanceRecords([]);
    }
  };

  useEffect(() => {
    fetchData().catch(() => setError("Failed to fetch data"));
  }, [id, attendanceYear, attendanceMonth]);

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

  const joiningYear = useMemo(() => {
    if (!employee?.doj) {
      return null;
    }

    const parsedDate = new Date(employee.doj);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.getFullYear();
    }

    const yearMatch = String(employee.doj).match(/\b(19|20)\d{2}\b/);
    return yearMatch ? Number(yearMatch[0]) : null;
  }, [employee?.doj]);

  const yearOptions = useMemo(() => {
    const years = new Set();
    const startYear =
      Number.isInteger(joiningYear) && joiningYear > 0
        ? Math.min(joiningYear, currentYear)
        : currentYear;

    for (let value = startYear; value <= currentYear; value += 1) {
      years.add(value);
    }
    years.add(attendanceYear);
    years.add(statsYear);

    return Array.from(years).sort((a, b) => b - a);
  }, [joiningYear, currentYear, attendanceYear, statsYear]);

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

  const monthlyCalendarSummary = useMemo(() => {
    const monthMap = new Map(
      monthlySummary.map((monthRow) => [Number(monthRow.month || 0), monthRow])
    );

    return Array.from({ length: 12 }, (_, index) => {
      const monthIndex = index + 1;
      const row = monthMap.get(monthIndex) || {};
      const clNetUsed = Number(
        (
          Number(row.clUsed || 0) - Number(row.manualAdjustmentCL || 0)
        ).toFixed(2)
      );
      const elNetUsed = Number(
        (
          Number(row.elUsed || 0) - Number(row.manualAdjustmentEL || 0)
        ).toFixed(2)
      );
      const lopNetUsed = Number(
        (
          Number(row.lopUsed || 0) - Number(row.manualAdjustmentLOP || 0)
        ).toFixed(2)
      );
      return {
        index,
        label: new Date(attendanceYear, index, 1).toLocaleString("en-IN", { month: "long" }),
        leaveUnits: Number(row.leaveUnits || 0),
        clUsed: clNetUsed,
        elUsed: elNetUsed,
        lopUsed: lopNetUsed,
        absentDays: Number(row.absentDays || 0),
        halfDays: Number(row.halfDays || 0),
      };
    });
  }, [monthlySummary, attendanceYear]);

  const attendanceEvents = useMemo(() => {
    const requestMap = new Map();
    leaveRequests.forEach((request) => {
      const requestId = String(request?._id || "");
      if (!requestId) return;
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
          linkedRequest && String(linkedRequest?.status || "").toLowerCase() !== "rejected"
            ? String(linkedRequest?.leaveType || "").toUpperCase()
            : ["CL", "EL", "LOP"].includes(manualLeaveType)
              ? manualLeaveType
              : "";
        const leavePortion = row.status === "Half Day" ? "Half" : "Full";

        return {
          id: row._id,
          title: row.status,
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
  }, [attendanceRecords, leaveRequests]);

  useEffect(() => {
    if (calendarViewMode === "year") {
      setActiveCalendarLabel(`Year ${attendanceYear}`);
      return;
    }

    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    calendarApi.changeView("dayGridMonth", new Date(attendanceYear, attendanceMonth - 1, 1));
  }, [calendarViewMode, attendanceYear, attendanceMonth]);

  const handleCalendarModeChange = (mode) => {
    setCalendarViewMode(mode);
  };

  const syncManualBalanceWithSelectedYear = () => {
    setManualBalanceForm({
      clValue: clBalance.toFixed(2),
      elValue: elBalance.toFixed(2),
      lopValue: lopUsed.toFixed(2),
    });
  };

  const openUpdateSheet = () => {
    syncManualBalanceWithSelectedYear();
    setUpdateSheetOpen(true);
  };

  const handleYearSelectChange = (value) => {
    const parsedValue = Number(value);
    if (Number.isInteger(parsedValue) && parsedValue > 0) {
      setAttendanceYear(parsedValue);
    }
  };

  useEffect(() => {
    if (!updateSheetOpen) {
      return;
    }
    syncManualBalanceWithSelectedYear();
  }, [updateSheetOpen, attendanceYear, clBalance, elBalance, lopUsed]);

  const handleCalendarNavigation = (action) => {
    if (calendarViewMode === "year") {
      if (action === "prev") {
        setAttendanceYear((previous) => previous - 1);
      } else if (action === "next") {
        setAttendanceYear((previous) => previous + 1);
      } else if (action === "today") {
        const currentDate = new Date();
        setAttendanceYear(currentDate.getFullYear());
        setAttendanceMonth(currentDate.getMonth() + 1);
      }
      return;
    }

    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    if (action === "prev") {
      calendarApi.prev();
    } else if (action === "next") {
      calendarApi.next();
    } else if (action === "today") {
      calendarApi.today();
    }
  };

  const handleCalendarDatesSet = (arg) => {
    if (calendarViewMode !== "month") return;

    const currentStart = arg.view?.currentStart || new Date();
    const nextYear = currentStart.getFullYear();
    const nextMonth = currentStart.getMonth() + 1;

    setActiveCalendarLabel(
      currentStart.toLocaleString("en-IN", { month: "long", year: "numeric" })
    );
    setAttendanceYear((previous) => (previous === nextYear ? previous : nextYear));
    setAttendanceMonth((previous) => (previous === nextMonth ? previous : nextMonth));
  };

  const handleCalendarDateClick = (arg) => {
    const clickedDateKey = toLocalDateKey(arg.date);
    const matchedAttendance = attendanceRecords.find(
      (row) => getAttendanceDateKey(row) === clickedDateKey
    );
    const linkedRequest = leaveRequests.find(
      (request) => String(request?._id || "") === String(matchedAttendance?.leaveRequestId || "")
    );
    const linkedLeaveType =
      linkedRequest && String(linkedRequest?.status || "").toLowerCase() !== "rejected"
        ? String(linkedRequest?.leaveType || "").toUpperCase()
        : "";
    const fallbackLeaveType = String(matchedAttendance?.leaveType || "").toUpperCase();
    const resolvedLeaveType = ["CL", "EL", "LOP"].includes(linkedLeaveType)
      ? linkedLeaveType
      : ["CL", "EL", "LOP"].includes(fallbackLeaveType)
        ? fallbackLeaveType
        : "CL";

    setManualAttendance({
      date: clickedDateKey,
      status: normalizeEditableAttendanceStatus(matchedAttendance?.status),
      leaveType: resolvedLeaveType,
      note: String(matchedAttendance?.note || ""),
    });
    openUpdateSheet();
  };

  const handleCalendarEventClick = (arg) => {
    const targetId = String(arg?.event?.id || "");
    const matchedAttendance = attendanceRecords.find((row) => String(row?._id || "") === targetId);
    if (!matchedAttendance) return;
    const linkedRequest = leaveRequests.find(
      (request) => String(request?._id || "") === String(matchedAttendance?.leaveRequestId || "")
    );
    const linkedLeaveType =
      linkedRequest && String(linkedRequest?.status || "").toLowerCase() !== "rejected"
        ? String(linkedRequest?.leaveType || "").toUpperCase()
        : "";
    const fallbackLeaveType = String(matchedAttendance?.leaveType || "").toUpperCase();
    const resolvedLeaveType = ["CL", "EL", "LOP"].includes(linkedLeaveType)
      ? linkedLeaveType
      : ["CL", "EL", "LOP"].includes(fallbackLeaveType)
        ? fallbackLeaveType
        : "CL";

    setManualAttendance({
      date: getAttendanceDateKey(matchedAttendance),
      status: normalizeEditableAttendanceStatus(matchedAttendance.status),
      leaveType: resolvedLeaveType,
      note: String(matchedAttendance.note || ""),
    });
    openUpdateSheet();
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
    const leaveMeta = [leaveType, leavePortion].filter(Boolean).join(" | ");

    return (
      <div className="leading-tight">
        <div>{eventInfo.event.title}</div>
        {leaveMeta ? (
          <div className="mt-0.5 text-[10px] font-semibold uppercase opacity-90">{leaveMeta}</div>
        ) : null}
      </div>
    );
  };

  const reviewRequest = async (requestId, action, payload = {}) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/requests/${requestId}/review`,
        { action, ...payload },
        { headers }
      );
      if (response.status === 200) {
        setMessage(response.data?.message || "Request updated");
        await fetchData();
        return true;
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to review request");
      return false;
    } finally {
      setLoading(false);
    }

    return false;
  };

  const handleCompensationLeaveTypeChange = (value) => {
    setCompensationForm((previous) => ({ ...previous, leaveType: value }));
  };

  const handleCompensationFieldChange = (event) => {
    const { name, value } = event.target;
    setCompensationForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleCompensationSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/compensation/${id}`,
        {
          leaveType: compensationForm.leaveType,
          amount: Number(compensationForm.amount),
          reason: compensationForm.reason,
          year: attendanceYear,
        },
        { headers }
      );
      if (response.status === 200) {
        setMessage(response.data?.message || "Compensation leave added");
        setCompensationForm({ leaveType: "CL", amount: "", reason: "" });
        await fetchData();
      }
    } catch (compError) {
      setError(compError?.response?.data?.message || "Failed to add compensation leave");
    } finally {
      setLoading(false);
    }
  };

  const handleManualAttendanceDateSelect = (dateValue) => {
    if (!dateValue) return;
    setManualAttendance((previous) => ({
      ...previous,
      date: toLocalDateKey(dateValue),
    }));
  };

  const handleManualAttendanceStatusChange = (value) => {
    setManualAttendance((previous) => ({
      ...previous,
      status: value,
    }));
  };

  const handleManualAttendanceLeaveTypeChange = (value) => {
    setManualAttendance((previous) => ({
      ...previous,
      leaveType: value,
    }));
  };

  const handleManualAttendanceNoteChange = (event) => {
    const { value } = event.target;
    setManualAttendance((previous) => ({
      ...previous,
      note: value,
    }));
  };

  const handleManualAttendanceSubmit = async (event) => {
    event.preventDefault();
    setManualAttendanceLoading(true);
    setMessage("");
    setError("");

    const selectedDate = parseDateKey(manualAttendance.date);
    if (!selectedDate) {
      setError("Please select a valid attendance date");
      setManualAttendanceLoading(false);
      return;
    }
    if (selectedDate.getFullYear() !== attendanceYear) {
      setError(`Please select a date from year ${attendanceYear} in this sheet`);
      setManualAttendanceLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/attendance/${id}/manual`,
        {
          date: manualAttendance.date,
          status: manualAttendance.status,
          leaveType: manualAttendance.leaveType,
          note: manualAttendance.note,
        },
        { headers }
      );

      if (response.status === 200) {
        setMessage(response.data?.message || "Attendance updated successfully");
        setManualAttendance((previous) => ({ ...previous, note: "" }));
        await fetchData();
      }
    } catch (manualError) {
      setError(manualError?.response?.data?.message || "Failed to update attendance");
    } finally {
      setManualAttendanceLoading(false);
    }
  };

  const handleManualBalanceFieldChange = (event) => {
    const { name, value } = event.target;
    setManualBalanceForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleManualBalanceSubmit = async (event) => {
    event.preventDefault();
    setBalanceAdjustLoading(true);
    setMessage("");
    setError("");

    try {
      const clValue = Number(manualBalanceForm.clValue);
      const elValue = Number(manualBalanceForm.elValue);
      const lopValue = Number(manualBalanceForm.lopValue);

      if (![clValue, elValue, lopValue].every((value) => Number.isFinite(value) && value >= 0)) {
        setError("Please enter valid CL, EL, and LOP values");
        setBalanceAdjustLoading(false);
        return;
      }

      const payload = {
        year: attendanceYear,
        mode: "set",
        clValue,
        elValue,
        lopValue,
        reason: "",
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/balance/${id}/manual-adjust`,
        payload,
        { headers }
      );

      if (response.status === 200) {
        setMessage(response.data?.message || "Leave balance adjusted successfully");
        await fetchData();
      }
    } catch (adjustError) {
      setError(adjustError?.response?.data?.message || "Failed to adjust leave balance");
    } finally {
      setBalanceAdjustLoading(false);
    }
  };

  const handleCarryForward = async () => {
    setCarryLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/credits/carry-forward/${id}`,
        { nextYear: attendanceYear },
        { headers }
      );
      if (response.status === 200) {
        setMessage(response.data?.message || "Carry forward processed");
        await fetchData();
      }
    } catch (carryError) {
      setError(carryError?.response?.data?.message || "Failed to process carry forward");
    } finally {
      setCarryLoading(false);
    }
  };

  const openModifyDialog = (request) => {
    setModifyTarget(request);
    setModifyForm({
      leaveType: request.leaveType,
      durationType: request.durationType,
      startDate: getRequestDateKey(request, "start"),
      endDate: getRequestDateKey(request, "end"),
      reason: request.reason || "",
      remark: "",
    });
  };

  const handleModifyLeaveTypeChange = (value) => {
    setModifyForm((previous) => ({ ...previous, leaveType: value }));
  };

  const handleModifyDurationTypeChange = (value) => {
    setModifyForm((previous) => {
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

  const handleModifyStartDateSelect = (dateValue) => {
    if (!dateValue) return;
    const nextStartDate = toLocalDateKey(dateValue);
    setModifyForm((previous) => ({
      ...previous,
      startDate: nextStartDate,
      endDate:
        previous.durationType === "multiple_days"
          ? !previous.endDate || previous.endDate < nextStartDate
            ? nextStartDate
            : previous.endDate
          : nextStartDate,
    }));
  };

  const handleModifyEndDateSelect = (dateValue) => {
    if (!dateValue) return;
    const nextEndDate = toLocalDateKey(dateValue);
    setModifyForm((previous) => ({ ...previous, endDate: nextEndDate }));
  };

  const handleModifyReasonChange = (event) => {
    const { value } = event.target;
    setModifyForm((previous) => ({ ...previous, reason: value }));
  };

  const handleModifyRemarkChange = (event) => {
    const { value } = event.target;
    setModifyForm((previous) => ({ ...previous, remark: value }));
  };

  const handleModifySubmit = async (event) => {
    event.preventDefault();
    if (!modifyTarget) return;

    const selectedStartDate = parseDateKey(modifyForm.startDate);
    const selectedEndDate = parseDateKey(
      modifyForm.durationType === "multiple_days" ? modifyForm.endDate : modifyForm.startDate
    );

    if (!selectedStartDate || !selectedEndDate) {
      setError("Please select valid start and end dates");
      return;
    }
    if (selectedEndDate < selectedStartDate) {
      setError("End date cannot be before start date");
      return;
    }

    const reviewSucceeded = await reviewRequest(modifyTarget._id, "modify", {
      remark: modifyForm.remark,
      updatedRequest: {
        leaveType: modifyForm.leaveType,
        durationType: modifyForm.durationType,
        startDate: modifyForm.startDate,
        endDate: toLocalDateKey(selectedEndDate),
        reason: modifyForm.reason,
      },
    });

    if (reviewSucceeded) {
      setModifyTarget(null);
    }
  };

  const modifyStartDateObject = parseDateKey(modifyForm.startDate);
  const modifyEndDateObject = parseDateKey(modifyForm.endDate);
  const modifyEndMinDateObject = parseDateKey(modifyForm.startDate);
  const manualAttendanceDateObject = parseDateKey(manualAttendance.date);

  return (
    <div className="min-h-screen bg-slate-50">
      {!embedded ? <AdminNav /> : null}

      <div className={`${embedded ? "px-0 py-2 md:px-0" : "px-4 py-6 md:px-8"}`}>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Attendance Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              {employee?.name || "Employee"}
              {employee?.email ? ` | ${employee.email}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-52">
              <p className="mb-1 text-xs font-medium text-slate-600">Top Stats</p>
              <Select value={statsFilter} onValueChange={handleStatsFilterChange}>
                <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm">
                  <SelectValue placeholder="Select Stats View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall</SelectItem>
                  {yearOptions.map((yearValue) => (
                    <SelectItem key={`stats-year-${yearValue}`} value={String(yearValue)}>
                      Year {yearValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              onClick={openUpdateSheet}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Update Attendance
            </button>
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
                {calendarViewMode === "month" ? (
                  <p className="mt-0.5 text-xs text-slate-500">
                    Click any date/event to edit attendance directly.
                  </p>
                ) : null}
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
                          className="min-h-[190px] border-b border-r border-slate-300 bg-white p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900">{monthRow.label}</p>
                            <span className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-xs font-semibold text-slate-700">
                              {monthRow.leaveUnits.toFixed(1)}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div className="rounded border border-sky-300 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
                              CL: {monthRow.clUsed.toFixed(1)}
                            </div>
                            <div className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                              EL: {monthRow.elUsed.toFixed(1)}
                            </div>
                            <div className="rounded border border-rose-300 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
                              LOP: {monthRow.lopUsed.toFixed(1)}
                            </div>
                            <div className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                              Absent (Full): {monthRow.absentDays.toFixed(0)}
                            </div>
                            <div className="rounded border border-indigo-300 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                              Half Day: {monthRow.halfDays.toFixed(0)}
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
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={false}
                  events={attendanceEvents}
                  height="auto"
                  dayMaxEventRows={2}
                  displayEventTime={false}
                  datesSet={handleCalendarDatesSet}
                  dateClick={handleCalendarDateClick}
                  eventClick={handleCalendarEventClick}
                  eventDidMount={handleEventDidMount}
                  eventContent={handleEventContent}
                  noEventsContent="No attendance records in this range"
                />
              )}
            </div>
          </div>

          <div className="space-y-4 xl:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Employee</h3>
              <p className="text-sm font-medium text-slate-800">{employee?.name || "-"}</p>
              <p className="mt-1 text-xs text-slate-500">{employee?.email || "-"}</p>
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
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left text-xs uppercase text-slate-700">
                  <th className="px-3 py-2">Applied On</th>
                  <th className="px-3 py-2">Leave Type</th>
                  <th className="px-3 py-2">Dates</th>
                  <th className="px-3 py-2">Units</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((request) => (
                    <tr key={request._id} className="border-b border-slate-200">
                      <td className="px-3 py-2">
                        {new Date(request.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-3 py-2">
                        {request.leaveType} ({request.durationType.replaceAll("_", " ")})
                      </td>
                      <td className="px-3 py-2">
                        {formatDateLabel(getRequestDateKey(request, "start"))} to{" "}
                        {formatDateLabel(getRequestDateKey(request, "end"))}
                      </td>
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
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                              reviewRequest(request._id, "approve", {
                                remark: "Approved by admin",
                              })
                            }
                            className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                              reviewRequest(request._id, "reject", {
                                remark: "Rejected by admin",
                              })
                            }
                            className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => openModifyDialog(request)}
                            className="rounded-md bg-blue-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            Modify
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-center text-slate-500">
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Sheet open={updateSheetOpen} onOpenChange={setUpdateSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Update Attendance</SheetTitle>
            <SheetDescription>
              Edit year, attendance, leave balances, compensation, and carry-forward in one place.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-5">
            <section className="space-y-2">
              <label className="text-xs font-semibold uppercase text-slate-600">Working Year</label>
              <Select value={String(attendanceYear)} onValueChange={handleYearSelectChange}>
                <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((yearValue) => (
                    <SelectItem key={yearValue} value={String(yearValue)}>
                      {yearValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Attendance updates are saved to the year of the selected date
                (sheet year: {attendanceYear}).
              </p>
            </section>

            <section className="space-y-3 rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Attendance Record</h3>
              <form onSubmit={handleManualAttendanceSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-0">
                    <label className="text-xs font-medium text-slate-700">Attendance Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 px-3 text-sm text-slate-900 hover:bg-slate-50"
                        >
                          <span className={manualAttendance.date ? "text-slate-900" : "text-slate-500"}>
                            {manualAttendance.date
                              ? formatDateLabel(manualAttendance.date)
                              : "Select Date"}
                          </span>
                          <CalendarIcon className="h-4 w-4 text-slate-500" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={manualAttendanceDateObject}
                          onSelect={handleManualAttendanceDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-0">
                    <label className="text-xs font-medium text-slate-700">Attendance Status</label>
                    <Select
                      value={manualAttendance.status}
                      onValueChange={handleManualAttendanceStatusChange}
                    >
                      <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Half Day">Half Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0">
                    <label className="text-xs font-medium text-slate-700">Leave Type</label>
                    <Select
                      value={manualAttendance.leaveType}
                      onValueChange={handleManualAttendanceLeaveTypeChange}
                    >
                      <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm">
                        <SelectValue placeholder="Select Leave Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CL">CL</SelectItem>
                        <SelectItem value="EL">EL</SelectItem>
                        <SelectItem value="LOP">LOP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-0">
                  <label className="block text-xs font-medium text-slate-700">Note</label>
                  <textarea
                    name="note"
                    value={manualAttendance.note}
                    onChange={handleManualAttendanceNoteChange}
                    placeholder="Reason / Note"
                    rows={2}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={manualAttendanceLoading}
                  className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {manualAttendanceLoading ? "Saving..." : "Save Attendance"}
                </button>
              </form>
            </section>

            <section className="space-y-3 rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Update Leave Balance ({attendanceYear})
              </h3>
              <form onSubmit={handleManualBalanceSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <LabeledInput
                    id="cl-balance-input"
                    label="CL"
                    type="number"
                    name="clValue"
                    value={manualBalanceForm.clValue}
                    onChange={handleManualBalanceFieldChange}
                    placeholder="CL"
                    step="0.5"
                    min="0"
                    required
                  />
                  <LabeledInput
                    id="el-balance-input"
                    label="EL"
                    type="number"
                    name="elValue"
                    value={manualBalanceForm.elValue}
                    onChange={handleManualBalanceFieldChange}
                    placeholder="EL"
                    step="0.5"
                    min="0"
                    required
                  />
                  <LabeledInput
                    id="lop-balance-input"
                    label="LOP"
                    type="number"
                    name="lopValue"
                    value={manualBalanceForm.lopValue}
                    onChange={handleManualBalanceFieldChange}
                    placeholder="LOP"
                    step="0.5"
                    min="0"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={balanceAdjustLoading}
                  className="w-full rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {balanceAdjustLoading ? "Updating..." : "Update Leave Balance"}
                </button>
              </form>
            </section>

            <section className="space-y-3 rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Add Compensation Leave</h3>
              <form onSubmit={handleCompensationSubmit} className="space-y-3">
                <div className="space-y-0">
                  <label className="text-xs font-medium text-slate-700">Leave Type</label>
                  <Select
                    value={compensationForm.leaveType}
                    onValueChange={handleCompensationLeaveTypeChange}
                  >
                    <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm">
                      <SelectValue placeholder="Select Leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CL">Casual Leave (CL)</SelectItem>
                      <SelectItem value="EL">Earned Leave (EL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <LabeledInput
                  id="compensation-amount-input"
                  label="Amount"
                  type="number"
                  name="amount"
                  value={compensationForm.amount}
                  onChange={handleCompensationFieldChange}
                  placeholder="Amount"
                  min="0.5"
                  step="0.5"
                  required
                />

                <div className="space-y-0">
                  <label className="block text-xs font-medium text-slate-700">Reason</label>
                  <textarea
                    name="reason"
                    value={compensationForm.reason}
                    onChange={handleCompensationFieldChange}
                    placeholder="Reason"
                    rows={2}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Saving..." : "Add Compensation"}
                </button>
              </form>
            </section>

            <section className="space-y-3 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Year-End Carry Forward</h3>
                <button
                  type="button"
                  disabled={carryLoading}
                  onClick={handleCarryForward}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {carryLoading
                    ? "Processing..."
                    : `Carry ${attendanceYear - 1} to ${attendanceYear}`}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="rounded border border-blue-100 bg-blue-50 p-2">
                  <p className="text-[11px] font-semibold uppercase text-blue-700">
                    Prev Year CL ({attendanceYear - 1})
                  </p>
                  <p className="mt-1 text-sm font-bold text-blue-900">
                    {Number(previousYearBalance?.clBalance || 0).toFixed(2)}
                  </p>
                </div>
                <div className="rounded border border-emerald-100 bg-emerald-50 p-2">
                  <p className="text-[11px] font-semibold uppercase text-emerald-700">
                    Prev Year EL ({attendanceYear - 1})
                  </p>
                  <p className="mt-1 text-sm font-bold text-emerald-900">
                    {Number(previousYearBalance?.elBalance || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </SheetContent>
      </Sheet>

      {modifyTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">Modify Leave Request</h3>
            <form onSubmit={handleModifySubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select value={modifyForm.leaveType} onValueChange={handleModifyLeaveTypeChange}>
                  <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm">
                    <SelectValue placeholder="Leave Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CL">Casual Leave (CL)</SelectItem>
                    <SelectItem value="EL">Earned Leave (EL)</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={modifyForm.durationType}
                  onValueChange={handleModifyDurationTypeChange}
                >
                  <SelectTrigger className="h-10 rounded-md border border-slate-300 text-sm">
                    <SelectValue placeholder="Duration Type" />
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
                      <span
                        className={modifyForm.startDate ? "text-slate-900" : "text-slate-500"}
                      >
                        {modifyForm.startDate
                          ? formatDateLabel(modifyForm.startDate)
                          : "Start Date"}
                      </span>
                      <CalendarIcon className="h-4 w-4 text-slate-500" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={modifyStartDateObject}
                      onSelect={handleModifyStartDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      disabled={modifyForm.durationType !== "multiple_days"}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 px-3 text-sm text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <span
                        className={
                          modifyForm.durationType === "multiple_days" && modifyForm.endDate
                            ? "text-slate-900"
                            : modifyForm.startDate
                              ? "text-slate-700"
                              : "text-slate-500"
                        }
                      >
                        {modifyForm.durationType === "multiple_days"
                          ? modifyForm.endDate
                            ? formatDateLabel(modifyForm.endDate)
                            : "End Date"
                          : modifyForm.startDate
                            ? formatDateLabel(modifyForm.startDate)
                            : "End Date"}
                      </span>
                      <CalendarIcon className="h-4 w-4 text-slate-500" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        modifyForm.durationType === "multiple_days"
                          ? modifyEndDateObject
                          : modifyStartDateObject
                      }
                      onSelect={handleModifyEndDateSelect}
                      disabled={(date) =>
                        modifyEndMinDateObject ? date < modifyEndMinDateObject : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <textarea
                name="reason"
                value={modifyForm.reason}
                onChange={handleModifyReasonChange}
                placeholder="Updated reason"
                rows={2}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />

              <textarea
                name="remark"
                value={modifyForm.remark}
                onChange={handleModifyRemarkChange}
                placeholder="Admin remark"
                rows={2}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModifyTarget(null)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Save Modification
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {!embedded ? <Footer /> : null}
    </div>
  );
};

export default AdminEditAttendence;
