import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import { FaCamera } from "react-icons/fa";
import {toast} from "sonner" 


const EditErp = () => {
    const [erpData, setErpData] = useState({
        EmpOfMonth: "",
        recognitionType: "",
        EmpOfMonthDesc: "",
        Top5HRs: [{ name: "" }],
        Top5Clients: [{ name: "" }],
        RnRInterns: [{ title: "", name: "", count: 0, percentage: 0 }],
        RnRRecruiters: [{ title: "", name: "", count: 0, percentage: 0 }],
        BreakingNews: [{ news: "" }],
        JoningsForWeek: [{ names: "", noOfJoinings: 0 }],
       
    });
    const [employees, setEmployees] = useState([]);

    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState("");
    const { erpId } = useParams();
    const token = localStorage.getItem("token");
    const { decodedToken } = useJwt(token);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const handleInputChange = (field, value) => {
        setErpData({
            ...erpData,
            [field]: value,
        });
    };

    const handleImageChange = (e) => {
       
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file)); // Preview the selected image
        }
    };

    const handleAddItem = (field) => {
        
        setErpData({
            ...erpData,
            [field]: [...erpData[field], {}],
        });
    };

    const handleRemoveItem = (field, index) => {
        const updatedItems = [...erpData[field]];
        updatedItems.splice(index, 1);
        setErpData({
            ...erpData,
            [field]: updatedItems,
        });
    };
    
  
    // Fetch all employees on component mount
    useEffect(() => {
        const fetchAllEmployee = async () => {
            try {
                if (!token) {
                    console.error("No token found");
                    navigate("/admin-login");
                    return;
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setEmployees(response.data.allEmployees);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                // Handle error appropriately
            }
        };

        fetchAllEmployee();
    }, [navigate, token]);

    const handleItemInputChange = (field, index, key, value) => {
        const updatedItems = [...erpData[field]];
        updatedItems[index][key] = value;
        setErpData({
            ...erpData,
            [field]: updatedItems,
        });
    };
    const formData = new FormData();
    
    const handleFormSubmit = async () => {
       
        try {
            formData.append('profilePic',profilePic)
            formData.append("erpData", JSON.stringify(erpData)); 

            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/admin-confi/erp/edit-erp-data/${erpId}`,
                formData,              
                {         
                    headers: {
                        Authorization: `Bearer ${token}`,

                    },
                }
            );
            // Handle success, e.g., show a success message or redirect to another page
            if (response.status === 201){
                navigate("/admin-dashboard/erp-dashboard");
            }

            // Reset the form after successful submission
            // setErpData(initialFormData);
        } catch (error) {
            return toast.error(error?.response?.data?.message)
            // console.error("Error adding ERP data:", error?.response?.data?.message);
            // Handle error, e.g., show an error message
        }
    };

    // Fetch ERP data on mount
    useEffect(() => {
        if (!token) {
            navigate("/admin-login");
            return;
        }

        const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;

        if (tokenExpiration && tokenExpiration < Date.now()) {
            localStorage.removeItem("token");
            navigate("/admin-login");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/admin-confi/erp/erp-data/${erpId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    const lastData = response.data;
                    // const empdata = response.data.findEmp;
                    // setEmployee(empdata);
                    setPreview(lastData.profilePic || "");
                    setErpData({
                        EmpOfMonth: lastData.EmpOfMonth || "",
                        recognitionType: lastData.recognitionType || "",
                        EmpOfMonthDesc: lastData.EmpOfMonthDesc || "",
                        Top5HRs: lastData.Top5HRs || [{ name: "" }],
                        Top5Clients: lastData.Top5Clients || [{ name: "" }],
                        RnRInterns: lastData.RnRInterns || [{ title: "", name: "", count: 0, percentage: 0 }],
                        RnRRecruiters: lastData.RnRRecruiters || [{ title: "", name: "", count: 0, percentage: 0 }],
                        BreakingNews: lastData.BreakingNews || [{ news: "" }],
                        JoningsForWeek: lastData.JoningsForWeek || [{ names: "", noOfJoinings: 0 }],
                        profilePicUrl: lastData.profilePic || "",
                    });
                } else {
                    
                }
            } catch (e) {
                console.log(e)
            }
        };

        fetchData();
    }, [decodedToken, navigate, token]);




    // Handle array input changes (Top5HRs and Top5Clients)
    const handleArrayChange = (arrayName, index, value) => {
        setErpData((prev) => {
            const updatedArray = [...prev[arrayName]];
            updatedArray[index] = value;
            return { ...prev, [arrayName]: updatedArray };
        });
    };



    // Handle form submission
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await axios.put(`/api/erp/${erpId}`, erpData); // Replace with your API endpoint
    //         alert("ERP updated successfully!");
    //     } catch (error) {
    //         console.error("Error updating ERP:", error);
    //     }
    // };

    

    return (
        <div className="">
            <h1 className="mx-auto my-2 text-3xl text-center">
                RNR LEADERBOARD
            </h1>



            <div className="w-44 h-0.5 bg-blue-900 justify-center mx-auto"></div>
            <form className="grid max-w-screen-md gap-4 p-5 mx-auto shadow-lg sm:grid-cols-2">


                <div>
                    <label
                        htmlFor="EmpOfMonth"
                        className="inline-block mb-2 text-sm text-gray-800 sm:text-base"
                    >
                        Select Employee*
                    </label>
                    <br />
                    <select
                        className="w-full px-2 py-2"
                        value={erpData.EmpOfMonth}
                        onChange={(e) => handleInputChange("EmpOfMonth", e.target.value)}
                    >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                                {emp.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col items-center justify-center mt-4">
                    <div className="relative w-32 h-32 group">
                        {/* Profile Image or Placeholder */}
                        <img
                            src={preview || "https://via.placeholder.com/200x200.png"}
                            alt="Profile"
                            className="object-cover w-full h-full rounded-full shadow-md"
                        />

                        {/* Overlay with Camera Icon */}
                        <label
                            htmlFor="profilePicInput"
                            className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 cursor-pointer group-hover:opacity-100"
                        >
                            <FaCamera className="w-6 h-6 text-white" />
                        </label>

                        {/* Hidden File Input */}
                        <input
                            id="profilePicInput"
                            type="file"
                            name="profilePic"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Upload Button */}
                    
                </div>
                <div className="w-full col-span-2">
                    <label
                        htmlFor="recognitionType"
                        className="inline-block mb-2 text-sm text-gray-800 sm:text-base"
                    >
                        Recognition Type
                    </label>
                    <br />
                    <input
                        id="recognitionType" // Add an id for better accessibility
                        type="text"
                        className="w-full px-2 py-2 border rounded-md"
                        value={erpData.recognitionType}
                        onChange={(e) => handleInputChange("recognitionType", e.target.value)}
                    />
                </div>


                <div className="w-full col-span-2">
                    <label
                        htmlFor="EmpOfMonthDesc"
                        className="inline-block mb-2 text-sm text-gray-800 sm:text-base"
                    >
                        Description*
                    </label>
                    <br />
                    <textarea
                        id="EmpOfMonthDesc" // Add an id for better accessibility
                        rows="4"
                        type="text"
                        className="w-full px-2 py-2 border rounded-md" // Ensure consistent styling
                        value={erpData.EmpOfMonthDesc} // Ensure this is bound to the state
                        onChange={(e) =>
                            handleInputChange("EmpOfMonthDesc", e.target.value)
                        }
                    />
                </div>

                {/* Top5HRs */}
                <div className="sm:col-span-2">
                    <label
                        htmlFor="Top5HRs"
                        className="inline-block mb-2 text-sm text-gray-800 sm:text-base"
                    >
                        Top 5 HRs*
                    </label>
                    {erpData?.Top5HRs?.map((hr, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="text"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 border rounded outline-none bg-gray-50 ring-indigo-300"
                                value={hr.name}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "Top5HRs",
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="p-2 mx-2 text-gray-100 bg-red-400 hover:bg-red-600"
                                onClick={() => handleRemoveItem("Top5HRs", index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem("Top5HRs")}
                        className="p-2 my-2 text-gray-100 bg-blue-500 rounded"
                    >
                        Add HR
                    </button>
                </div>

                {/* Top5Clients */}
                <div className="sm:col-span-2">
                    <label
                        htmlFor="Top5Clients"
                        className="inline-block mb-2 text-sm text-gray-800 sm:text-base"
                    >
                        Top 5 Clients*
                    </label>
                    {erpData?.Top5Clients?.map((client, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="text"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={client.name}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "Top5Clients",
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="p-2 mx-2 text-gray-100 bg-red-400 rounded hover:bg-red-600"
                                onClick={() => handleRemoveItem("Top5Clients", index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem("Top5Clients")}
                        className="p-2 my-2 text-gray-100 bg-blue-500 rounded"
                    >
                        Add Client
                    </button>
                </div>

                {/* RnRInterns */}
                <div className="sm:col-span-2">
                    <label
                        htmlFor="RnRInterns"
                        className="inline-block mb-2 text-sm text-gray-800 sm:text-base"
                    >
                        RnR Interns*
                    </label>
                    {erpData?.RnRInterns?.map((intern, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="text"
                                placeholder="Title"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={intern.title}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "RnRInterns",
                                        index,
                                        "title",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={intern.name}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "RnRInterns",
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="number"
                                placeholder="Count"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={intern.count}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "RnRInterns",
                                        index,
                                        "count",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="number"
                                placeholder="Percentage"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={intern.percentage}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "RnRInterns",
                                        index,
                                        "percentage",
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="p-2 mx-2 text-gray-100 bg-red-400 rounded hover:bg-red-600"
                                onClick={() => handleRemoveItem("RnRInterns", index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem("RnRInterns")}
                        className="p-2 my-2 text-gray-100 bg-blue-500 rounded"
                    >
                        Add Intern
                    </button>
                </div>

                {/* RnRRecruiters */}
                <div className="sm:col-span-2">
                    <label
                        htmlFor="RnRRecruiters"
                        className="inline-block mb-2 text-sm text-gray-800 sm:text-base"
                    >
                        RnR Recruiters*
                    </label>
                    {erpData?.RnRRecruiters?.map((recruiter, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="text"
                                placeholder="Title"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={recruiter.title}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "RnRRecruiters",
                                        index,
                                        "title",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={recruiter.name}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "RnRRecruiters",
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="number"
                                placeholder="Count"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={recruiter.count}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "RnRRecruiters",
                                        index,
                                        "count",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="number"
                                placeholder="Percentage"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={recruiter.percentage}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "RnRRecruiters",
                                        index,
                                        "percentage",
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="p-2 mx-2 text-gray-100 bg-red-400 rounded hover:bg-red-600"
                                onClick={() => handleRemoveItem("RnRRecruiters", index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem("RnRRecruiters")}
                        className="p-2 my-2 text-gray-100 bg-blue-500 rounded"
                    >
                        Add Recruiter
                    </button>
                </div>

                {/* BreakingNews */}
                <div className="sm:col-span-2">
                    <label
                        htmlFor="BreakingNews"
                        className="inline-block mb-2 text-sm text-gray-800 sm:text-base"
                    >
                        Breaking News*
                    </label>
                    {erpData?.BreakingNews?.map((newsItem, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="text"
                                className="w-full px-3 py-2 my-1 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={newsItem.news}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "BreakingNews",
                                        index,
                                        "news",
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="p-2 mx-2 text-gray-100 bg-red-400 rounded hover:bg-red-600"
                                onClick={() => handleRemoveItem("BreakingNews", index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem("BreakingNews")}
                        className="p-2 my-2 text-gray-100 bg-blue-500 rounded"
                    >
                        Add News
                    </button>
                </div>

                {/* JoningsForWeek */}
                <div className="sm:col-span-2">
                    <label
                        htmlFor="JoningsForWeek"
                        className="inline-block mb-2 text-sm text-gray-800 sm:text-base"
                    >
                        Jonings for the Week*
                    </label>
                    {erpData?.JoningsForWeek?.map((joining, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center my-2 space-y-2 md:flex-row"
                        >
                            <input
                                type="text"
                                placeholder="Channel"
                                className="w-full px-3 py-2 mt-2 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={joining.names}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "JoningsForWeek",
                                        index,
                                        "names",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="text"
                                placeholder="Client"
                                className="w-full px-3 py-2 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={joining.client}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "JoningsForWeek",
                                        index,
                                        "client",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                className="w-full px-3 py-2 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={joining.location}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "JoningsForWeek",
                                        index,
                                        "location",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="number"
                                placeholder="CTC"
                                className="w-full px-3 py-2 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={joining.ctc}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "JoningsForWeek",
                                        index,
                                        "ctc",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="text"
                                placeholder="Recruiter Name"
                                className="w-full px-3 py-2 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={joining.recruiterName}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "JoningsForWeek",
                                        index,
                                        "recruiterName",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="text"
                                placeholder="Team Leader Name"
                                className="w-full px-3 py-2 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={joining.teamLeaderName}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "JoningsForWeek",
                                        index,
                                        "teamLeaderName",
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="number"
                                placeholder="Number of Joinings"
                                className="w-full px-3 py-2 text-gray-800 transition duration-100 bg-gray-100 border rounded outline-none ring-indigo-300"
                                value={joining.noOfJoinings}
                                onChange={(e) =>
                                    handleItemInputChange(
                                        "JoningsForWeek",
                                        index,
                                        "noOfJoinings",
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                type="button"
                                className="p-2 mx-2 text-gray-100 bg-red-400 rounded hover:bg-red-600"
                                onClick={() => handleRemoveItem("JoningsForWeek", index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddItem("JoningsForWeek")}
                        className="p-2 my-2 text-gray-100 bg-blue-500 rounded"
                    >
                        Add Joining
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="button"
                    onClick={handleFormSubmit}
                    className="w-full p-3 mx-2 my-5 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditErp;
