import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeNavbar from "./EmployeeNavbar";
import Footer from "../HomePage/Footer";

const statusBadgeClasses = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  modified: "bg-blue-100 text-blue-700",
};

const EmployeeLeaves = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [attendanceMonth, setAttendanceMonth] = useState(new Date().getMonth() + 1);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "CL",
    durationType: "full_day",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const token = useMemo(() => localStorage.getItem("token"), []);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const fetchLeaveData = async () => {
    if (!token) {
      navigate("/employee-login");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [balanceResponse, requestsResponse, attendanceResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/employee/leave/balance`, {
          headers,
          params: { year: currentYear },
        }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/employee/leave/requests`, {
          headers,
        }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/employee/leave/attendance`, {
          headers,
          params: { year: currentYear, month: attendanceMonth },
        }),
      ]);

      if (balanceResponse.status === 200) {
        setLeaveBalance(balanceResponse.data.leaveBalance);
      }
      if (requestsResponse.status === 200) {
        setLeaveRequests(requestsResponse.data.leaveRequests || []);
      }
      if (attendanceResponse.status === 200) {
        setAttendanceRecords(attendanceResponse.data.attendance || []);
      }
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to fetch leave data");
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [attendanceMonth]);

  const attendanceSummary = attendanceRecords.reduce(
    (summary, row) => {
      if (row.status === "Absent") {
        summary.absent += 1;
      } else if (row.status === "Half Day") {
        summary.halfDay += 1;
      } else {
        summary.present += 1;
      }
      return summary;
    },
    { present: 0, absent: 0, halfDay: 0 }
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setLeaveForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleApplyLeave = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const payload = {
      leaveType: leaveForm.leaveType,
      durationType: leaveForm.durationType,
      startDate: leaveForm.startDate,
      endDate:
        leaveForm.durationType === "multiple_days"
          ? leaveForm.endDate
          : leaveForm.startDate,
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

      <div className={`${embedded ? "px-0 py-2 md:px-0" : "px-4 py-6 md:px-8"}`}>
        <h1 className="mb-5 text-center text-2xl font-bold text-blue-950">
          Leave Management
        </h1>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase text-blue-700">CL Balance</p>
            <p className="mt-2 text-2xl font-bold text-blue-950">
              {Number(leaveBalance?.clBalance || 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-700">EL Balance</p>
            <p className="mt-2 text-2xl font-bold text-emerald-800">
              {Number(leaveBalance?.elBalance || 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
            <p className="text-xs font-semibold uppercase text-rose-700">LOP Used</p>
            <p className="mt-2 text-2xl font-bold text-rose-800">
              {Number(leaveBalance?.lopUsed || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Apply Leave</h2>
          <form onSubmit={handleApplyLeave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Leave Type</label>
              <select
                name="leaveType"
                value={leaveForm.leaveType}
                onChange={handleFormChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="CL">CL</option>
                <option value="EL">EL</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Duration</label>
              <select
                name="durationType"
                value={leaveForm.durationType}
                onChange={handleFormChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="half_day">Half Day</option>
                <option value="full_day">Full Day</option>
                <option value="multiple_days">Multiple Days</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={leaveForm.startDate}
                onChange={handleFormChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={leaveForm.durationType === "multiple_days" ? leaveForm.endDate : leaveForm.startDate}
                onChange={handleFormChange}
                required={leaveForm.durationType === "multiple_days"}
                disabled={leaveForm.durationType !== "multiple_days"}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Reason</label>
              <textarea
                name="reason"
                value={leaveForm.reason}
                onChange={handleFormChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Optional reason"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Apply Leave"}
              </button>
            </div>
          </form>

          {message ? <p className="mt-3 text-sm font-medium text-green-700">{message}</p> : null}
          {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">My Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-900 text-left text-xs uppercase text-white">
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
                    <tr key={request._id} className="border-b border-gray-200">
                      <td className="px-3 py-2">
                        {new Date(request.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-3 py-2">{request.leaveType}</td>
                      <td className="px-3 py-2">
                        {new Date(request.startDate).toLocaleDateString("en-IN")} to{" "}
                        {new Date(request.endDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-3 py-2">{request.durationType.replaceAll("_", " ")}</td>
                      <td className="px-3 py-2">{Number(request.totalUnits || 0).toFixed(2)}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            statusBadgeClasses[request.status] || "bg-gray-100 text-gray-700"
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
                    <td colSpan={7} className="px-3 py-4 text-center text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">My Attendance</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Month</label>
              <select
                value={attendanceMonth}
                onChange={(event) => setAttendanceMonth(Number(event.target.value))}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {Array.from({ length: 12 }).map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {new Date(2000, index, 1).toLocaleString("en-IN", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-semibold uppercase text-emerald-700">Present</p>
              <p className="mt-1 text-xl font-bold text-emerald-800">{attendanceSummary.present}</p>
            </div>
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-semibold uppercase text-red-700">Absent</p>
              <p className="mt-1 text-xl font-bold text-red-800">{attendanceSummary.absent}</p>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold uppercase text-amber-700">Half Day</p>
              <p className="mt-1 text-xl font-bold text-amber-800">{attendanceSummary.halfDay}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-900 text-left text-xs uppercase text-white">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((row) => (
                    <tr key={row._id} className="border-b border-gray-200">
                      <td className="px-3 py-2">
                        {new Date(row.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-3 py-2">{row.status}</td>
                      <td className="px-3 py-2">{row.note || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-center text-gray-500">
                      No attendance records found for this month
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
