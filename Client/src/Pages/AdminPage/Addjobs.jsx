import React, { useState, useEffect } from 'react'
import AdminNav from '../../Components/AdminPagesComponents/AdminNav'
import AdminFooter from '../../Components/AdminPagesComponents/AdminFooter'
import axios from "axios";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";

const AddJobs = () => {
  const [sheet, setSheet] = useState(null);
  const [sheeturl, setsheeturl] = useState(null);
  const [upload, setupload] = useState(null);

  const token = localStorage.getItem("token");
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
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


  const handleUploadsheet = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("myFile", sheet);
      const response = await axios.post(
        "http://localhost:5000/api/admin-confi/upload-job-excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );

      if (response.status === 400) {
        console.log("error");
        
      }
      else{
        console.log(response.data);
        setsheeturl(response.data)
      }
    }
    catch (error) {
      console.log(error);
    }
  };


  const handlesubmit = async (e) => {
    e.preventDefault();
    setupload(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin-confi/add-job",
        {
          url: sheeturl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Successfully!!!");
        navigate('/dashboard')
        setupload("uploaded sucessfully")
      } else {
        console.log("failed");
        // Handle signup error
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <div>
      <AdminNav />
      <h1 className='text-3xl font-serif text-blue-950 text-center'>Upload youe Excel Sheet</h1>
      <div className='w-48 bg-blue-950 h-0.5 text-center mx-auto  my-3'></div>

      <div>
      <div class="flex items-center justify-center w-full px-12 py-4">
        <label htmlFor="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-950 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Only Excel sheets</p>
          </div>
          <input id="dropzone-file" type="file" class="" name='sheet' onChange={(e) => setSheet(e.target.files[0])} />
        </label>
      </div>
      <button type='submit' className='bg-blue-950 text-white p-2 px-12 flex items-center justify-center mx-auto rounded-md' onClick={handleUploadsheet}>upload</button>
      </div>
      {upload && (
        <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
          <p className="text-center text-sm text-red-500">{upload}</p>
        </div>
      )}
      <button type='submit' className='bg-blue-950 text-white p-2 px-12 flex items-center justify-center mx-auto rounded-md mt-1' onClick={handlesubmit}>Submit</button>

      <AdminFooter />
    </div>
  )
}

export default AddJobs