import React, { useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { Link, useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import Footer from "../../Pages/HomePage/Footer";
import axios from "axios";

const EmployeeCard = ({ employee, isActive, balance }) => {
  const cl = Number(balance?.clBalance || 0).toFixed(1);
  const el = Number(balance?.elBalance || 0).toFixed(1);
  const lop = Number(balance?.lopUsed || 0).toFixed(1);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          isActive ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={employee.profilePic}
            alt={employee.name}
            className="h-12 w-12 rounded-full border border-slate-200 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-slate-900">
              {employee.name}
            </p>
            <p className="truncate text-xs text-slate-600">{employee.email}</p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-2 text-center">
          <p className="text-[10px] font-semibold uppercase text-blue-700">CL</p>
          <p className="text-sm font-bold text-blue-900">{cl}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-2 text-center">
          <p className="text-[10px] font-semibold uppercase text-emerald-700">EL</p>
          <p className="text-sm font-bold text-emerald-900">{el}</p>
        </div>
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-2 text-center">
          <p className="text-[10px] font-semibold uppercase text-amber-700">LOP</p>
          <p className="text-sm font-bold text-amber-900">{lop}</p>
        </div>
      </div>

      <Link
        to={`/admin-dashboard/attendance/${employee._id}`}
        className="mt-4 block rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Open Attendance
      </Link>
    </div>
  );
};

const AdminEmployeeAttendence = ({ embedded = false }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { decodedToken } = useJwt(token);

  const [activeEmployees, setActiveEmployees] = useState([]);
  const [inactiveEmployees, setInactiveEmployees] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;
    if (tokenExpiration && tokenExpiration < Date.now()) {
      localStorage.removeItem("token");
      navigate("/admin-login");
    }
  }, [decodedToken, navigate, token]);

  const fetchLeaveBalances = async (employees, authToken) => {
    if (!employees.length) {
      setLeaveBalances({});
      return;
    }

    const requests = employees.map((employee) =>
      axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/leave/balance/${employee._id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { year: currentYear },
        }
      )
    );

    const results = await Promise.allSettled(requests);
    const nextBalances = {};

    results.forEach((result, index) => {
      const employeeId = employees[index]._id;
      if (result.status === "fulfilled" && result.value.status === 200) {
        nextBalances[employeeId] = result.value.data?.leaveBalance || {};
      } else {
        nextBalances[employeeId] = { clBalance: 0, elBalance: 0, lopUsed: 0 };
      }
    });

    setLeaveBalances(nextBalances);
  };

  useEffect(() => {
    const fetchAllEmployee = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("token");
        if (!authToken) {
          navigate("/admin-login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (response.status === 200) {
          const allEmployees = response?.data?.allEmployees || [];
          const apiActive = response?.data?.activeEmployees || [];
          const apiInactive = response?.data?.inactiveEmployees || [];

          const nextActive =
            apiActive.length > 0 || apiInactive.length > 0
              ? apiActive
              : allEmployees.filter((emp) => emp.activeStatus);
          const nextInactive =
            apiActive.length > 0 || apiInactive.length > 0
              ? apiInactive
              : allEmployees.filter((emp) => !emp.activeStatus);

          setActiveEmployees(nextActive);
          setInactiveEmployees(nextInactive);

          await fetchLeaveBalances([...nextActive, ...nextInactive], authToken);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEmployee();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      {!embedded ? <AdminNav /> : null}

      <div className="px-4 py-6 md:px-8">
        <section className="mt-1">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-700">Active Employees</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              {activeEmployees.length}
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : activeEmployees.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeEmployees.map((employee) => (
                <EmployeeCard
                  key={employee._id}
                  employee={employee}
                  isActive
                  balance={leaveBalances[employee._id]}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              No active employees found.
            </p>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-rose-700">Inactive Employees</h2>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
              {inactiveEmployees.length}
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : inactiveEmployees.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {inactiveEmployees.map((employee) => (
                <EmployeeCard
                  key={employee._id}
                  employee={employee}
                  isActive={false}
                  balance={leaveBalances[employee._id]}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              No inactive employees found.
            </p>
          )}
        </section>
      </div>

      {!embedded ? <Footer /> : null}
    </div>
  );
};

export default AdminEmployeeAttendence;
