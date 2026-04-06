import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNav from "./AdminNav";
import Footer from "../../Pages/HomePage/Footer";

const statusBadgeClasses = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  modified: "bg-blue-100 text-blue-700",
};

const emptyYearTotals = {
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
  totalCredited: 0,
  totalUsed: 0,
  totalRemaining: 0,
};

const AdminEditAttendence = ({ embedded = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [employee, setEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [previousYearBalance, setPreviousYearBalance] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [yearTotals, setYearTotals] = useState(emptyYearTotals);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceMonth, setAttendanceMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [carryLoading, setCarryLoading] = useState(false);
  const [balanceAdjustLoading, setBalanceAdjustLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [compensationForm, setCompensationForm] = useState({
    leaveType: "CL",
    amount: "",
    reason: "",
  });
  const [manualAttendance, setManualAttendance] = useState({
    date: "",
    status: "Present",
    note: "",
  });
  const [manualBalanceForm, setManualBalanceForm] = useState({
    mode: "delta",
    clValue: "",
    elValue: "",
    lopValue: "",
    reason: "",
  });
  const [modifyTarget, setModifyTarget] = useState(null);
  const [modifyForm, setModifyForm] = useState({
    leaveType: "CL",
    durationType: "full_day",
    startDate: "",
    endDate: "",
    reason: "",
    remark: "",
  });

  const fetchData = async () => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const [
      employeeResult,
      overviewResult,
      previousBalanceResult,
      requestsResult,
      attendanceResult,
    ] = await Promise.allSettled([
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees/${id}`, { headers }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/leave/overview/${id}`, {
        headers,
        params: { year },
      }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/leave/balance/${id}`, {
        headers,
        params: { year: year - 1 },
      }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/leave/requests`, {
        headers,
        params: { employeeId: id },
      }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/leave/attendance/${id}`, {
        headers,
        params: { year, month: attendanceMonth },
      }),
    ]);

    if (employeeResult.status === "fulfilled" && employeeResult.value.status === 201) {
      setEmployee(employeeResult.value.data);
    }
    if (overviewResult.status === "fulfilled" && overviewResult.value.status === 200) {
      setLeaveBalance(overviewResult.value.data.leaveBalance);
      setMonthlySummary(overviewResult.value.data.monthlySummary || []);
      setYearTotals(overviewResult.value.data.totals || emptyYearTotals);
    } else {
      setLeaveBalance(null);
      setMonthlySummary([]);
      setYearTotals(emptyYearTotals);
    }
    if (previousBalanceResult.status === "fulfilled" && previousBalanceResult.value.status === 200) {
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
  }, [id, year, attendanceMonth]);

  const attendanceSummary = useMemo(
    () =>
      attendanceRecords.reduce(
        (acc, row) => {
          if (row.status === "Absent") acc.absent += 1;
          else if (row.status === "Half Day") acc.halfDay += 1;
          else acc.present += 1;
          return acc;
        },
        { present: 0, absent: 0, halfDay: 0 }
      ),
    [attendanceRecords]
  );

  const totalAvailable = Number(
    yearTotals?.totalRemaining ??
      (Number(leaveBalance?.clBalance || 0) + Number(leaveBalance?.elBalance || 0))
  );
  const totalCredited = Number(yearTotals?.totalCredited || 0);
  const totalUsed = Number(yearTotals?.totalUsed || 0);
  const totalHalfDays = Number(yearTotals?.halfDays || 0);
  const totalRequests = Number(yearTotals?.totalRequests || 0);

  const handleCompensationChange = (event) => {
    const { name, value } = event.target;
    setCompensationForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleManualChange = (event) => {
    const { name, value } = event.target;
    setManualAttendance((prev) => ({ ...prev, [name]: value }));
  };
  const handleManualBalanceChange = (event) => {
    const { name, value } = event.target;
    setManualBalanceForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleModifyChange = (event) => {
    const { name, value } = event.target;
    setModifyForm((prev) => ({ ...prev, [name]: value }));
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
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to review request");
    } finally {
      setLoading(false);
    }
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
          year,
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

  const handleCarryForward = async () => {
    setCarryLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/credits/carry-forward/${id}`,
        { nextYear: year },
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

  const handleManualBalanceSubmit = async (event) => {
    event.preventDefault();
    setBalanceAdjustLoading(true);
    setMessage("");
    setError("");
    try {
      const isSetMode = manualBalanceForm.mode === "set";
      const payload = {
        year,
        mode: manualBalanceForm.mode,
        clValue:
          manualBalanceForm.clValue === ""
            ? isSetMode
              ? undefined
              : 0
            : Number(manualBalanceForm.clValue),
        elValue:
          manualBalanceForm.elValue === ""
            ? isSetMode
              ? undefined
              : 0
            : Number(manualBalanceForm.elValue),
        lopValue:
          manualBalanceForm.lopValue === ""
            ? isSetMode
              ? undefined
              : 0
            : Number(manualBalanceForm.lopValue),
        reason: manualBalanceForm.reason || "",
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/balance/${id}/manual-adjust`,
        payload,
        { headers }
      );
      if (response.status === 200) {
        setMessage(response.data?.message || "Leave balance adjusted");
        setManualBalanceForm((prev) => ({
          ...prev,
          clValue: "",
          elValue: "",
          lopValue: "",
          reason: "",
        }));
        await fetchData();
      }
    } catch (adjustError) {
      setError(adjustError?.response?.data?.message || "Failed to adjust leave balance");
    } finally {
      setBalanceAdjustLoading(false);
    }
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/attendance/${id}/manual`,
        manualAttendance,
        { headers }
      );
      if (response.status === 200) {
        setMessage(response.data?.message || "Attendance updated");
        setManualAttendance((prev) => ({ ...prev, note: "" }));
        await fetchData();
      }
    } catch (manualError) {
      setError(manualError?.response?.data?.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  const openModifyDialog = (request) => {
    setModifyTarget(request);
    setModifyForm({
      leaveType: request.leaveType,
      durationType: request.durationType,
      startDate: new Date(request.startDate).toISOString().split("T")[0],
      endDate: new Date(request.endDate).toISOString().split("T")[0],
      reason: request.reason || "",
      remark: "",
    });
  };

  const handleModifySubmit = async (event) => {
    event.preventDefault();
    if (!modifyTarget) return;
    await reviewRequest(modifyTarget._id, "modify", {
      remark: modifyForm.remark,
      updatedRequest: {
        leaveType: modifyForm.leaveType,
        durationType: modifyForm.durationType,
        startDate: modifyForm.startDate,
        endDate: modifyForm.durationType === "multiple_days" ? modifyForm.endDate : modifyForm.startDate,
        reason: modifyForm.reason,
      },
    });
    setModifyTarget(null);
  };

  return (
    <div>
      {!embedded ? <AdminNav /> : null}

      <div className="px-4 py-6 md:px-8">
        <h1 className="mb-5 text-center text-2xl font-bold text-blue-950">
          Attendance and Leave Control
        </h1>

        <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Employee</p>
              <p className="text-lg font-semibold text-gray-900">{employee?.name || "Loading..."}</p>
              <p className="text-sm text-gray-600">{employee?.email || "-"}</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                value={year}
                onChange={(event) => setYear(Number(event.target.value) || new Date().getFullYear())}
                className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase text-blue-700">CL Balance</p>
            <p className="mt-2 text-2xl font-bold text-blue-950">{Number(leaveBalance?.clBalance || 0).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-700">EL Balance</p>
            <p className="mt-2 text-2xl font-bold text-emerald-800">{Number(leaveBalance?.elBalance || 0).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
            <p className="text-xs font-semibold uppercase text-rose-700">LOP Used</p>
            <p className="mt-2 text-2xl font-bold text-rose-800">{Number(leaveBalance?.lopUsed || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
            <p className="text-xs font-semibold uppercase text-indigo-700">Year Total Credited</p>
            <p className="mt-2 text-2xl font-bold text-indigo-900">{totalCredited.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
            <p className="text-xs font-semibold uppercase text-cyan-700">Year Total Used</p>
            <p className="mt-2 text-2xl font-bold text-cyan-900">{totalUsed.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
            <p className="text-xs font-semibold uppercase text-violet-700">Remaining Leaves</p>
            <p className="mt-2 text-2xl font-bold text-violet-900">{totalAvailable.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase text-amber-700">Half Days</p>
            <p className="mt-2 text-2xl font-bold text-amber-900">{totalHalfDays.toFixed(0)}</p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-xs font-semibold uppercase text-red-700">Absent Days</p>
            <p className="mt-2 text-2xl font-bold text-red-900">{Number(yearTotals.absentDays || 0).toFixed(0)}</p>
          </div>
          <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase text-teal-700">Requests This Year</p>
            <p className="mt-2 text-2xl font-bold text-teal-900">{totalRequests.toFixed(0)}</p>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Year-End Carry Forward</h2>
            <button
              type="button"
              disabled={carryLoading}
              onClick={handleCarryForward}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {carryLoading ? "Processing..." : `Carry ${year - 1} to ${year}`}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
              <p className="text-xs font-semibold uppercase text-blue-700">Prev Year CL ({year - 1})</p>
              <p className="mt-1 text-xl font-bold text-blue-900">{Number(previousYearBalance?.clBalance || 0).toFixed(2)}</p>
            </div>
            <div className="rounded-md border border-emerald-100 bg-emerald-50 p-3">
              <p className="text-xs font-semibold uppercase text-emerald-700">Prev Year EL ({year - 1})</p>
              <p className="mt-1 text-xl font-bold text-emerald-900">{Number(previousYearBalance?.elBalance || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Manual Leave Balance Control</h2>
          <form onSubmit={handleManualBalanceSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <select
              name="mode"
              value={manualBalanceForm.mode}
              onChange={handleManualBalanceChange}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="delta">Add / Deduct (Delta)</option>
              <option value="set">Set Absolute Value</option>
            </select>
            <input
              type="number"
              name="clValue"
              value={manualBalanceForm.clValue}
              onChange={handleManualBalanceChange}
              step="0.5"
              placeholder={manualBalanceForm.mode === "set" ? "CL Final" : "CL +/-"}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="elValue"
              value={manualBalanceForm.elValue}
              onChange={handleManualBalanceChange}
              step="0.5"
              placeholder={manualBalanceForm.mode === "set" ? "EL Final" : "EL +/-"}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="lopValue"
              value={manualBalanceForm.lopValue}
              onChange={handleManualBalanceChange}
              step="0.5"
              placeholder={manualBalanceForm.mode === "set" ? "LOP Final" : "LOP +/-"}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              name="reason"
              value={manualBalanceForm.reason}
              onChange={handleManualBalanceChange}
              placeholder="Reason (required for audit)"
              required
              className="rounded-md border border-gray-300 px-3 py-2 text-sm md:col-span-2"
            />
            <button
              type="submit"
              disabled={balanceAdjustLoading}
              className="rounded-md bg-indigo-900 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {balanceAdjustLoading ? "Updating..." : "Update Leave Balance"}
            </button>
          </form>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Manual Attendance Control</h2>
          <form onSubmit={handleManualSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <input type="date" name="date" value={manualAttendance.date} onChange={handleManualChange} required className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <select name="status" value={manualAttendance.status} onChange={handleManualChange} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
            </select>
            <input type="text" name="note" value={manualAttendance.note} onChange={handleManualChange} placeholder="Optional note" className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <button type="submit" disabled={loading} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Updating..." : "Update Attendance"}
            </button>
          </form>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Add Compensation Leave</h2>
          <form onSubmit={handleCompensationSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <select name="leaveType" value={compensationForm.leaveType} onChange={handleCompensationChange} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="CL">CL</option>
              <option value="EL">EL</option>
            </select>
            <input type="number" name="amount" value={compensationForm.amount} onChange={handleCompensationChange} placeholder="Amount" min="0.5" step="0.5" required className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <input type="text" name="reason" value={compensationForm.reason} onChange={handleCompensationChange} placeholder="Reason" className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <button type="submit" disabled={loading} className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70">Add Compensation</button>
          </form>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-900 text-left text-xs uppercase text-white">
                  <th className="px-3 py-2">Applied On</th>
                  <th className="px-3 py-2">Leave</th>
                  <th className="px-3 py-2">Dates</th>
                  <th className="px-3 py-2">Units</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.length > 0 ? leaveRequests.map((request) => (
                  <tr key={request._id} className="border-b border-gray-200">
                    <td className="px-3 py-2">{new Date(request.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-3 py-2">{request.leaveType} ({request.durationType.replaceAll("_", " ")})</td>
                    <td className="px-3 py-2">{new Date(request.startDate).toLocaleDateString("en-IN")} to {new Date(request.endDate).toLocaleDateString("en-IN")}</td>
                    <td className="px-3 py-2">{Number(request.totalUnits || 0).toFixed(2)}</td>
                    <td className="px-3 py-2"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClasses[request.status] || "bg-gray-100 text-gray-700"}`}>{request.status}</span></td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" disabled={loading} onClick={() => reviewRequest(request._id, "approve", { remark: "Approved by admin" })} className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700">Approve</button>
                        <button type="button" disabled={loading} onClick={() => reviewRequest(request._id, "reject", { remark: "Rejected by admin" })} className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700">Reject</button>
                        <button type="button" disabled={loading} onClick={() => openModifyDialog(request)} className="rounded-md bg-blue-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-800">Modify</button>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan={6} className="px-3 py-4 text-center text-gray-500">No leave requests found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Attendance</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Month</label>
              <select value={attendanceMonth} onChange={(event) => setAttendanceMonth(Number(event.target.value))} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                {Array.from({ length: 12 }).map((_, index) => (
                  <option key={index + 1} value={index + 1}>{new Date(2000, index, 1).toLocaleString("en-IN", { month: "long" })}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3"><p className="text-xs font-semibold uppercase text-emerald-700">Present</p><p className="mt-1 text-xl font-bold text-emerald-800">{attendanceSummary.present}</p></div>
            <div className="rounded-md border border-red-200 bg-red-50 p-3"><p className="text-xs font-semibold uppercase text-red-700">Absent</p><p className="mt-1 text-xl font-bold text-red-800">{attendanceSummary.absent}</p></div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3"><p className="text-xs font-semibold uppercase text-amber-700">Half Day</p><p className="mt-1 text-xl font-bold text-amber-800">{attendanceSummary.halfDay}</p></div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead><tr className="bg-blue-900 text-left text-xs uppercase text-white"><th className="px-3 py-2">Date</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Note</th></tr></thead>
              <tbody>
                {attendanceRecords.length > 0 ? attendanceRecords.map((row) => (
                  <tr key={row._id} className="border-b border-gray-200">
                    <td className="px-3 py-2">{new Date(row.date).toLocaleDateString("en-IN")}</td>
                    <td className="px-3 py-2">{row.status}</td>
                    <td className="px-3 py-2">{row.note || "-"}</td>
                  </tr>
                )) : <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-500">No attendance records found for this month</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Monthly Stored Leave and Attendance Summary ({year})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900 text-left text-xs uppercase text-white">
                  <th className="px-3 py-2">Month</th>
                  <th className="px-3 py-2">Present</th>
                  <th className="px-3 py-2">Absent</th>
                  <th className="px-3 py-2">Half Day</th>
                  <th className="px-3 py-2">Leave Units</th>
                  <th className="px-3 py-2">CL Credited</th>
                  <th className="px-3 py-2">EL Credited</th>
                  <th className="px-3 py-2">CL Used</th>
                  <th className="px-3 py-2">EL Used</th>
                  <th className="px-3 py-2">LOP Used</th>
                  <th className="px-3 py-2">Req (P/A/R/M)</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummary.length > 0 ? monthlySummary.map((monthRow) => (
                  <tr key={`${monthRow.year}-${monthRow.month}`} className="border-b border-gray-200">
                    <td className="px-3 py-2">{new Date(monthRow.year, monthRow.month - 1, 1).toLocaleString("en-IN", { month: "long" })}</td>
                    <td className="px-3 py-2">{Number(monthRow.presentDays || 0).toFixed(0)}</td>
                    <td className="px-3 py-2">{Number(monthRow.absentDays || 0).toFixed(0)}</td>
                    <td className="px-3 py-2">{Number(monthRow.halfDays || 0).toFixed(0)}</td>
                    <td className="px-3 py-2">{Number(monthRow.leaveUnits || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">{Number(monthRow.clCredited || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">{Number(monthRow.elCredited || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">{Number(monthRow.clUsed || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">{Number(monthRow.elUsed || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">{Number(monthRow.lopUsed || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">{Number(monthRow.pendingRequests || 0)} / {Number(monthRow.approvedRequests || 0)} / {Number(monthRow.rejectedRequests || 0)} / {Number(monthRow.modifiedRequests || 0)}</td>
                  </tr>
                )) : <tr><td colSpan={11} className="px-3 py-4 text-center text-gray-500">No monthly summary found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {message ? <p className="mt-4 text-sm font-medium text-green-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
      </div>

      {modifyTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Modify Leave Request</h3>
            <form onSubmit={handleModifySubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <select name="leaveType" value={modifyForm.leaveType} onChange={handleModifyChange} className="rounded-md border border-gray-300 px-3 py-2 text-sm"><option value="CL">CL</option><option value="EL">EL</option></select>
              <select name="durationType" value={modifyForm.durationType} onChange={handleModifyChange} className="rounded-md border border-gray-300 px-3 py-2 text-sm"><option value="half_day">Half Day</option><option value="full_day">Full Day</option><option value="multiple_days">Multiple Days</option></select>
              <input type="date" name="startDate" value={modifyForm.startDate} onChange={handleModifyChange} required className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
              <input type="date" name="endDate" value={modifyForm.durationType === "multiple_days" ? modifyForm.endDate : modifyForm.startDate} onChange={handleModifyChange} disabled={modifyForm.durationType !== "multiple_days"} required={modifyForm.durationType === "multiple_days"} className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100" />
              <textarea name="reason" value={modifyForm.reason} onChange={handleModifyChange} placeholder="Updated reason" rows={2} className="rounded-md border border-gray-300 px-3 py-2 text-sm md:col-span-2" />
              <textarea name="remark" value={modifyForm.remark} onChange={handleModifyChange} placeholder="Admin remark" rows={2} className="rounded-md border border-gray-300 px-3 py-2 text-sm md:col-span-2" />
              <div className="flex justify-end gap-2 md:col-span-2">
                <button type="button" onClick={() => setModifyTarget(null)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={loading} className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70">Save Modification</button>
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
