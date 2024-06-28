import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PathSearch from './PathSearch';
import JobsReviews from './JobsReviews';
import StatsPartners from './StatsPartners';
import HeroNav from './HeroNav';
import axios from 'axios';
import Chatboot from './Chatboot';
import CvSection from './CvSection';

const Homemain = () => {
  const [latestJobs, setLatestJobs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        // Fetch associates data from the backend
        const response = await axios.get('https://api.diamondore.in/api/candidates/all-jobs');
        const all = response.data;
        const filteredJobs = all.filter(job => job.JobStatus === true);
        const latest = filteredJobs.slice(-3).reverse();
        setLatestJobs(latest);
      } catch (error) {
        console.error('Error fetching associates:', error);
        // Handle error and show appropriate message
      }
    };

    fetchLatestJobs();

    const handleScroll = () => {
      if (window.scrollY > 300 && !sessionStorage.getItem('popupShown')) {
        setShowPopup(true);
        sessionStorage.setItem('popupShown', 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <>
        <Navbar />
        <HeroNav />
        <StatsPartners />
        <PathSearch latestJobs={latestJobs} />
        <CvSection />
        <JobsReviews />
        <Footer />
        <Chatboot />

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg relative max-w-md md:w-full mx-10 md:mx-0">
              <button className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-3xl hover:bg-gray-100 px-2" onClick={closePopup}>
                &times;
              </button>
              <h2 className="text-2xl mb-4">Request a Call Back from Our Team</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700">Name:</label>
                  <input type="text" id="name" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700">Phone:</label>
                  <input type="text" id="phone" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="mb-4">
                  <label htmlFor="resume" className="block text-gray-700">Upload Resume:</label>
                  <input type="file" id="resume" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-950">Submit</button>
              </form>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Homemain;
