import React, { useState, useEffect } from "react";
import axios from "axios";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "sonner";

const AddERPForm = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);

  const initialErpData = {
    EmpOfMonth: "",
    recognitionType: "",
    EmpOfMonthDesc: "",
    Top5HRs: [{ name: "" }],
    Top5Clients: [{ name: "" }],
    RnRInterns: [{ title: "", name: "", count: 0, percentage: 0 }],
    RnRRecruiters: [{ title: "", name: "", count: 0, percentage: 0 }],
    BreakingNews: [{ news: "" }],
    JoningsForWeek: [{ names: "", noOfJoinings: 0 }],
  };

  const [erpData, setErpData] = useState(initialErpData);
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const tokenExpiration = decodedToken?.exp ? decodedToken.exp * 1000 : 0;
    if (tokenExpiration && tokenExpiration < Date.now()) {
      localStorage.removeItem("token");
      navigate("/admin-login");
    }
  }, [decodedToken, navigate, token]);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployees(response.data.allEmployees || []);
      } catch (error) {
        toast.error("Failed to load employees");
        console.error("Error fetching employees:", error);
      }
    };

    if (token) fetchEmployees();
  }, [token, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (field, value) => {
    setErpData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (field) => {
    const template = {
      Top5HRs: { name: "" },
      Top5Clients: { name: "" },
      RnRInterns: { title: "", name: "", count: 0, percentage: 0 },
      RnRRecruiters: { title: "", name: "", count: 0, percentage: 0 },
      BreakingNews: { news: "" },
      JoningsForWeek: { names: "", noOfJoinings: 0 }
    };
    
    setErpData(prev => ({
      ...prev,
      [field]: [...prev[field], template[field]]
    }));
  };

  const handleRemoveItem = (field, index) => {
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

  const validateForm = () => {
    // Check if at least one field has data
    const hasData = 
      erpData.EmpOfMonth ||
      erpData.recognitionType ||
      erpData.EmpOfMonthDesc ||
      erpData.Top5HRs.some(hr => hr.name) ||
      erpData.Top5Clients.some(client => client.name) ||
      erpData.RnRInterns.some(intern => intern.name || intern.title) ||
      erpData.RnRRecruiters.some(recruiter => recruiter.name || recruiter.title) ||
      erpData.BreakingNews.some(news => news.news) ||
      erpData.JoningsForWeek.some(joining => joining.names);

    if (!hasData) {
      toast.error("Please fill at least one field before submitting");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData();

    try {
      if (profilePic) formData.append("profilePic", profilePic);
      formData.append("erpData", JSON.stringify(erpData));

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/erp/add-erp-data`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("ERP data added successfully!");
        navigate("/admin-dashboard/erp-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add ERP data");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field groups dynamically
  const fieldGroups = [
    {
      title: "Employee of the Month",
      fields: [
        { name: "EmpOfMonth", label: "Select Employee", type: "select", options: employees },
        { name: "recognitionType", label: "Recognition Type", type: "text" },
        { name: "EmpOfMonthDesc", label: "Description", type: "textarea" }
      ]
    },
    {
      title: "Top Performers",
      lists: [
        { name: "Top5HRs", label: "Top 5 HRs", fields: [{ name: "name", label: "Name" }] },
        { name: "Top5Clients", label: "Top 5 Clients", fields: [{ name: "name", label: "Name" }] }
      ]
    },
    {
      title: "Rewards & Recognition",
      lists: [
        { 
          name: "RnRInterns", 
          label: "RnR Interns", 
          fields: [
            { name: "title", label: "Title" },
            { name: "name", label: "Name" },
            { name: "count", label: "Count", type: "number" },
            { name: "percentage", label: "Percentage", type: "number" }
          ]
        },
        { 
          name: "RnRRecruiters", 
          label: "RnR Recruiters", 
          fields: [
            { name: "title", label: "Title" },
            { name: "name", label: "Name" },
            { name: "count", label: "Count", type: "number" },
            { name: "percentage", label: "Percentage", type: "number" }
          ]
        }
      ]
    },
    {
      title: "Company Updates",
      lists: [
        { name: "BreakingNews", label: "Breaking News", fields: [{ name: "news", label: "News" }] },
        { 
          name: "JoningsForWeek", 
          label: "Joinings for the Week", 
          fields: [
            { name: "names", label: "Names" },
            { name: "noOfJoinings", label: "Number of Joinings", type: "number" }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">RNR LEADERBOARD</h1>
          <div className="w-32 h-1 bg-blue-600 mx-auto mt-2"></div>
        </div>

        <form onSubmit={handleFormSubmit} className="bg-white shadow rounded-lg p-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={preview || "/default-profile.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FaCamera className="text-white text-2xl" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">Click to upload profile picture</p>
          </div>

          {/* Dynamic Form Sections */}
          {fieldGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                {group.title}
              </h2>

              {/* Regular Fields */}
              {group.fields?.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={erpData[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={erpData[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={erpData[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}

              {/* List Fields */}
              {group.lists?.map((list) => (
                <div key={list.name} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-700">{list.label}</h3>
                    <button
                      type="button"
                      onClick={() => handleAddItem(list.name)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FaPlus className="mr-1" /> Add
                    </button>
                  </div>

                  {erpData[list.name]?.map((item, index) => (
                    <div key={index} className="mb-3 p-3 bg-gray-50 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {list.fields.map((field) => (
                          <div key={field.name}>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              {field.label}
                            </label>
                            <input
                              type={field.type || "text"}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              value={item[field.name] || ""}
                              onChange={(e) =>
                                handleItemInputChange(
                                  list.name,
                                  index,
                                  field.name,
                                  field.type === "number" ? 
                                    parseInt(e.target.value) || 0 : 
                                    e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(list.name, index)}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center"
                        >
                          <FaTimes className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit ERP Data"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddERPForm;