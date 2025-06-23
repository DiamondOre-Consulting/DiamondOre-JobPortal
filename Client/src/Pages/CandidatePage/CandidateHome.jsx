import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import CandidateNav from "../../Components/CandidatePagesComponents/CandidateNav";
import CandidateFooter from "../../Components/CandidatePagesComponents/CandidateFooter";
import HomeNewRecommend from "../../Components/CandidatePagesComponents/HomeNewRecommend";
import HomeChannelwise from "../../Components/CandidatePagesComponents/HomeChannelwise";
import Banner from "../../Components/CandidatePagesComponents/Banner";
import axios from "axios";
const CandidateHome = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { decodedToken } = useJwt(localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login"); // Redirect to login page if not authenticated
    return;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token found, redirect to login page
      navigate("/login");
    } else {
      const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0; // Convert expiration time to milliseconds

      if (tokenExpiration && tokenExpiration < Date.now()) {
        // Token expired, remove from local storage and redirect to login page
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [decodedToken]);

  const handleGetUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/candidates/user-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("resa", response);
      setName(response?.data?.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetUserData();
  }, []);

  return (
    <div className="bg-white">
      <CandidateNav />

      <h2 className="text-5xl px-10 font-bold text-gray-800 ">
        Welcome aboard, <span className="text-blue-900 ">{name}</span>
      </h2>
      <Link
        className="mt-6 flex justify-center items-center bg-blue-400 overflow-hidden h-10"
        to="/edit-prefrence-form"
      >
        <div className="whitespace-nowrap animate-marquee underline">
          Click Here to Edit Preference Form - Get Jobs Tailored to Your Needs!
        </div>
      </Link>

      <HomeNewRecommend />
      <HomeChannelwise />
      <CandidateFooter />
    </div>
  );
};

export default CandidateHome;
