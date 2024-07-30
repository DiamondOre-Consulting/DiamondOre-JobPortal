import React, { useState, useEffect } from 'react';
import AdminNav from '../../Components/AdminPagesComponents/AdminNav';
import AdminFooter from '../../Components/AdminPagesComponents/AdminFooter';
import axios from "axios";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";

const AddJobs = () => {
  const [sheet, setSheet] = useState(null);
  const [sheeturl, setsheeturl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
  }, [decodedToken, navigate]);

  const handleUploadsheet = async (e) => {
    try {
      e.preventDefault();
      setIsUploading(true);
      setUploadSuccess(false);

      const formData = new FormData();
      formData.append("myFile", sheet);

      const response = await axios.post(
        "https://api.diamondore.in/api/jobs/upload-ops",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setsheeturl(response.data);
        setUploadSuccess(true);
      } else {
        console.log("error", response.statusText);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://api.diamondore.in/api/jobs/upload-job-excel",
        {
          url: sheeturl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Successfully!!!");
        alert("Jobs added Successfully");
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      {/* <AdminNav /> */}
      <h1 className='text-3xl  text-blue-950 text-center'>Upload your Excel Sheet</h1>
      <div className='w-48 bg-blue-950 h-0.5 text-center mx-auto  my-3'></div>

      <div>
        <div className="flex items-center justify-center w-full px-12 py-4">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-950 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">Only Excel sheets</p>
            </div>
            <input
              type="file"
              id="myFile"
              name="myFile"
              onChange={(e) => setSheet(e.target.files[0])}
              className="p-2"
            />
          </label>
        </div>
        <button
          type='submit'
          className={`bg-blue-950 text-white p-2 px-12 flex items-center justify-center mx-auto rounded-md ${isUploading ? 'cursor-not-allowed bg-gray-400' : ''}`}
          onClick={handleUploadsheet}
          disabled={isUploading}
        >
          {isUploading ? (
            <svg
              className="inline w-4 h-4 text-gray-200 animate-spin fill-blue-600"
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
          ) : uploadSuccess ? 'Upload Successful!' : 'Upload'}
        </button>
      </div>
      <button
        type='submit'
        className='bg-blue-950 text-white p-2 px-12 flex items-center justify-center mx-auto rounded-md mt-1'
        onClick={handlesubmit}
      >
        Submit
      </button>
      {/* <AdminFooter /> */}
    </div>
  );
}

export default AddJobs;
