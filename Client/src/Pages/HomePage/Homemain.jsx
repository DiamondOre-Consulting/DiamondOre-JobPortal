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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [showLoaderResume , setShowLoaderResume] = useState(false);

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

  const submitCallReq = async (e) => {
    e.preventDefault();
    // const payload = { name, phone };

    try {
      const response = await axios.post('http://localhost:5000/api/candidates/request-call', {name, phone}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Handle successful form submission (e.g., show a success message, close the popup)
        alert('Form submitted successfully!');
        closePopup();
      } else {
        // Handle form submission error
        alert('Failed to submit the form');
      }
    } catch (error) {
      console.error('Error submitting form:', error.message);
      alert('An error occurred while submitting the form');
    }
  }

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleUploadResume = async (e) => {
    setShowLoaderResume(true);
    e.preventDefault();      

    try {
      const formData = new FormData();
      formData.append("myResume", resume)

      const response = await axios.post('',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },

        }
      )
      if (response.status === 200) {

        setResumeUrl(response.data);
        console.log(response.data)
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post('', {

        name,
        phone,
        resume, resumeUrl
      })

      if (response.status === 200) {
        console.log(response.data);
        console.log("request has been submitted")
      }
    }
    catch (error) {

      console.log("error in submitting form", error)

    }

  }

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
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700" value={name} onChange={(e) => setName(e.target.value)}>Name:</label>
                  <input type="text" id="name" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700" value={phone} onChange={(e) => setPhone(e.target.value)}>Phone:</label>
                  <input type="text" id="phone" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                {/* <div className="mb-4">
                  <label htmlFor="resume" className="block text-gray-700">Upload Resume:</label>
                  <input type="file" id="resume" className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setResume(e.target.files[0])} />

                  <button
                    onClick={handleUploadResume}
                    className=" w-1/2 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {showLoaderResume ? (
                      <svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                    ) : (
                      <span>{resumeUrl ? 'Uploaded' : 'Upload Resume'}</span>)}
                  </button>

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
