import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useJwt } from 'react-jwt';
import { useNavigate } from 'react-router-dom';

const AddJobs = () => {
  const [sheet, setSheet] = useState(null);
  const [sheeturl, setsheeturl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const token = localStorage.getItem('token');
  const { decodedToken } = useJwt(token);
  const navigate = useNavigate();
  const [allchannels, setAllChannels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchquery, setSearchQuery] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;
      if (tokenExpiration && tokenExpiration < Date.now()) {
        localStorage.removeItem('token');
        navigate('/admin-login');
      }
    }
  }, [decodedToken, navigate, token]);

  const handleUploadsheet = async (e) => {
    e.preventDefault();
    if (!sheet) {
      alert('Please select a file to upload');
      return;
    }
    try {
      setIsUploading(true);
      setUploadSuccess(false);
      const formData = new FormData();
      formData.append('myFile', sheet);
      const response = await axios.post(
        'https://api.diamondore.in/api/jobs/upload-ops',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setsheeturl(response.data.url); // Assuming response.data contains the URL of the uploaded file
        setUploadSuccess(true);
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!sheeturl) {
      alert('Please upload a file first');
      return;
    }
    try {
      const response = await axios.post(
        'https://api.diamondore.in/api/jobs/upload-job-excel',
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
        console.log('Successfully!!!');
        alert('Jobs added Successfully');
      } else {
        console.log('Failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        if (!token) {
          console.error('No token found');
          navigate('/admin-login');
          return;
        }

        const response = await axios.get('https://api.diamondore.in/api/admin-confi/all-jobs');
        if (response.status === 200) {
          console.log('All jobs:', response.data);
          const uniqueChannels = [...new Set(response.data.map((job) => job.Channel))];
          setAllChannels(uniqueChannels);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchAllJobs();
  }, [navigate, token]);

  const filteredChannels = allchannels.filter((channel) =>
    channel.toLowerCase().startsWith(searchquery.toLowerCase())
  );

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <h1 className="text-3xl text-blue-950 text-center">Upload your Excel Sheet</h1>
      <div className="w-48 bg-blue-950 h-0.5 text-center mx-auto my-3"></div>

      <div className="flex items-center justify-center w-full px-12 py-4">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-950 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Only Excel sheets</p>
          </div>
          <input
            type="file"
            id="dropzone-file"
            name="myFile"
            onChange={(e) => setSheet(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>
      <button
        type="submit"
        className={`bg-blue-950 text-white p-2 px-12 flex items-center justify-center mx-auto rounded-md ${isUploading ? 'cursor-not-allowed bg-gray-400' : ''
          }`}
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
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5308 10.0497C60.8781 10.7466 65.9746 12.6034 70.4859 15.5102C74.9972 18.417 78.789 22.3239 81.5636 26.953C83.8828 30.6774 85.5876 34.7351 86.5849 38.9725C87.2469 41.3255 89.5423 42.7201 91.9676 42.0829Z"
              fill="currentFill"
            />
          </svg>
        ) : (
          'Upload Sheet'
        )}
      </button>

      {uploadSuccess && <p className="text-green-600 text-center mt-2">File uploaded successfully!</p>}
      <button
        type="submit"
        className="bg-blue-950 text-white p-2 px-12 flex items-center justify-center mx-auto mt-4 rounded-md"
        onClick={handlesubmit}
      >
        Upload Jobs
      </button>



      <div className='mt-20 '>
        <h1 className='text-center text-4xl font-bold'> Delete Jobs</h1>
        <div className='w-40 h-1 bg-blue-900 mx-auto'></div>

        <div className='flex px-10 mt-8 '>



          <div className="relative mx-auto ">
            <div className='flex items-center'>
              <button
                type="button"
                className="w-full py-4 px-8 flex items-center bg-blue-950 text-white rounded-md"
                onClick={toggleDropdown}
              >
                Select Channel
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
              </svg>
              </button>
             
            </div>
            {isOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg">
                <input
                  type="text"
                  placeholder="Search channel"
                  value={searchquery}
                  onChange={handleSearchInputChange}
                  className="w-full py-2 px-4 border-b border-gray-300"
                />
                <ul className="max-h-48 overflow-y-auto">
                  {filteredChannels.map((channel, index) => (
                    <li
                      key={index}
                      className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSearchQuery(channel);
                        setIsOpen(false);
                      }}
                    >
                      {channel}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>



        </div>


      </div>
    </div>
  );
};

export default AddJobs;
