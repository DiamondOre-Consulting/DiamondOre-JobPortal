import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";

const AdminEditprofile = () => {
  const [profilePic, setProfilePic] = useState(null);
  
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    profilePic: null,
    passcode: ""
  });
  const navigate = useNavigate();

  console.log(adminData)


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/user-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          console.log(response.data)
          setAdminData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleNameChange = (e) => {
    setAdminData(prevState => ({
      ...prevState,
      name: e.target.value,
    }));
  };

  const handleEmailChange = (e) => {
    setAdminData(prevDetails => ({
      ...prevDetails,
      email: e.target.value
    }))

  }

  const handlePasscodeChange = (e) => {
    setAdminData(prevDetails => ({
      ...prevDetails,
      passcode: e.target.value
    }))
  }



  // const handleUploadImage = async (e) => {
  //   try {
  //     e.preventDefault();

  //     const formData = new FormData();
      
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/admin-confi/upload-profile-pic`,
  //       formData,
  //       {
  //         headers :{
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       ;

  //       setProfilePicUrl(response.data);
  //     }
  //   } catch (error) {

  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", adminData.name);
      formData.append("email", adminData.email);
      formData.append("passcode", adminData.passcode);
      formData.append("profilePic", profilePic);
      console.log(adminData.name)
      console.log(adminData)
      console.log(profilePic)
     
      const token = localStorage.getItem("token");
      const response =await axios.put(`${import.meta.env.VITE_BASE_URL}/admin-confi/edit-profile`,
         formData, 
         {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
       console.log(response.data)
      alert('Profile updated successfully!');
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please try again.');
    }
  };
  return (
    <div className='py-6  px-4'>
      <h2 className='text-center text-2xl font-bold '>Edit Profile image</h2>
      <div className='w-28 h-1 bg-blue-950 mx-auto'></div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto  p-8 shadow-lg shadow-gray-500 my-2 bg-white border border-md">
        <div className="relative z-0  h-60 w-full mb-5 group sm:h-48 md:h-60" style={{ backgroundImage: `url("${adminData.profilePic}")`, backgroundPosition: "center", backgroundSize: "cover" }}>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6 mb-2">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={adminData.name}
              onChange={handleNameChange}
            />
            <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus: peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
          </div>

        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={adminData.email}
            onChange={handleEmailChange}
          />
          <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus: peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
        </div>

        <div className='flex flex-col '>

          <label htmlFor="">Passcode</label>
          <input
            value={adminData.passcode}
            onChange={handlePasscodeChange}
            className='block  px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer' type="text" />
        </div>


        <div className="relative z-0 w-full mb-5 group">
          <span className='font-bold '> Reupload Profile picture:-</span>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            accept=".jpeg,.png,.jpg"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="p-2"
          />

          {/* <button onClick={()=>{

          }} className="text-white bg-blue-950 hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center   ">upload image</button> */}

        </div>
        <button type="submit"  className="flex items-center juctify-center w-full text-white bg-blue-950 hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  sm:w-auto px-5 py-2.5 text-center ">Submit</button>
      </form>
    </div>
  )
}

export default AdminEditprofile