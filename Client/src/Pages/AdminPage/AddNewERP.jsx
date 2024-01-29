import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import AdminNav from "../../Components/AdminPagesComponents/AdminNav";
import AdminFooter from "../../Components/AdminPagesComponents/AdminFooter";

const AddNewERP = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    EmpOfMonth: "",
    Top5HRs: [{ name: "" }],
    Top5Clients: [{ name: "" }],
    RnRInterns: [{ title: "", name: "", count: 0, percentage: 0 }],
    RnRRecruiters: [{ title: "", name: "", count: 0, percentage: 0 }],
    BreakingNews: [{ news: "" }],
    JoningsForWeek: [{ names: "", noOfJoinings: 0 }],
  });

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
      const response = await axios.post("/erp/add", formData);
      console.log(response.data);
      // Handle success, e.g., show a success message or redirect to another page
    } catch (error) {
      console.error("Error adding ERP data:", error.message);
      // Handle error, e.g., show an error message
    }
  };

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
  return (
    <div className="mx-5">
      <AdminNav />
      <div class="bg-white py-6 sm:py-8 lg:py-12">
        <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div class="mb-10 md:mb-16">
            <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              Get in touch
            </h2>

            <p class="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              This is a section of some simple filler text, also known as
              placeholder text. It shares some characteristics of a real written
              text but is random or otherwise generated.
            </p>
          </div>

          {/* <form class="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
      <div>
        <label for="first-name" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">First name*</label>
        <input name="first-name" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div>
        <label for="last-name" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Last name*</label>
        <input name="last-name" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div class="sm:col-span-2">
        <label for="company" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Company</label>
        <input name="company" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div class="sm:col-span-2">
        <label for="email" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email*</label>
        <input name="email" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div class="sm:col-span-2">
        <label for="subject" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Subject*</label>
        <input name="subject" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
      </div>

      <div class="sm:col-span-2">
        <label for="message" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Message*</label>
        <textarea name="message" class="h-64 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></textarea>
      </div>

      <div class="flex items-center justify-between sm:col-span-2">
        <button class="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Send</button>

        <span class="text-sm text-gray-500">*Required</span>
      </div>

      <p class="text-xs text-gray-400">By signing up to our newsletter you agree to our <a href="#" class="underline transition duration-100 hover:text-indigo-500 active:text-indigo-600">Privacy Policy</a>.</p>
    </form> */}

          <form className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
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
                className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                value={formData.EmpOfMonth}
                onChange={(e) =>
                  handleInputChange("EmpOfMonth", e.target.value)
                }
              />
            </div>

            {/* Top5HRs */}
            <div className="sm:col-span-2">
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="px-5 py-1 ml-1 bg-red-500 hover:bg-red-600 rounded-md text-xs"
                    onClick={() => handleRemoveItem("Top5HRs", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddItem("Top5HRs")}>
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="px-5 py-1 ml-1 bg-red-500 hover:bg-red-600 rounded-md text-xs"
                    onClick={() => handleRemoveItem("Top5Clients", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem("Top5Clients")}
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="px-5 py-1 ml-1 bg-red-500 hover:bg-red-600 rounded-md text-xs"
                    onClick={() => handleRemoveItem("RnRInterns", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => handleAddItem("RnRInterns")}>
                Add Intern
              </button>
            </div>
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="px-5 py-1 ml-1 bg-red-500 hover:bg-red-600 rounded-md text-xs"
                    onClick={() => handleRemoveItem("RnRRecruiters", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem("RnRRecruiters")}
              >
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
              {formData.BreakingNews.map((news, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    placeholder="News"
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
                    value={news.news}
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
                    className="px-5 py-1 ml-1 bg-red-500 hover:bg-red-600 rounded-md text-xs"
                    onClick={() => handleRemoveItem("BreakingNews", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem("BreakingNews")}
              >
                Add News
              </button>
            </div>

            {/* JoningsForWeek */}
            <div className="sm:col-span-2">
              <label
                htmlFor="JoningsForWeek"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Joinings For the Week*
              </label>
              {formData.JoningsForWeek.map((joining, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Names"
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    placeholder="No of Joinings"
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
                    className="px-5 py-1 ml-1 bg-red-500 hover:bg-red-600 rounded-md text-xs"
                    onClick={() => handleRemoveItem("JoningsForWeek", index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem("JoningsForWeek")}
              >
                Add Joining
              </button>
            </div>

            {/* ... (Submit button and privacy policy) */}
          </form>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AddNewERP;
