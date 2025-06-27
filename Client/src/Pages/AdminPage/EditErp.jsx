import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

const EditErp = () => {
    // Initial state with all required fields
    const initialState = {
        EmpOfMonth: "",
        recognitionType: "",
        EmpOfMonthDesc: "",
        Top5HRs: [{ name: "" }],
        Top5Clients: [{ name: "" }],
        RnRInterns: [{ title: "", name: "", count: 0, percentage: 0 }],
        RnRRecruiters: [{ title: "", name: "", count: 0, percentage: 0 }],
        BreakingNews: [{ news: "" }],
        JoningsForWeek: [{ 
            names: "", 
            noOfJoinings: 0,
            client: "",
            location: "",
            ctc: "",
            recruiterName: "",
            teamLeaderName: ""
        }],
    };

    const [erpData, setErpData] = useState(initialState);
    const [employees, setEmployees] = useState([]);
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState("");
    const { erpId } = useParams();
    const token = localStorage.getItem("token");
    const { decodedToken } = useJwt(token);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Input change handlers
    const handleInputChange = (field, value) => {
        setErpData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleAddItem = (field) => {
        setErpData(prev => {
            const template = {
                RnRInterns: { title: "", name: "", count: 0, percentage: 0 },
                RnRRecruiters: { title: "", name: "", count: 0, percentage: 0 },
                JoningsForWeek: { 
                    names: "", 
                    noOfJoinings: 0,
                    client: "",
                    location: "",
                    ctc: "",
                    recruiterName: "",
                    teamLeaderName: ""
                }
            };
            
            return {
                ...prev,
                [field]: [...prev[field], template[field] || { name: "" }]
            };
        });
    };

    const handleRemoveItem = (field, index) => {
        if (erpData[field].length <= 1) {
            toast.warning(`At least one item is required`);
            return;
        }
        
        setErpData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleItemInputChange = (field, index, key, value) => {
        setErpData(prev => {
            const updatedItems = [...prev[field]];
            updatedItems[index] = { ...updatedItems[index], [key]: value };
            return { ...prev, [field]: updatedItems };
        });
    };

    // Fetch all employees
    useEffect(() => {
        const fetchAllEmployee = async () => {
            try {
                if (!token) {
                    navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 200) {
                    setEmployees(response.data.allEmployees);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                toast.error("Failed to load employees");
            }
        };

        fetchAllEmployee();
    }, [navigate, token]);

    // Fetch ERP data
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    navigate("/admin-login");
                    return;
                }

                // Check token expiration
                if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem("token");
                    navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/erp/erp-data/${erpId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 200) {
                    const lastData = response.data;
                    setPreview(lastData.profilePic || "");
                    setErpData({
                        ...initialState,
                        ...lastData,
                        Top5HRs: lastData.Top5HRs || initialState.Top5HRs,
                        Top5Clients: lastData.Top5Clients || initialState.Top5Clients,
                        RnRInterns: lastData.RnRInterns || initialState.RnRInterns,
                        RnRRecruiters: lastData.RnRRecruiters || initialState.RnRRecruiters,
                        BreakingNews: lastData.BreakingNews || initialState.BreakingNews,
                        JoningsForWeek: lastData.JoningsForWeek || initialState.JoningsForWeek,
                    });
                }
            } catch (error) {
                console.error("Error fetching ERP data:", error);
                toast.error("Failed to load ERP data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [erpId, token, navigate, decodedToken]);

    // Submit handler
    const handleFormSubmit = async () => {
        if (isSubmitting) return;
        
        // Basic validation
        if (!erpData.EmpOfMonth) {
            toast.error("Please select an Employee of the Month");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        try {
            if (profilePic) formData.append('profilePic', profilePic);
            formData.append("erpData", JSON.stringify(erpData));

            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/admin-confi/erp/edit-erp-data/${erpId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                toast.success("ERP data updated successfully!");
                navigate("/admin-dashboard/erp-dashboard");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update ERP data");
            console.error("Update error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Field configurations for dynamic sections
    const fieldConfigurations = [
        { 
            title: "Top 5 HRs", 
            field: "Top5HRs", 
            fields: [{ name: "name", type: "text", placeholder: "HR Name" }] 
        },
        { 
            title: "Top 5 Clients", 
            field: "Top5Clients", 
            fields: [{ name: "name", type: "text", placeholder: "Client Name" }] 
        },
        { 
            title: "RnR Interns", 
            field: "RnRInterns", 
            fields: [
                { name: "title", type: "text", placeholder: "Title" },
                { name: "name", type: "text", placeholder: "Name" },
                { name: "count", type: "number", placeholder: "Count" },
                { name: "percentage", type: "number", placeholder: "Percentage" }
            ] 
        },
        { 
            title: "RnR Recruiters", 
            field: "RnRRecruiters", 
            fields: [
                { name: "title", type: "text", placeholder: "Title" },
                { name: "name", type: "text", placeholder: "Name" },
                { name: "count", type: "number", placeholder: "Count" },
                { name: "percentage", type: "number", placeholder: "Percentage" }
            ] 
        },
        { 
            title: "Breaking News", 
            field: "BreakingNews", 
            fields: [{ name: "news", type: "text", placeholder: "News" }] 
        },
        { 
            title: "Joinings for the Week", 
            field: "JoningsForWeek", 
            fields: [
                { name: "names", type: "text", placeholder: "Channel" },
                { name: "client", type: "text", placeholder: "Client" },
                { name: "location", type: "text", placeholder: "Location" },
                { name: "ctc", type: "text", placeholder: "CTC" },
                { name: "recruiterName", type: "text", placeholder: "Recruiter" },
                { name: "teamLeaderName", type: "text", placeholder: "Team Leader" },
                { name: "noOfJoinings", type: "number", placeholder: "No. of Joinings" }
            ] 
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center my-4">RNR LEADERBOARD</h1>
            <div className="w-44 h-0.5 bg-blue-900 mx-auto mb-8"></div>

            <form className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                {/* Employee of Month Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Employee*
                        </label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={erpData.EmpOfMonth}
                            onChange={(e) => handleInputChange("EmpOfMonth", e.target.value)}
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 group mb-4">
                            <img
                                src={preview || "/default-profile.png"}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <FaCamera className="text-white text-xl" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Recognition Details */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recognition Type
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={erpData.recognitionType}
                        onChange={(e) => handleInputChange("recognitionType", e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description*
                    </label>
                    <textarea
                        rows={4}
                        className="w-full p-2 border rounded-md"
                        value={erpData.EmpOfMonthDesc}
                        onChange={(e) => handleInputChange("EmpOfMonthDesc", e.target.value)}
                        required
                    />
                </div>

                {/* Dynamic List Sections */}
                {fieldConfigurations.map((section) => (
                    <div key={section.field} className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">{section.title}*</h3>
                            <button
                                type="button"
                                onClick={() => handleAddItem(section.field)}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                            >
                                Add +
                            </button>
                        </div>

                        <div className="space-y-3">
                            {erpData[section.field]?.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-2 items-end">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                        {section.fields.map((field) => (
                                            <div key={`${section.field}-${index}-${field.name}`} className="flex-1">
                                                <input
                                                    type={field.type}
                                                    placeholder={field.placeholder}
                                                    className="w-full p-2 border rounded-md"
                                                    value={item[field.name] || ""}
                                                    onChange={(e) => 
                                                        handleItemInputChange(
                                                            section.field, 
                                                            index, 
                                                            field.name, 
                                                            e.target.value
                                                        )
                                                    }
                                                    required={index === 0 && field.name === "name"}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(section.field, index)}
                                        className="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Submit Button */}
                <div className="mt-8">
                    <button
                        type="button"
                        onClick={handleFormSubmit}
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                        } transition`}
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Updating...
                            </>
                        ) : (
                            "Update ERP Data"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditErp;