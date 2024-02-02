import React, { useState, useEffect } from "react";
import axios from "axios";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";


const AddERPForm = () => {
  const navigate = useNavigate();
  const initialFormData = {
    EmpOfMonth: "",
    Top5HRs: [{ name: "" }],
    Top5Clients: [{ name: "" }],
    RnRInterns: [{ title: "", name: "", count: 0, percentage: 0 }],
    RnRRecruiters: [{ title: "", name: "", count: 0, percentage: 0 }],
    BreakingNews: [{ news: "" }],
    JoningsForWeek: [{ names: "", noOfJoinings: 0 }],
  };

  const [formData, setFormData] = useState(initialFormData);
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/admin-login"); // Redirect to login page if not authenticated
    return;
  }

  const userName = decodedToken ? decodedToken.name : "No Name Found";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token found, redirect to login page
      navigate("/admin-login");
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

      if (tokenExpiration && tokenExpiration < Date.now()) {
        // Token expired, remove from local storage and redirect to login page
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    }
  }, [decodedToken]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], {}],
    });
  };

  const handleRemoveItem = (field, index) => {
    const updatedItems = [...formData[field]];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      [field]: updatedItems,
    });
  };

  const handleItemInputChange = (field, index, key, value) => {
    const updatedItems = [...formData[field]];
    updatedItems[index][key] = value;
    setFormData({
      ...formData,
      [field]: updatedItems,
    });
  };

  const handleFormSubmit = async () => {
    try {
    
      const response = await axios.post(
        "https://diamond-ore-job-portal-backend.vercel.app/api/admin-confi/erp/add-erp-data",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      // Handle success, e.g., show a success message or redirect to another page
      if (response.status === 201) {
        console.log("New erp data added successfully!!!");
      }

      // Reset the form after successful submission
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error adding ERP data:", error.message);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="mx-5 ">
    
      <h1 className="mx-auto text-center text-3xl my-2">Employee of the month</h1>
      <div className="w-44 h-0.5 bg-blue-900 justify-center mx-auto"></div>
    <form className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 shadow-lg p-5">
      <div>
        <label
          htmlFor="EmpOfMonth"
          className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
        >
          Employee of the Month*
        </label>
        <input
          type="text"
          id="EmpOfMonth"
          className="w-full rounded border bg-gray-50 focus:bg-gray-100  px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
          value={formData.EmpOfMonth}
          onChange={(e) => handleInputChange("EmpOfMonth", e.target.value)}
        />
      </div>

      {/* Top5HRs */}
      <div className="sm:col-span-2 ">
        <label
          htmlFor="Top5HRs"
          className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
        >
          Top 5 HRs*
        </label>
        {formData.Top5HRs.map((hr, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 my-1 "
              value={hr.name}
              onChange={(e) =>
                handleItemInputChange("Top5HRs", index, "name", e.target.value)
              }
            />
            <button
              type="button"
              className="bg-red-400 p-2 mx-2 text-gray-100 hover:bg-red-600"
              onClick={() => handleRemoveItem("Top5HRs", index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddItem("Top5HRs")}
         className="p-2 my-2 bg-blue-500 rounded text-gray-100"
        >
          Add HR
        </button>
      </div>

      {/* Top5Clients */}
      <div className="sm:col-span-2">
        <label
          htmlFor="Top5Clients"
          className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
        >
          Top 5 Clients*
        </label>
        {formData.Top5Clients.map((client, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              className=" my-1 w-full rounded border bg-gray-100 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
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
              className="bg-red-400 p-2 mx-2 text-gray-100 rounded hover:bg-red-600"
              onClick={() => handleRemoveItem("Top5Clients", index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddItem("Top5Clients")}
         className="p-2 my-2 bg-blue-500 rounded text-gray-100"
        >
          Add Client
        </button>
      </div>

      {/* RnRInterns */}
      <div className="sm:col-span-2">
        <label
          htmlFor="RnRInterns"
          className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
        >
          RnR Interns*
        </label>
        {formData.RnRInterns.map((intern, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              placeholder="Title"
              className=" my-1 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
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
              className="my-1 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
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
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
              value={intern.count}
              onChange={(e) =>
                handleItemInputChange(
                  "RnRInterns",
                  index,
                  "count",
                  parseInt(e.target.value, 10)
                )
              }
            />
            <input
              type="number"
              placeholder="Percentage"
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
              value={intern.percentage}
              onChange={(e) =>
                handleItemInputChange(
                  "RnRInterns",
                  index,
                  "percentage",
                  parseInt(e.target.value, 10)
                )
              }
            />
            <button
              type="button"
              className="bg-red-400 p-2 mx-2 text-gray-100 rounded hover:bg-red-600"
              onClick={() => handleRemoveItem("RnRInterns", index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddItem("RnRInterns")}
         className="p-2 my-2 bg-blue-500 rounded text-gray-100">
          Add Intern
        </button>
      </div>

      {/* RnRRecruiters */}
      <div className="sm:col-span-2">
        <label
          htmlFor="RnRRecruiters"
          className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
        >
          RnR Recruiters*
        </label>
        {formData.RnRRecruiters.map((recruiter, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              placeholder="Title"
              className="my-1 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
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
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
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
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
              value={recruiter.count}
              onChange={(e) =>
                handleItemInputChange(
                  "RnRRecruiters",
                  index,
                  "count",
                  parseInt(e.target.value, 10)
                )
              }
            />
            <input
              type="number"
              placeholder="Percentage"
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
              value={recruiter.percentage}
              onChange={(e) =>
                handleItemInputChange(
                  "RnRRecruiters",
                  index,
                  "percentage",
                  parseInt(e.target.value, 10)
                )
              }
            />
            <button
              type="button"
              className="bg-red-400 p-2 mx-2 text-gray-100 rounded hover:bg-red-600"
              onClick={() => handleRemoveItem("RnRRecruiters", index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddItem("RnRRecruiters")}
         className="p-2 my-2 bg-blue-500 rounded text-gray-100">
          Add Recruiter
        </button>
      </div>

      {/* BreakingNews */}
      <div className="sm:col-span-2">
        <label
          htmlFor="BreakingNews"
          className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
        >
          Breaking News*
        </label>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="News"
            className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
            value={formData.BreakingNews[0]?.news || ""}
            onChange={(e) =>
              handleItemInputChange("BreakingNews", 0, "news", e.target.value)
            }
          />
         
          
        </div>
        
      </div>

      {/* JoningsForWeek */}
      <div className="sm:col-span-2">
        <label
          htmlFor="JoningsForWeek"
          className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
        >
          Joinings For Week*
        </label>
        {formData.JoningsForWeek.map((joining, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              placeholder="Names"
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 "
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
              type="number"
              placeholder="Number of Joinings"
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 my-1 "
              value={joining.noOfJoinings}
              onChange={(e) =>
                handleItemInputChange(
                  "JoningsForWeek",
                  index,
                  "noOfJoinings",
                  parseInt(e.target.value, 10)
                )
              }
            />
            <button
              type="button"
              className="bg-red-400 p-2 mx-2 text-gray-100 rounded hover:bg-red-600"
              onClick={() => handleRemoveItem("JoningsForWeek", index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddItem("JoningsForWeek")}
         className="p-2 my-2 bg-blue-500 rounded text-gray-100 ">
          Add Joining
        </button>
      </div>

      <div className="flex items-center justify-between sm:col-span-2">
        <button
          type="button"
          onClick={handleFormSubmit}
          className="inline-block w-full rounded-lg bg-blue-900 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100  focus-visible:ring active:bg-indigo-700 md:text-base"
        >
         Save Data
        </button>

      </div>

      <p className="text-xs text-gray-400">
        By signing up to our newsletter you agree to our{" "}
        <a
          href="#"
          className="underline transition duration-100 hover:text-indigo-500 active:text-indigo-600"
        >
          Privacy Policy
        </a>
        .
      </p>
    </form>
    
    </div>
  
  );
};

export default AddERPForm;
