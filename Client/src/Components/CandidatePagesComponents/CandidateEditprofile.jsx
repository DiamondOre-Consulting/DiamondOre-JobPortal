import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import Footer from '../../Pages/HomePage/Footer';
import CandidateNav from './CandidateNav';

const CandidateEditprofile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    resume: null,
    profilePic: null
  });
  const navigate = useNavigate();
  const [error,setError]=useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("api.diamondore.in/api/candidates/user-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };



  const handleUploadImage = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("myFileImage", profilePic);
      const response = await axios.post(
        "api.diamondore.in/api/candidates/upload-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setProfilePicUrl(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadResume = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("myFileResume", resume);
      const response = await axios.post(
        "api.diamondore.in/api/candidates/upload-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // console.log(response.data);
        setResumeUrl(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleSubmit = async (e) => {
    setError(null)
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("resume", resumeUrl);
      formData.append("profilePic", profilePicUrl);

      const token = localStorage.getItem("token");
      const response=await axios.put('api.diamondore.in/api/candidates/edit-profile',
       formData,
        {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 201){
        console.log("data after submitting",response.data)
        console.log("updated")
        alert('Profile updated successfully!');
        navigate('/dashboard');
      }   
    } catch (error) {
      console.error('Error updating profile:', error.message);
      if(error.response){
        const status=error.response.status;
        if(status==500){
         setError("error occured in updating files")
        }
        else{
          console.log("eror occured")
        }
      }
      else{
        console.log("error is in edditing profile")
      }
      // alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <>
     <CandidateNav/>

      <div className='py-6 bg-gray-50 px-4'>
        <h2 className='text-center text-2xl font-bold '>Edit Profile image</h2>
        <div className='w-28 h-1 bg-blue-950 mx-auto'></div>
        <form className="max-w-md mx-auto  p-8 shadow-lg shadow-gray-500 my-2 bg-white border border-md">
          <div className="grid md:grid-cols-2 md:gap-6 mb-2">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={userData.name}
                onChange={handleChange}
              />
              <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
            </div>
            <div className="relative z-0 w-20 h-20 rounded-full mb-5 group w-full h-full">
              <img className="" src={userData.profilePic} alt="Profile" />
            </div>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={userData.email}
              onChange={handleChange}
            />
            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                name="phone"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={userData.phone}
                onChange={handleChange}
              />
              <label htmlFor="phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
            </div>
            <div className="relative z-0 w-full mb-5 group">

            </div>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <span className='font-bold '> Reupload resume:-</span><input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="p-2"
            />
            <button type='submit' onClick={handleUploadResume} className="text-white bg-blue-950 hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">upload Resume</button>
            <br></br>
            <span className='font-bold '> Reupload Profile picture:-</span>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept=".jpeg,.png,.jpg"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="p-2"
            />
            <button type='submit' onClick={handleUploadImage} className="text-white bg-blue-950 hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">upload image</button>

          </div>
          <button type="submit" onClick={handleSubmit} className="flex items-center juctify-center w-full text-white bg-blue-950 hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ">Submit</button>
        </form>

        {error && (
            <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
              <p className="text-center text-sm text-red-500">{error}</p>
            </div>
          )}
      </div>
      <Footer />
    </>
  )
}

export default CandidateEditprofile