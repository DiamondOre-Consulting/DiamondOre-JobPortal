import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MonthYearRangePicker from "../ui/month-year-range-picker";
import { formatIndianNumber } from "../../lib/number-format";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const emptyGoalSheetFilter = {
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
};

const monthNames = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const calculateTargetAchievedPercentage = (revenueValue, targetValue) => {
  const parsedRevenue = Number(revenueValue) || 0;
  const parsedTarget = Number(targetValue) || 0;

  if (!parsedTarget) {
    return 0;
  }

  return (parsedRevenue / parsedTarget) * 100;
};

const EmpGoalSheet = () => {
  const [goalSheetDetails, setGoalSheetDetails] = useState([]);
  const [minYear, setMinYear] = useState(0);
  const [maxYear, setMaxYear] = useState(0);
  const [tickermessage, setgetTickerMessage] = useState("");
  const [changeRequests, setChangeRequests] = useState([]);
  const [requestMessage, setRequestMessage] = useState("");
  const [portalMessage, setPortalMessage] = useState("");
  const [requestSheetMessage, setRequestSheetMessage] = useState("");
  const [requestSheetMessageType, setRequestSheetMessageType] = useState("info");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [isRequestSheetOpen, setIsRequestSheetOpen] = useState(false);
  const [isAllRequestsSheetOpen, setIsAllRequestsSheetOpen] = useState(false);
  const [goalSheetFilter, setGoalSheetFilter] = useState({
    ...emptyGoalSheetFilter,
  });
  const [appliedGoalSheetFilter, setAppliedGoalSheetFilter] = useState({
    ...emptyGoalSheetFilter,
  });

  const fetchGoalSheetData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/employee/my-goalsheet`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { year: "null" },
        }
      );

      if (response.status === 200) {
        const allDetails = response?.data?.goalSheetDetails || [];
        setGoalSheetDetails(allDetails);
        setMinYear(Number(response.data?.minYear) || 0);
        setMaxYear(Number(response.data?.maxYear) || 0);
        setgetTickerMessage(response?.data?.YTDLessTickerMessage || "");
        setChangeRequests(response?.data?.changeRequests || []);
      }
    } catch (error) {
      console.error("Failed to fetch employee goal sheet", error);
      toast.error(error?.response?.data?.message || "Failed to fetch goal sheet");
    }
  };

  useEffect(() => {
    fetchGoalSheetData();
  }, []);

  const availableYearOptions = useMemo(() => {
    if (minYear && maxYear && maxYear >= minYear) {
      const years = [];
      for (let year = maxYear; year >= minYear; year -= 1) {
        years.push(year);
      }
      return years;
    }

    return [...new Set(goalSheetDetails.map((detail) => Number(detail.year)))]
      .filter(Boolean)
      .sort((a, b) => b - a);
  }, [goalSheetDetails, minYear, maxYear]);

  const hasAppliedGoalSheetFilter = Boolean(
    appliedGoalSheetFilter.fromMonth ||
      appliedGoalSheetFilter.fromYear ||
      appliedGoalSheetFilter.toMonth ||
      appliedGoalSheetFilter.toYear
  );

  const sortedGoalSheetDetails = useMemo(() => {
    return [...goalSheetDetails].sort((a, b) => {
      if (b.year !== a.year) {
        return b.year - a.year;
      }
      return b.month - a.month;
    });
  }, [goalSheetDetails]);

  const filteredGoalSheetDetails = useMemo(() => {
    if (!hasAppliedGoalSheetFilter) {
      return sortedGoalSheetDetails;
    }

    const fromRangeValue =
      appliedGoalSheetFilter.fromMonth && appliedGoalSheetFilter.fromYear
        ? Number(appliedGoalSheetFilter.fromYear) * 12 +
          Number(appliedGoalSheetFilter.fromMonth)
        : null;

    const toRangeValue =
      appliedGoalSheetFilter.toMonth && appliedGoalSheetFilter.toYear
        ? Number(appliedGoalSheetFilter.toYear) * 12 +
          Number(appliedGoalSheetFilter.toMonth)
        : null;

    return sortedGoalSheetDetails.filter((detail) => {
      const detailRangeValue = Number(detail.year) * 12 + Number(detail.month);

      if (fromRangeValue !== null && detailRangeValue < fromRangeValue) {
        return false;
      }

      if (toRangeValue !== null && detailRangeValue > toRangeValue) {
        return false;
      }

      return true;
    });
  }, [sortedGoalSheetDetails, appliedGoalSheetFilter, hasAppliedGoalSheetFilter]);

  const grandTotal = useMemo(() => {
    return filteredGoalSheetDetails.reduce(
      (accumulator, detail) => {
        accumulator.noOfJoinings += Number(detail.noOfJoinings) || 0;
        accumulator.revenue += Number(detail.revenue) || 0;
        accumulator.cost += Number(detail.cost) || 0;
        accumulator.target += Number(detail.target) || 0;
        accumulator.incentive += Number(detail.incentive) || 0;
        return accumulator;
      },
      {
        noOfJoinings: 0,
        revenue: 0,
        cost: 0,
        target: 0,
        incentive: 0,
      }
    );
  }, [filteredGoalSheetDetails]);

  const grandTotalYTD = useMemo(() => {
    if (!grandTotal.cost) {
      return 0;
    }
    return grandTotal.revenue / grandTotal.cost;
  }, [grandTotal]);

  const targetAchievedPercentage = useMemo(() => {
    return calculateTargetAchievedPercentage(grandTotal.revenue, grandTotal.target);
  }, [grandTotal]);

  const handleGoalSheetFilterChange = (field, value) => {
    setGoalSheetFilter((previousFilter) => ({
      ...previousFilter,
      [field]: value,
    }));
  };

  const handleApplyGoalSheetFilter = () => {
    const { fromMonth, fromYear, toMonth, toYear } = goalSheetFilter;
    const hasFromSelection = Boolean(fromMonth || fromYear);
    const hasToSelection = Boolean(toMonth || toYear);

    if (hasFromSelection && (!fromMonth || !fromYear)) {
      toast.error("Select both from month and from year");
      return false;
    }

    if (hasToSelection && (!toMonth || !toYear)) {
      toast.error("Select both to month and to year");
      return false;
    }

    const fromRangeValue =
      fromMonth && fromYear ? Number(fromYear) * 12 + Number(fromMonth) : null;
    const toRangeValue =
      toMonth && toYear ? Number(toYear) * 12 + Number(toMonth) : null;

    if (
      fromRangeValue !== null &&
      toRangeValue !== null &&
      fromRangeValue > toRangeValue
    ) {
      toast.error("From month-year cannot be after to month-year");
      return false;
    }

    setAppliedGoalSheetFilter({
      fromMonth,
      fromYear,
      toMonth,
      toYear,
    });

    return true;
  };

  const handleResetGoalSheetFilter = () => {
    setGoalSheetFilter({ ...emptyGoalSheetFilter });
    setAppliedGoalSheetFilter({ ...emptyGoalSheetFilter });
  };

  const handleDownloadGoalSheetExcel = () => {
    if (!filteredGoalSheetDetails.length) {
      toast.error("No goal sheet data available to download");
      return;
    }

    const excelRows = filteredGoalSheetDetails.map((detail) => ({
      Year: detail.year,
      Month: monthNames[detail.month] || detail.month,
      Joinings: Number(detail.noOfJoinings) || 0,
      "Overall Revenue": Number(detail.revenue) || 0,
      Cost: Number(detail.cost) || 0,
      Target: Number(detail.target) || 0,
      "Cumulative Cost": Number(detail.cumulativeCost) || 0,
      "Cumulative Revenue": Number(detail.cumulativeRevenue) || 0,
      YTD: Number(detail.achYTD) || 0,
      MTD: Number(detail.achMTD) || 0,
      "Target Achieved (%)": Number(
        calculateTargetAchievedPercentage(detail.revenue, detail.target)
      ),
      Incentive: Number(detail.incentive) || 0,
      Leakage: detail.leakage ?? "N/A",
    }));

    excelRows.push({
      Year: "Grand Total",
      Month: "",
      Joinings: grandTotal.noOfJoinings,
      "Overall Revenue": grandTotal.revenue,
      Cost: grandTotal.cost,
      Target: grandTotal.target,
      "Cumulative Cost": "",
      "Cumulative Revenue": "",
      YTD: Number(grandTotalYTD.toFixed(2)),
      MTD: "",
      "Target Achieved (%)": Number(targetAchievedPercentage.toFixed(2)),
      Incentive: grandTotal.incentive,
      Leakage: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Goal Sheet");

    const fileSuffix = hasAppliedGoalSheetFilter ? "filtered" : "all-records";
    XLSX.writeFile(workbook, `my-goal-sheet-${fileSuffix}.xlsx`);
  };

  const getRequestStatusBadgeClass = (statusValue) => {
    switch (statusValue) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "in_review":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const formatRequestStatus = (statusValue) => {
    if (!statusValue) {
      return "Pending";
    }

    return statusValue
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleRaiseGoalSheetRequest = async (event) => {
    event?.preventDefault?.();

    const trimmedMessage = requestMessage.trim();
    if (trimmedMessage.length < 5) {
      const message = "Please write at least 5 characters";
      setRequestSheetMessage(message);
      setRequestSheetMessageType("error");
      toast.error(message);
      return;
    }

    try {
      setIsSubmittingRequest(true);
      setPortalMessage("");
      setRequestSheetMessage("");
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/employee/my-goalsheet/request-change`,
        { message: trimmedMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const successMessage =
          response?.data?.message || "Request submitted successfully";
        setPortalMessage(successMessage);
        setRequestSheetMessage(successMessage);
        setRequestSheetMessageType("success");
        setRequestMessage("");
        setIsRequestSheetOpen(false);
        toast.success(successMessage);
        await fetchGoalSheetData();
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to submit request";
      toast.error(errorMessage);
      setPortalMessage(errorMessage);
      setRequestSheetMessage(errorMessage);
      setRequestSheetMessageType("error");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />

      {tickermessage && (
        <div className="mx-2 my-4 mx-auto flex w-full items-center rounded-md bg-red-200 px-4 py-4 text-lg animate-pulse">
          <svg viewBox="0 0 24 24" className="mr-3 h-5 w-5 text-red-600 sm:h-5 sm:w-5">
            <path
              fill="currentColor"
              d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
            />
          </svg>
          <span className="text-red-800">{tickermessage}</span>
        </div>
      )}

      <div className="px-4 pt-2 pb-6 md:px-4">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-blue-950 md:text-4xl">Goal Sheet</h1>
        </div>

        <div className="mb-5 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-slate-50/85 px-4 py-3">
            <h2 className="text-lg font-semibold text-blue-950">
              Raise Request / Changes
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Submit any goal sheet correction request and view all request statuses in sheet view.
            </p>
          </div>
          <div className="grid gap-4 px-4 py-4 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <h3 className="text-sm font-semibold text-gray-800">Submit Request</h3>
              <p className="mt-1 text-sm text-gray-600">
                Open the side sheet to submit a correction or change request.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Sheet open={isRequestSheetOpen} onOpenChange={setIsRequestSheetOpen}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        setRequestSheetMessage("");
                        setRequestSheetMessageType("info");
                      }}
                      className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                    >
                      Raise Request
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="overflow-y-auto sm:max-w-xl">
                    <SheetHeader className="border-b border-gray-100 pb-4">
                      <SheetTitle>Raise Request / Changes</SheetTitle>
                      <SheetDescription>
                        Share your required goal sheet change details.
                      </SheetDescription>
                    </SheetHeader>

                    <form
                      onSubmit={handleRaiseGoalSheetRequest}
                      className="mt-6 space-y-4"
                    >
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Request Message
                        </label>
                        <textarea
                          rows={7}
                          value={requestMessage}
                          onChange={(event) => setRequestMessage(event.target.value)}
                          placeholder="Write your request here..."
                          required
                          minLength={5}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      {requestSheetMessage ? (
                        <p
                          className={`text-sm ${
                            requestSheetMessageType === "error"
                              ? "text-red-600"
                              : "text-green-700"
                          }`}
                        >
                          {requestSheetMessage}
                        </p>
                      ) : null}

                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRequestSheetOpen(false);
                            setRequestSheetMessage("");
                            setRequestSheetMessageType("info");
                          }}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleRaiseGoalSheetRequest}
                          disabled={isSubmittingRequest}
                          className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSubmittingRequest ? "Submitting..." : "Submit Request"}
                        </button>
                      </div>
                    </form>
                  </SheetContent>
                </Sheet>
                {portalMessage && (
                  <p className="text-xs font-medium text-blue-700">{portalMessage}</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <h3 className="text-sm font-semibold text-gray-800">All Requests</h3>
              <p className="mt-1 text-sm text-gray-600">
                Open sheet to view complete request history and status.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Sheet
                  open={isAllRequestsSheetOpen}
                  onOpenChange={setIsAllRequestsSheetOpen}
                >
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      View All Requests
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="overflow-y-auto sm:max-w-xl">
                    <SheetHeader className="border-b border-gray-100 pb-4">
                      <SheetTitle>All Request Status</SheetTitle>
                      <SheetDescription>
                        Complete list of requests raised from your goal sheet.
                      </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-2">
                      {changeRequests.length > 0 ? (
                        changeRequests.map((request) => (
                          <div
                            key={request?._id}
                            className="rounded-md border border-gray-200 bg-white p-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-gray-800">{request?.message}</p>
                              <span
                                className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getRequestStatusBadgeClass(
                                  request?.status
                                )}`}
                              >
                                {formatRequestStatus(request?.status)}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-gray-500">
                              Requested:{" "}
                              {request?.requestedAt
                                ? new Date(request.requestedAt).toLocaleString("en-IN")
                                : "N/A"}
                            </p>
                            {request?.adminRemark ? (
                              <p className="mt-1 text-[11px] text-gray-700">
                                Admin: {request.adminRemark}
                              </p>
                            ) : null}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No requests raised yet.</p>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
                <span className="text-xs font-medium text-gray-500">
                  Total: {changeRequests.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-100 via-blue-50 to-sky-100 p-3.5">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-300/55 blur-2xl" />
                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase leading-tight tracking-[0.1em] text-blue-800">
                    Joinings
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-blue-950">
                    {formatIndianNumber(grandTotal.noOfJoinings, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-100 via-cyan-50 to-sky-100 p-3.5">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-300/55 blur-2xl" />
                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase leading-tight tracking-[0.1em] text-cyan-800">
                    YTD
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                    {formatIndianNumber(grandTotalYTD, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 p-3.5">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-300/55 blur-2xl" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase leading-tight tracking-[0.1em] text-emerald-800">
                  Overall Revenue
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                  {formatIndianNumber(grandTotal.revenue)}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-3.5">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-300/55 blur-2xl" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase leading-tight tracking-[0.1em] text-amber-800">
                  Cost
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                  {formatIndianNumber(grandTotal.cost)}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-violet-200 bg-gradient-to-br from-violet-100 via-violet-50 to-fuchsia-100 p-3.5">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-300/50 blur-2xl" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase leading-tight tracking-[0.1em] text-violet-800">
                  Target
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                  {formatIndianNumber(grandTotal.target)}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100 p-3.5">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-300/55 blur-2xl" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase leading-tight tracking-[0.1em] text-rose-800">
                  Target Achieved (%)
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                  {formatIndianNumber(targetAchievedPercentage, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-slate-50/85 px-4 py-3">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <MonthYearRangePicker
                value={goalSheetFilter}
                years={availableYearOptions}
                monthNames={monthNames}
                onChange={handleGoalSheetFilterChange}
                onApply={handleApplyGoalSheetFilter}
                onReset={handleResetGoalSheetFilter}
                className="w-full sm:w-auto"
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="h-10 cursor-pointer rounded-lg bg-blue-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                  onClick={handleDownloadGoalSheetExcel}
                  title={
                    hasAppliedGoalSheetFilter
                      ? "Downloading filtered data"
                      : "No filter applied, downloading full data"
                  }
                >
                  Download Excel
                </button>
              </div>
            </div>
              </div>

              <div className="relative w-full overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 bg-blue-900 text-xs text-gray-100 shadow">
                <tr>
                  <th className="px-2 py-2">Year</th>
                  <th className="px-2 py-2">Month</th>
                  <th className="px-2 py-2">No. of Joinings</th>
                  <th className="px-2 py-2">Overall Revenue</th>
                  <th className="px-2 py-2">Cost</th>
                  <th className="px-2 py-2">Target</th>
                  <th className="px-2 py-2">Cumulative Cost</th>
                  <th className="px-2 py-2">Cumulative Revenue</th>
                  <th className="px-2 py-2">YTD</th>
                  <th className="px-2 py-2">MTD</th>
                  <th className="px-2 py-2">Target Achieved (%)</th>
                  <th className="px-2 py-2">Incentive</th>
                  <th className="px-2 py-2">Leakage</th>
                </tr>
              </thead>

              <tbody>
                {filteredGoalSheetDetails.length > 0 ? (
                  filteredGoalSheetDetails.map((detail) => (
                    <tr key={detail._id} className="text-center">
                      <td className="border px-2 py-2">{detail.year}</td>
                      <td className="border px-2 py-2">{monthNames[detail.month] || "Unknown"}</td>
                      <td className="border px-2 py-2">
                        {formatIndianNumber(detail.noOfJoinings, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="border px-2 py-2">{formatIndianNumber(detail.revenue)}</td>
                      <td className="border px-2 py-2">{formatIndianNumber(detail.cost)}</td>
                      <td className="border px-2 py-2">{formatIndianNumber(detail.target)}</td>
                      <td className="border px-2 py-2">{formatIndianNumber(detail.cumulativeCost)}</td>
                      <td className="border px-2 py-2">
                        {formatIndianNumber(detail.cumulativeRevenue, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td
                        className={`border px-2 py-2 ${
                          Number(detail.achYTD) < 2.5 ? "bg-red-400" : "bg-white"
                        }`}
                      >
                        {formatIndianNumber(detail.achYTD, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="border px-2 py-2">
                        {formatIndianNumber(detail.achMTD, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="border px-2 py-2">
                        {formatIndianNumber(
                          calculateTargetAchievedPercentage(detail.revenue, detail.target),
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                        %
                      </td>
                      <td
                        className="border px-2 py-2"
                        style={{ backgroundColor: detail?.incentiveStatusColor }}
                      >
                        {detail.incentive !== null && detail.incentive !== undefined
                          ? formatIndianNumber(detail.incentive)
                          : "N/A"}
                      </td>
                      <td className="border px-2 py-2">
                        {detail?.leakage !== null && detail?.leakage !== undefined
                          ? formatIndianNumber(detail.leakage)
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="border px-2 py-3 text-center">
                      No goal sheet data available
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr className="text-center font-semibold text-blue-950">
                  <td
                    colSpan={2}
                    className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3"
                  >
                    Grand Total
                  </td>
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                    {formatIndianNumber(grandTotal.noOfJoinings, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                    {formatIndianNumber(grandTotal.revenue)}
                  </td>
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                    {formatIndianNumber(grandTotal.cost)}
                  </td>
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                    {formatIndianNumber(grandTotal.target)}
                  </td>
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3" />
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3" />
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                    {formatIndianNumber(grandTotalYTD, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3" />
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                    {formatIndianNumber(targetAchievedPercentage, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    %
                  </td>
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                    {formatIndianNumber(grandTotal.incentive)}
                  </td>
                  <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3" />
                </tr>
              </tfoot>
            </table>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EmpGoalSheet;
