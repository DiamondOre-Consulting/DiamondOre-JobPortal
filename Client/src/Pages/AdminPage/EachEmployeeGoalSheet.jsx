import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Calculator, Pencil, Trash2 } from "lucide-react";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import Footer from "../HomePage/Footer";
import MonthYearRangePicker from "../../Components/ui/month-year-range-picker";
import { formatIndianNumber } from "../../lib/number-format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../Components/ui/sheet";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emptyGoalSheetFilter = {
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
};

const emptyGoalSheetTotals = {
  noOfJoinings: 0,
  revenue: 0,
  cost: 0,
  target: 0,
};

const calculateRevenueAchievedPercentage = (revenueValue, targetValue) => {
  const parsedRevenue = Number(revenueValue) || 0;
  const parsedTarget = Number(targetValue) || 0;

  if (!parsedTarget) {
    return 0;
  }

  return (parsedRevenue / parsedTarget) * 100;
};

const EachEmployeeGoalSheet = () => {
  const { id } = useParams();
  const { employeename } = useParams();

  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const [editMode, setEditMode] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [goalsheetform, setGoalSheetForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [goalSheetData, setGoalSheetData] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [prevYear, setPrevYear] = useState(null);
  const [goalListId, setGoalListId] = useState();
  const [prevMonth, setPrevMonth] = useState(null);
  const [noOfJoinings, setNoOfJoinings] = useState(0);
  const [revenue, setRevenue] = useState(null);
  const [cost, setCost] = useState(null);
  const [incentive, setInsentive] = useState(null);
  const [leakage, setLeakage] = useState(null);
  const [showLeakageCalculator, setShowLeakageCalculator] = useState(false);
  const [leakageAmountA, setLeakageAmountA] = useState("");
  const [leakageAmountB, setLeakageAmountB] = useState("");
  const [showSubmitLoader, setShowSubmitLoader] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const [allGoalSheetData, setAllGoalSheetData] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [deletePopup,setDeletePopup] = useState(false)
  const joiningFileInputRef = useRef(null);

  const [mailYearSelectData,setMailYearSelectData] = useState([])
  const [mailSelectedYear,setMailSelectedYear] = useState(null)
  const [serverCurrentYear, setServerCurrentYear] = useState(
    new Date().getFullYear()
  );
  const [overallGoalSheetTotals, setOverallGoalSheetTotals] = useState(
    emptyGoalSheetTotals
  )
  const [goalSheetFilter, setGoalSheetFilter] = useState(() => ({
    ...emptyGoalSheetFilter,
  }));
  const [appliedGoalSheetFilter, setAppliedGoalSheetFilter] = useState(() => ({
    ...emptyGoalSheetFilter,
  }));
  const [goalSheetRequests, setGoalSheetRequests] = useState([]);
  const [updatingRequestId, setUpdatingRequestId] = useState("");
  const [showAllRequestsSheet, setShowAllRequestsSheet] = useState(false);

  const [selectedColor, setSelectedColor] = useState(null);

  const colors = [
    { name: "Orange", code: "#FFA500" },
    { name: "Green", code: "#008000" },
  ];

  const [sheetId,setSheetId]= useState(null)
  const [employee, setEmployee] = useState();

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

  const joiningMonth = useMemo(() => {
    if (!employee?.doj) {
      return null;
    }

    const parsedDate = new Date(employee.doj);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.getMonth() + 1;
    }

    const isoMatch = String(employee.doj).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const parsedMonth = Number(isoMatch[2]);
      return parsedMonth >= 1 && parsedMonth <= 12 ? parsedMonth : null;
    }

    const commonDateMatch = String(employee.doj).match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (commonDateMatch) {
      const parsedMonth = Number(commonDateMatch[2]);
      return parsedMonth >= 1 && parsedMonth <= 12 ? parsedMonth : null;
    }

    return null;
  }, [employee?.doj]);

  const effectiveCurrentYear = useMemo(() => {
    const clientCurrentYear = new Date().getFullYear();
    const apiCurrentYear = Number(serverCurrentYear);

    if (!apiCurrentYear) {
      return clientCurrentYear;
    }

    return Math.max(apiCurrentYear, clientCurrentYear);
  }, [serverCurrentYear]);

  const effectiveCurrentMonth = useMemo(() => {
    return new Date().getMonth() + 1;
  }, []);

  const getMonthRangeForYear = (selectedYearValue) => {
    const selectedYearNumber = Number(selectedYearValue);

    if (!selectedYearNumber) {
      return { minMonth: 1, maxMonth: 12 };
    }

    let minMonth = 1;
    let maxMonth = 12;

    if (joiningYear && joiningMonth && selectedYearNumber === joiningYear) {
      minMonth = Math.max(minMonth, joiningMonth);
    }

    if (selectedYearNumber === effectiveCurrentYear) {
      maxMonth = Math.min(maxMonth, effectiveCurrentMonth);
    }

    return { minMonth, maxMonth };
  };

  const isMonthDisabledForSelectedYear = (monthValue, selectedYearValue) => {
    const parsedMonth = Number(monthValue);
    const { minMonth, maxMonth } = getMonthRangeForYear(selectedYearValue);

    return parsedMonth < minMonth || parsedMonth > maxMonth;
  };

  const availableYearOptions = useMemo(() => {
    const yearSet = new Set((mailYearSelectData || []).map((yearValue) => Number(yearValue)));
    const currentYear = effectiveCurrentYear;

    if (joiningYear && joiningYear <= currentYear) {
      for (let yearValue = joiningYear; yearValue <= currentYear; yearValue += 1) {
        yearSet.add(yearValue);
      }
    } else {
      if (joiningYear) {
        yearSet.add(Number(joiningYear));
      }
      yearSet.add(currentYear);
    }

    if (yearSet.size === 0) {
      yearSet.add(currentYear);
    }

    return Array.from(yearSet).sort((a, b) => b - a);
  }, [mailYearSelectData, joiningYear, effectiveCurrentYear]);

  useEffect(() => {
    if (!goalsheetform) {
      return;
    }

    if (!year && availableYearOptions.length > 0) {
      setYear(String(availableYearOptions[0]));
    }
  }, [goalsheetform, year, availableYearOptions]);

  useEffect(() => {
    if (!year || !month) {
      return;
    }

    if (isMonthDisabledForSelectedYear(month, year)) {
      setMonth("");
    }
  }, [year, month, joiningYear, joiningMonth, effectiveCurrentYear, effectiveCurrentMonth]);

  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          setEmployee(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch employee data");
      }
    };

    getEmployeeData();
  }, []);

  // Submit the goal sheet form
  const handleSetGoalSheet = async (e) => {
    e.preventDefault();
    
    // Validate month and year
    if (!year || !month) {
      toast.error("Please select both year and month");
      return;
    }

    setShowSubmitLoader(true);

    try {
      const token = localStorage.getItem("token");

      // Convert values to numbers
      const noOfJoiningsNumber = Number(noOfJoinings);
      const revenueNumber = Number(revenue);
      const costNumber = Number(cost);
      const incentiveNumber = Number(incentive);
      const leakageNumber = Number(leakage);

      // Validate conversion
      if (
        isNaN(noOfJoiningsNumber) ||
        isNaN(revenueNumber) ||
        isNaN(costNumber) ||
        isNaN(incentiveNumber) ||
        isNaN(leakageNumber)
      ) {
        toast.error("One or more fields contain invalid numbers");
        setShowSubmitLoader(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/set-goalsheet`,
        {
          empId: id,
          year,
          month,
          noOfJoinings: noOfJoiningsNumber,
          revenue: revenueNumber,
          cost: costNumber,
          incentive: incentiveNumber,
          leakage: leakageNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setTrigger((prev) => prev + 1);
        toast.success("Goal sheet updated successfully!");
        setCost("");
        setRevenue("");
        setNoOfJoinings("");
        setYear("");
        setMonth("");
        setInsentive("");
        setLeakage("");
        setShowLeakageCalculator(false);
        setLeakageAmountA("");
        setLeakageAmountB("");
        setGoalSheetForm(false);
      }
    } catch (error) {
      console.error("Error setting goal sheet:", error);
      toast.error(error.response?.data?.message || "Failed to update goal sheet");
    } finally {
      setShowSubmitLoader(false);
    }
  };

  // Close the Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDeleteGoalSheet = async(e) => {
    e.preventDefault();
    setShowSubmitLoader(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/delete-goalsheet/${id}/${sheetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if(response.status === 200){
        setTrigger((prev) => prev + 1);
        toast.success(response.data.message);
      }
      setDeletePopup(false);
    } catch(err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to delete goal sheet");
    } finally {
      setShowSubmitLoader(false);
    }
  } 

  // getGoalSheet
  const [tickermessage, setgetTickerMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const hasAppliedGoalSheetFilter = Boolean(
    appliedGoalSheetFilter.fromMonth ||
      appliedGoalSheetFilter.fromYear ||
      appliedGoalSheetFilter.toMonth ||
      appliedGoalSheetFilter.toYear
  );

  useEffect(() => {
    const handleGoalSheet = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const baseUrl = `${import.meta.env.VITE_BASE_URL}/admin-confi/goalsheet/${id}`;
        const filterQuery = new URLSearchParams();

        if (appliedGoalSheetFilter.fromMonth && appliedGoalSheetFilter.fromYear) {
          filterQuery.set("fromMonth", appliedGoalSheetFilter.fromMonth);
          filterQuery.set("fromYear", appliedGoalSheetFilter.fromYear);
        }

        if (appliedGoalSheetFilter.toMonth && appliedGoalSheetFilter.toYear) {
          filterQuery.set("toMonth", appliedGoalSheetFilter.toMonth);
          filterQuery.set("toYear", appliedGoalSheetFilter.toYear);
        }

        const [allGoalSheetResponse, filteredGoalSheetResponse] =
          hasAppliedGoalSheetFilter
            ? await Promise.all([
                axios.get(baseUrl, { headers }),
                axios.get(`${baseUrl}?${filterQuery.toString()}`, { headers }),
              ])
            : [await axios.get(baseUrl, { headers }), null];

        if (allGoalSheetResponse.status === 200) {
          const allGoalSheetPayload = allGoalSheetResponse.data;
          const allGoalSheets = allGoalSheetPayload.goalSheets || [];
          const filteredGoalSheetPayload = filteredGoalSheetResponse?.data;
          const payloadCurrentYear = Number(allGoalSheetPayload.currentYear);
          const years = [
            ...new Set(
              allGoalSheets.flatMap((goalSheet) =>
                goalSheet.goalSheetDetails.map((detail) => detail.year)
              )
            ),
          ].sort((a, b) => b - a);

          setAllGoalSheetData(allGoalSheets);
          if (payloadCurrentYear) {
            setServerCurrentYear(payloadCurrentYear);
          }
          setOverallGoalSheetTotals(
            filteredGoalSheetPayload?.overallTotals ||
              allGoalSheetPayload.overallTotals ||
              emptyGoalSheetTotals
          );
          setgetTickerMessage(allGoalSheets[0]?.YTDLessTickerMessage || "");
          setGoalSheetRequests(
            filteredGoalSheetPayload?.changeRequests ||
              allGoalSheetPayload.changeRequests ||
              []
          );
          setMailYearSelectData(years);
          setFilteredData(
            filteredGoalSheetResponse?.status === 200
              ? filteredGoalSheetPayload.goalSheets || []
              : allGoalSheets
          );
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch goal sheet data"
        );
      }
    };

    handleGoalSheet();
  }, [id, trigger, appliedGoalSheetFilter, hasAppliedGoalSheetFilter]);

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

  // EDIT GOAL SHEET
  const [editYear, setEditYear] = useState("");
  const [editMonth, setEditMonth] = useState("");
  const [editNoOfJoinings, setEditNoOfJoinings] = useState(0);
  const [editCost, setEditCost] = useState(0);
  const [editRevenue, setEditRevenue] = useState(0);
  const [editIncentive, setEditIncentive] = useState(0);
  const [editleakage, setEditLeakage] = useState(0);
  const [showEditLeakageCalculator, setShowEditLeakageCalculator] = useState(false);
  const [editLeakageAmountA, setEditLeakageAmountA] = useState("");
  const [editLeakageAmountB, setEditLeakageAmountB] = useState("");
  const [goalSheetToEdit, setGoalSheetToEdit] = useState({});

  const getLeakagePercentage = (amountAValue, amountBValue) => {
    if (amountAValue === "" || amountBValue === "") {
      toast.error("Please enter Amount A and Amount B");
      return null;
    }

    const amountA = Number(amountAValue);
    const amountB = Number(amountBValue);

    if (Number.isNaN(amountA) || Number.isNaN(amountB)) {
      toast.error("Please enter valid numbers for Amount A and Amount B");
      return null;
    }

    if (amountB === 0) {
      toast.error("Amount B cannot be 0");
      return null;
    }

    return (amountA / amountB) * 100;
  };

  const handleCalculateLeakage = () => {
    const calculatedPercentage = getLeakagePercentage(leakageAmountA, leakageAmountB);
    if (calculatedPercentage === null) {
      return;
    }

    setLeakage(calculatedPercentage.toFixed(2));
    setShowLeakageCalculator(false);
  };

  const handleCalculateEditLeakage = () => {
    const calculatedPercentage = getLeakagePercentage(editLeakageAmountA, editLeakageAmountB);
    if (calculatedPercentage === null) {
      return;
    }

    setEditLeakage(calculatedPercentage.toFixed(2));
    setShowEditLeakageCalculator(false);
  };

  const handleEditClick = (detail) => {
    setGoalListId(detail?._id);
    setPrevYear(detail?.year);
    setPrevMonth(detail?.month);
    setEditMode(true);
    setEditYear(detail?.year ? String(detail.year) : "");
    setEditMonth(detail?.month ? String(detail.month) : "");
    setEditNoOfJoinings(detail.noOfJoinings);
    setEditCost(detail.cost);
    setEditRevenue(detail.revenue);
    setEditIncentive(detail.incentive);
    setEditLeakage(detail.leakage);
    setGoalSheetToEdit(detail);
    setSelectedColor(detail?.incentiveStatusColor || null);
    setShowEditLeakageCalculator(false);
    setEditLeakageAmountA("");
    setEditLeakageAmountB("");
  };

  const handleDeleteClick = (sheetId) => {
    setSheetId(sheetId);
    setDeletePopup(true);
  }

  const handleGoalSheetFilterChange = (field, value) => {
    setGoalSheetFilter((prev) => ({
      ...prev,
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

  const handleDownloadGoalSheetExcel = async (mode = "all") => {
    if (mode === "filtered" && !hasAppliedGoalSheetFilter) {
      toast.error("Apply a month-year filter before downloading filtered data");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.set("mode", mode);

      if (mode === "filtered") {
        if (appliedGoalSheetFilter.fromMonth && appliedGoalSheetFilter.fromYear) {
          params.set("fromMonth", appliedGoalSheetFilter.fromMonth);
          params.set("fromYear", appliedGoalSheetFilter.fromYear);
        }

        if (appliedGoalSheetFilter.toMonth && appliedGoalSheetFilter.toYear) {
          params.set("toMonth", appliedGoalSheetFilter.toMonth);
          params.set("toYear", appliedGoalSheetFilter.toYear);
        }
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/goalsheet/${id}/download-excel?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const contentDisposition = response.headers["content-disposition"] || "";
      const filenameMatch = contentDisposition.match(
        /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i
      );

      const fallbackName = mode === "all"
        ? "goal-sheet-all-records.xlsx"
        : "goal-sheet-filtered.xlsx";
      const fileName = filenameMatch?.[1]
        ? decodeURIComponent(filenameMatch[1])
        : fallbackName;

      const blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      let errorMessage = "Failed to download goal sheet";
      const responsePayload = error?.response?.data;

      if (responsePayload instanceof Blob) {
        try {
          const parsedText = await responsePayload.text();
          const parsedJson = JSON.parse(parsedText);
          if (parsedJson?.message) {
            errorMessage = parsedJson.message;
          }
        } catch {
          // Keep fallback message when blob payload is not JSON.
        }
      } else if (responsePayload?.message) {
        errorMessage = responsePayload.message;
      }

      toast.error(errorMessage);
    }
  };

  const grandTotal = useMemo(() => {
    return filteredData
      .flatMap((data) => data.goalSheetDetails)
      .reduce((acc, detail) => {
        acc.noOfJoinings += detail.noOfJoinings || 0;
        acc.revenue += detail.revenue || 0;
        acc.cost += detail.cost || 0;
        acc.target += detail.target || 0;
        acc.incentive += Number(detail.incentive) || 0;
        return acc;
      }, { noOfJoinings: 0, revenue: 0, cost: 0, target: 0, incentive: 0 });
  }, [filteredData]);

  const grandTotalYTD = useMemo(() => {
    if (!grandTotal.cost) {
      return 0;
    }

    return grandTotal.revenue / grandTotal.cost;
  }, [grandTotal]);

  const grandTotalRevenueAchievedPercentage = useMemo(() => {
    return calculateRevenueAchievedPercentage(
      grandTotal.revenue,
      grandTotal.target
    );
  }, [grandTotal]);

  const totals = useMemo(() => {
    return allGoalSheetData
      .flatMap((data) => data.goalSheetDetails)
      .filter((detail) => detail.year === Number(mailSelectedYear))
      .reduce(
        (acc, detail) => {
          acc.noOfJoinings += detail.noOfJoinings || 0;
          acc.revenue += detail.revenue || 0;
          acc.cost += detail.cost || 0;
          acc.target += detail.target || 0;
          return acc;
        },
        { noOfJoinings: 0, revenue: 0, cost: 0, target: 0 }
      );
  }, [allGoalSheetData, mailSelectedYear]);

  const overallGoalSheetYTD = useMemo(() => {
    if (!overallGoalSheetTotals.cost) {
      return 0;
    }

    return overallGoalSheetTotals.revenue / overallGoalSheetTotals.cost;
  }, [overallGoalSheetTotals]);

  const overallRevenueAchievedPercentage = useMemo(() => {
    return calculateRevenueAchievedPercentage(
      overallGoalSheetTotals.revenue,
      overallGoalSheetTotals.target
    );
  }, [overallGoalSheetTotals]);

  const pendingGoalSheetRequests = useMemo(() => {
    return (goalSheetRequests || []).filter(
      (request) => request?.status === "pending"
    );
  }, [goalSheetRequests]);

  // for uploading joining Excel
  const [loading, setLoading] = useState(false);

  const resetJoiningFileInput = () => {
    if (joiningFileInputRef.current) {
      joiningFileInputRef.current.value = "";
    }
  };

  const handleUploadJoinings = async (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("myFileImage", selectedFile);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/upload-joiningsheet/${id}`,
        formData,
        {
          headers:{
             Authorization : `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("File Uploaded Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in uploading File");
    } finally {
      setLoading(false);
      resetJoiningFileInput();
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    await handleUploadJoinings(selectedFile);
  };

  const handleUploadJoiningsClick = () => {
    if (loading) {
      return;
    }

    joiningFileInputRef.current?.click();
  };

  const [updateTicker, setUpdateTicker] = useState(false);
  const [tickerMessage, setTickerMessage] = useState("");

  const fireTicker = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/fire-ticker/${id}`,
        {
          tickerMessage,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      console.log("Error Firing Ticker", error);
      toast.error("Failed To trigger the ticker");
    }
  };

  //send mail to the admin about Goal Sheet
  const [sendEmialPopup, setSendEmailPopup] = useState(false);
  const [description, setDescription] = useState("");
  const [totalCosts, setTotalCosts] = useState("");
  const [totalRevenue, setTotalRevenue] = useState("");
  const [expectedRevenue, setExpectedRevenue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateMailLoading, setIsUpdateMailLoading] = useState(false);

  const sendMail = async (e) => {
    e.preventDefault();
    if (!mailSelectedYear) {
      toast.error("Please select a year");
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/send-mail/${id}`,
        {
          mailSelectedYear,
          description,
          total_costs: totals.cost,
          total_revenue: totals.revenue,
          expected_revenue: totals.target,
        }
      );

      toast.success("Email sent successfully!");
      setIsLoading(false);
      setSendEmailPopup(false);
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSendGoalSheetUpdatedMail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Login required to send email");
        return;
      }

      setIsUpdateMailLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/send-goalsheet-update-mail/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response?.data?.message || "Goal sheet update email sent successfully"
      );
    } catch (error) {
      console.error("Failed to send goal sheet update email:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to send goal sheet update email"
      );
    } finally {
      setIsUpdateMailLoading(false);
    }
  };

  const handleEditGoalSheet = async (e) => {
    e?.preventDefault?.();

    const effectiveEditYear = editYear || prevYear;
    const effectiveEditMonth = editMonth || prevMonth;

    // Validate month and year
    if (!effectiveEditYear || !effectiveEditMonth) {
      toast.error("Please select both year and month");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/edit-goalSheet`,
        {
          prevYear: prevYear,
          prevMonth: prevMonth,
          empId: id,
          year: Number(effectiveEditYear),
          month: Number(effectiveEditMonth),
          noOfJoinings: editNoOfJoinings,
          cost: editCost,
          revenue: editRevenue,
          sheetId: goalListId,
          incentive: editIncentive,
          leakage: editleakage,
          selectedColor: selectedColor
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTrigger((prev) => prev + 1);
        toast.success("Goal sheet updated successfully");
        setShowEditLeakageCalculator(false);
        setEditLeakageAmountA("");
        setEditLeakageAmountB("");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating goal sheet:", error);
      toast.error(error.response?.data?.message || "Failed to update goal sheet");
    }
  };

  const getGoalSheetRequestBadgeClass = (statusValue) => {
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

  const formatGoalSheetRequestStatus = (statusValue) => {
    if (!statusValue) {
      return "Pending";
    }

    return statusValue
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleUpdateGoalSheetRequestStatus = async (requestId, status) => {
    if (!requestId || !status) {
      return;
    }

    try {
      setUpdatingRequestId(requestId);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/goalsheet/${id}/request/${requestId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedRequest = response?.data?.request;
        if (updatedRequest?._id) {
          setGoalSheetRequests((previousRequests) =>
            previousRequests.map((request) =>
              request._id === updatedRequest._id
                ? { ...request, ...updatedRequest }
                : request
            )
          );
        }

        toast.success(response?.data?.message || "Request status updated");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update request status");
    } finally {
      setUpdatingRequestId("");
    }
  };

  const requestStatusActions = [
    { label: "Pending", value: "pending" },
    { label: "In Review", value: "in_review" },
    { label: "Approve", value: "approved" },
    { label: "Reject", value: "rejected" },
  ];

  const renderGoalSheetRequestCard = (request) => {
    const isUpdating = updatingRequestId === request?._id;

    return (
      <div
        key={request?._id}
        className="rounded-lg border border-gray-200 bg-gray-50 p-3"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm text-gray-800">{request?.message}</p>
          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getGoalSheetRequestBadgeClass(
              request?.status
            )}`}
          >
            {formatGoalSheetRequestStatus(request?.status)}
          </span>
        </div>

        <p className="mt-1 text-[11px] text-gray-500">
          Requested:{" "}
          {request?.requestedAt
            ? new Date(request.requestedAt).toLocaleString("en-IN")
            : "N/A"}
        </p>

        {request?.adminRemark ? (
          <p className="mt-1 text-[11px] text-gray-700">Admin: {request.adminRemark}</p>
        ) : null}

        <div className="mt-2 flex flex-wrap gap-2">
          {requestStatusActions.map((action) => (
            <button
              key={`${request?._id}-${action.value}`}
              type="button"
              onClick={() =>
                handleUpdateGoalSheetRequestStatus(request?._id, action.value)
              }
              disabled={isUpdating || request?.status === action.value}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                request?.status === action.value
                  ? "cursor-default border-blue-200 bg-blue-100 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {isUpdating && request?.status !== action.value
                ? "Updating..."
                : action.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      
      {tickermessage && (
        <div className="bg-red-200 px-4 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto w-full animate-pulse">
          <svg viewBox="0 0 24 24" className="text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-3">
            <path
              fill="currentColor"
              d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
            ></path>
          </svg>
          <span className="text-red-800">{tickermessage}</span>
        </div>
      )}

      <div className="px-4 pt-2 pb-6 md:px-4">
        <Sheet open={goalsheetform} onOpenChange={setGoalSheetForm}>
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-blue-950 md:text-4xl">
              Goal Sheet {employeename}
            </h1>

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              {employee?.joiningExcel && (
                <a
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
                  href={employee?.joiningExcel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Uploaded Joinings
                </a>
              )}

            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              >
                Update Goal Sheet
              </button>
            </SheetTrigger>
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
                    {formatIndianNumber(overallGoalSheetTotals.noOfJoinings, {
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
                    {formatIndianNumber(overallGoalSheetYTD, {
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
                  {formatIndianNumber(overallGoalSheetTotals.revenue)}
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
                  {formatIndianNumber(overallGoalSheetTotals.cost)}
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
                  {formatIndianNumber(overallGoalSheetTotals.target)}
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
                  {formatIndianNumber(overallRevenueAchievedPercentage, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="mb-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-slate-50/85 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-blue-950">
                    Employee Pending Requests
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Showing only pending requests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllRequestsSheet(true)}
                  disabled={goalSheetRequests.length === 0}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Show All
                </button>
              </div>
            </div>

            <div className="max-h-72 space-y-3 overflow-y-auto px-4 py-4">
              {pendingGoalSheetRequests.length > 0 ? (
                pendingGoalSheetRequests.map((request) =>
                  renderGoalSheetRequestCard(request)
                )
              ) : (
                <p className="text-sm text-gray-500">No pending requests.</p>
              )}
            </div>
          </div>

          <SheetContent
            side="right"
            className="overflow-y-auto sm:max-w-2xl"
          >
            <SheetHeader className="border-b border-gray-100 pb-4">
              <SheetTitle>Update Goal Sheet</SheetTitle>
              <SheetDescription>
                Add a new goal sheet record from the right-side panel.
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSetGoalSheet} className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <Select
                      value={year ? String(year) : undefined}
                      onValueChange={setYear}
                      disabled={availableYearOptions.length === 0}
                    >
                      <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-blue-100">
                        <SelectValue
                          placeholder={
                            availableYearOptions.length > 0
                              ? "Select Year"
                              : "No years available"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYearOptions.map((employeeYear) => (
                          <SelectItem
                            key={`create-year-${employeeYear}`}
                            value={String(employeeYear)}
                          >
                            {employeeYear}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Month
                    </label>
                    <Select
                      value={month ? String(month) : undefined}
                      onValueChange={setMonth}
                    >
                      <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-blue-100">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(monthNames).map(([monthValue, monthLabel]) => (
                          <SelectItem
                            key={`create-month-${monthValue}`}
                            value={String(monthValue)}
                            disabled={isMonthDisabledForSelectedYear(monthValue, year)}
                          >
                            {monthLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="revenue" className="mb-2 block text-sm font-medium text-gray-700">
                      Revenue
                    </label>
                    <input
                      type="number"
                      id="revenue"
                      value={revenue}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      onChange={(e) => setRevenue(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="cost" className="mb-2 block text-sm font-medium text-gray-700">
                      Cost
                    </label>
                    <input
                      type="number"
                      id="cost"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="noOfJoinings" className="mb-2 block text-sm font-medium text-gray-700">
                      No. Of Joinings
                    </label>
                    <input
                      type="number"
                      id="noOfJoinings"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      value={noOfJoinings}
                      onChange={(e) => setNoOfJoinings(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="incentive" className="mb-2 block text-sm font-medium text-gray-700">
                      Incentive
                    </label>
                    <input
                      type="number"
                      id="incentive"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      value={incentive}
                      onChange={(e) => setInsentive(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="leakage" className="mb-2 block text-sm font-medium text-gray-700">
                      Leakage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="leakage"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-11 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        value={leakage}
                        onChange={(e) => setLeakage(e.target.value)}
                      />
                      <button
                        type="button"
                        title="Leakage Calculator"
                        aria-label="Open leakage calculator"
                        className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                        onClick={() => setShowLeakageCalculator((prev) => !prev)}
                      >
                        <Calculator className="h-4 w-4" />
                      </button>
                    </div>

                    {showLeakageCalculator && (
                      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <p className="text-xs font-medium text-gray-600">
                          Amount A / Amount B = Percentage (%)
                        </p>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                              Amount A
                            </label>
                            <input
                              type="number"
                              value={leakageAmountA}
                              onChange={(e) => setLeakageAmountA(e.target.value)}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                              Amount B
                            </label>
                            <input
                              type="number"
                              value={leakageAmountB}
                              onChange={(e) => setLeakageAmountB(e.target.value)}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={handleCalculateLeakage}
                            className="rounded-md bg-blue-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-800"
                          >
                            Calculate
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4">
                  <button
                    type="submit"
                    className="inline-flex min-w-32 items-center justify-center rounded-lg bg-blue-900 px-4 py-2.5 text-white shadow-md transition hover:bg-blue-600 focus:outline-none"
                  >
                    {showSubmitLoader ? (
                      <svg
                        className="inline h-4 w-4 animate-spin fill-blue-600 text-gray-200"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
            </form>
          </SheetContent>
        </Sheet>

        <Sheet
          open={showAllRequestsSheet}
          onOpenChange={setShowAllRequestsSheet}
        >
          <SheetContent side="right" className="overflow-y-auto sm:max-w-2xl">
            <SheetHeader className="border-b border-gray-100 pb-4">
              <SheetTitle>All Employee Requests</SheetTitle>
              <SheetDescription>
                Review all request statuses in one place.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              {goalSheetRequests.length > 0 ? (
                goalSheetRequests.map((request) =>
                  renderGoalSheetRequestCard(request)
                )
              ) : (
                <p className="text-sm text-gray-500">No requests raised yet.</p>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Goal sheet updated successfully!
          </Alert>
        </Snackbar>

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
                    className="h-10 cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-gray-100 transition hover:bg-slate-800"
                    onClick={handleUploadJoiningsClick}
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Joinings"}
                  </button>
                  <input
                    ref={joiningFileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    type="file"
                  />
                  <button
                    type="button"
                    className="h-10 cursor-pointer rounded-lg bg-blue-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                    onClick={() =>
                      handleDownloadGoalSheetExcel(
                        hasAppliedGoalSheetFilter ? "filtered" : "all"
                      )
                    }
                    title={
                      hasAppliedGoalSheetFilter
                        ? "Downloading filtered data"
                        : "No filter applied, downloading full data"
                    }
                  >
                    Download Excel
                  </button>
                  <button
                    type="button"
                    className="h-10 cursor-pointer rounded-lg bg-indigo-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
                    onClick={handleSendGoalSheetUpdatedMail}
                    disabled={isUpdateMailLoading}
                  >
                    {isUpdateMailLoading ? "Sending..." : "Send Update Mail"}
                  </button>
                  <button
                    type="button"
                    className="h-10 cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    onClick={() => setSendEmailPopup(true)}
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>

            <div className="relative w-full overflow-x-auto">
              <table id="example" className="min-w-full table-auto">
                <thead className="sticky top-0 text-xs text-gray-100 bg-blue-900 shadow">
                <tr className="">
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
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>

                <tbody>
                  {filteredData.length > 0 &&
                    filteredData.map((data) =>
                      data.goalSheetDetails.length > 0 ? (
                        data.goalSheetDetails?.map((detail, index) => (
                          <tr
                            key={`${data._id}-${index}`}
                            className="text-center"
                          >
                            <td className="px-2 py-2 border">{detail.year}</td>
                            <td className="px-2 py-2 border">
                              {monthNames[detail.month] || "Unknown"}{" "}
                            </td>
                            <td className="px-2 py-2 border">
                              {formatIndianNumber(detail.noOfJoinings, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </td>
                            <td className="px-2 py-2 border">{formatIndianNumber(detail.revenue)}</td>
                            <td className="px-2 py-2 border">{formatIndianNumber(detail.cost)}</td>
                            <td className="px-2 py-2 border">{formatIndianNumber(detail.target)}</td>
                            <td className="px-2 py-2 border">
                              {formatIndianNumber(detail.cumulativeCost)}
                            </td>
                            <td className="px-2 py-2 border">
                              {formatIndianNumber(detail.cumulativeRevenue, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td
                              className={`px-2 py-2 border cursor-pointer ${
                                detail.achYTD < 2.5 ? "bg-red-400" : "bg-white"
                              }`}
                              onClick={() => setUpdateTicker(true)}
                            >
                              {formatIndianNumber(detail.achYTD, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-2 py-2 border">
                              {formatIndianNumber(detail.achMTD, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-2 py-2 border">
                              {formatIndianNumber(
                                calculateRevenueAchievedPercentage(
                                  detail.revenue,
                                  detail.target
                                ),
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                              %
                            </td>
                            <td 
                              className="px-2 py-2 border"
                              style={{ backgroundColor: detail?.incentiveStatusColor }}
                            >
                              {detail.incentive !== null && detail.incentive !== undefined
                                ? formatIndianNumber(detail.incentive)
                                : "N/A"}
                            </td>
                            <td className="px-2 py-2 border">
                              {detail.leakage !== null && detail.leakage !== undefined
                                ? formatIndianNumber(detail.leakage)
                                : "N/A"}
                            </td>
                            <td className="border px-0 py-0 align-middle">
                              <div className="flex items-center justify-center gap-0.5">
                                <button
                                  type="button"
                                  title="Edit"
                                  aria-label="Edit goal sheet row"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-blue-200 p-0 text-blue-700 transition hover:bg-blue-50"
                                  onClick={() => handleEditClick(detail)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  title="Delete"
                                  aria-label="Delete goal sheet row"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-200 p-0 text-red-600 transition hover:bg-red-50"
                                  onClick={() => handleDeleteClick(detail?._id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key={data._id}>
                          <td colSpan="14" className="px-2 py-2 text-center border">
                            No details available
                          </td>
                        </tr>
                      )
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
                      {formatIndianNumber(grandTotal?.noOfJoinings, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                      {formatIndianNumber(grandTotal?.revenue)}
                    </td>
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                      {formatIndianNumber(grandTotal?.cost)}
                    </td>
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                      {formatIndianNumber(grandTotal?.target)}
                    </td>
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                    </td>
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3" />
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                      {formatIndianNumber(grandTotalYTD, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3" />
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                      {formatIndianNumber(grandTotalRevenueAchievedPercentage, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      %
                    </td>
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3">
                      {formatIndianNumber(grandTotal?.incentive)}
                    </td>
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3" />
                    <td className="sticky bottom-0 z-10 border border-blue-200 bg-blue-100 px-2 py-3" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Goal Sheet Side Sheet */}
      <Sheet open={editMode} onOpenChange={setEditMode}>
        <SheetContent side="right" className="overflow-y-auto sm:max-w-2xl">
          <SheetHeader className="border-b border-gray-100 pb-4">
            <SheetTitle>Edit Goal Sheet</SheetTitle>
            <SheetDescription>
              Update the selected goal sheet record from the right-side panel.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleEditGoalSheet} className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Year
                </label>
                <Select
                  value={editYear ? String(editYear) : undefined}
                  onValueChange={setEditYear}
                  disabled={availableYearOptions.length === 0}
                >
                  <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-blue-100">
                    <SelectValue
                      placeholder={
                        availableYearOptions.length > 0
                          ? "Select Year"
                          : "No years available"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYearOptions.map((employeeYear) => (
                      <SelectItem
                        key={`edit-year-${employeeYear}`}
                        value={String(employeeYear)}
                      >
                        {employeeYear}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Month
                </label>
                <Select
                  value={editMonth ? String(editMonth) : undefined}
                  onValueChange={setEditMonth}
                >
                  <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-blue-100">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(monthNames).map(([monthValue, monthLabel]) => (
                      <SelectItem
                        key={`edit-month-${monthValue}`}
                        value={String(monthValue)}
                        disabled={isMonthDisabledForSelectedYear(monthValue, editYear)}
                      >
                        {monthLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="editNoOfJoinings" className="mb-2 block text-sm font-medium text-gray-700">
                  No. Of Joinings
                </label>
                <input
                  id="editNoOfJoinings"
                  type="number"
                  value={editNoOfJoinings}
                  onChange={(e) => setEditNoOfJoinings(e.target.value)}
                  placeholder="No. Of Joinings"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="editCost" className="mb-2 block text-sm font-medium text-gray-700">
                  Cost
                </label>
                <input
                  id="editCost"
                  type="number"
                  value={editCost}
                  onChange={(e) => setEditCost(e.target.value)}
                  placeholder="Cost"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="editRevenue" className="mb-2 block text-sm font-medium text-gray-700">
                  Revenue
                </label>
                <input
                  id="editRevenue"
                  type="number"
                  value={editRevenue}
                  onChange={(e) => setEditRevenue(e.target.value)}
                  placeholder="Revenue"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="editIncentive" className="mb-2 block text-sm font-medium text-gray-700">
                  Incentive
                </label>
                <input
                  id="editIncentive"
                  type="number"
                  value={editIncentive}
                  onChange={(e) => setEditIncentive(e.target.value)}
                  placeholder="Incentive"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="editLeakage" className="mb-2 block text-sm font-medium text-gray-700">
                  Leakage
                </label>
                <div className="relative">
                  <input
                    id="editLeakage"
                    type="number"
                    value={editleakage}
                    onChange={(e) => setEditLeakage(e.target.value)}
                    placeholder="Leakage"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-11 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    title="Leakage Calculator"
                    aria-label="Open edit leakage calculator"
                    className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                    onClick={() => setShowEditLeakageCalculator((prev) => !prev)}
                  >
                    <Calculator className="h-4 w-4" />
                  </button>
                </div>

                {showEditLeakageCalculator && (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-600">
                      Amount A / Amount B = Percentage (%)
                    </p>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                          Amount A
                        </label>
                        <input
                          type="number"
                          value={editLeakageAmountA}
                          onChange={(e) => setEditLeakageAmountA(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                          Amount B
                        </label>
                        <input
                          type="number"
                          value={editLeakageAmountB}
                          onChange={(e) => setEditLeakageAmountB(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={handleCalculateEditLeakage}
                        className="rounded-md bg-blue-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-800"
                      >
                        Calculate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Incentive Status Color
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setSelectedColor(null)}
                  className={`rounded-lg border px-3 py-2.5 text-left transition ${
                    selectedColor === null
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full border border-gray-400 bg-white" />
                    <span className="text-sm font-medium text-gray-700">No Color</span>
                  </div>
                </button>

                {colors.map((color) => (
                  <button
                    key={color.code}
                    type="button"
                    onClick={() => setSelectedColor(color.code)}
                    className={`rounded-lg border px-3 py-2.5 text-left transition ${
                      selectedColor === color.code
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-5 w-5 rounded-full border border-gray-400"
                          style={{ backgroundColor: color.code }}
                        />
                        <span className="text-sm font-medium text-gray-700">{color.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              {selectedColor && (
                <div className="mt-2 flex items-center text-sm text-gray-700">
                  <span>
                    Selected:
                    {" "}
                    {colors.find((color) => color.code === selectedColor)?.name || "Color"}
                  </span>
                  <div
                    className="ml-2 h-6 w-6 rounded-full border border-gray-400"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditGoalSheet}
                className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Modal */}
      {deletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
            <button
              onClick={() => setDeletePopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">Are you sure?</h2>
            <p className="text-gray-600 text-center mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setDeletePopup(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGoalSheet}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={showSubmitLoader}
              >
                {showSubmitLoader ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticker Message Modal */}
      {updateTicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fireTicker();
                setUpdateTicker(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-4">
                  Write Description
                </label>
                <textarea
                  rows={4}
                  value={tickerMessage}
                  onChange={(e) => setTickerMessage(e.target.value)}
                  placeholder="Enter the ticker message here"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Fire Ticker
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateTicker(false)}
                  className="flex-1 p-2 text-gray-700 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {sendEmialPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-center uppercase">
              Send Email to Employee
            </h2>
            <div className="bg-blue-900 w-40 h-1 mx-auto mb-4"></div>
            <form onSubmit={sendMail} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter the description"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Select year
                </label>
                <select
                  value={mailSelectedYear}
                  onChange={(e) => setMailSelectedYear(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Select Year --</option>
                  {availableYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Total Costs
                  </label>
                  <input
                    type="text"
                    value={formatIndianNumber(totals.cost)}
                    readOnly
                    className="w-full p-2 border rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Total Revenue
                  </label>
                  <input
                    type="text"
                    value={formatIndianNumber(totals.revenue)}
                    readOnly
                    className="w-full p-2 border rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Expected Revenue
                  </label>
                  <input
                    type="text"
                    value={formatIndianNumber(totals.target)}
                    readOnly
                    className="w-full p-2 border rounded-md bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Email"}
                </button>
                <button
                  type="button"
                  onClick={() => setSendEmailPopup(false)}
                  className="flex-1 p-2 text-gray-700 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EachEmployeeGoalSheet;
