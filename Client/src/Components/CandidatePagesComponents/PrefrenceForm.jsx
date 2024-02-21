
import React, { useEffect, useState } from 'react'
import Footer from '../../Pages/HomePage/Footer';
import Navbar from '../../Pages/HomePage/Navbar';
import axios from 'axios';


const PrefrenceForm = () => {

    const [cities, setCities] = useState([]);
    const [channels, setChannels] = useState([])
    const [formData, setFormData] = useState({
        preferedcity: '',
        preferedchannel: '',
        yrsofexpereance: '',
        yourcurrentctc: '',
    });
    const [userInputs, setUserInputs] = useState([]);
    const [step, setStep] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        console.log("User inputs:", userInputs);
    }, [userInputs]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserInputs(prevInputs => [...prevInputs, formData]);
        console.log(userInputs)
        setFormData({
            preferedcity: '',
            preferedchannel: '',
            yrsofexpereance: '',
            yourcurrentctc: '',
        });
    };

    const steps = ['preferedcity', 'preferedchannel', 'yrsofexpereance', 'yourcurrentctc'];

    const calculateProgress = () => {
        let filledFields = 0;
        for (let key in formData) {
            if (formData[key]) {
                filledFields++;
            }
        }
        return (filledFields / steps.length) * 100;
    };

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {

                // Fetch associates data from the backend
                const response = await axios.get(
                    "https://diamond-ore-job-portal-backend.vercel.app/api/candidates/all-jobs"
                );
                console.log(response.data)

                const uniquicities = [...new Set(response.data.map(job => job.City))];
                const uniquiChannels = [...new Set(response.data.map(job => job.Channel))];
                console.log("Unique cities:", uniquicities);
                console.log("channels", uniquiChannels);
                setCities(uniquicities);
                setChannels(uniquiChannels);
                console.log(uniquicities)
                if (response.status == 200) {
                    console.log(response.data);
                    const all = response.data;
                }
            } catch (error) {
                console.error("Error fetching associates:", error);
                // Handle error and show appropriate message
            }
        };

        fetchAllJobs();
    }, []);


    return (
        <div className=''>
            <Navbar />
            <h1 className='text-3xl font-bold  mx-auto text-center'>Fill Your Prefrence</h1>
            <div className='w-44 h-1 bg-blue-900 mx-auto'></div>
            <div className="max-w-screen-md mx-auto mt-2 px-8  mt-2 shadow-lg shadow-gray-500 pb-8 pt-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Prefered Cities</label>
                        <select
                            className='w-full py-2 px-3'
                            name="preferedcity"
                            value={formData.preferedcity}
                            onChange={handleChange}
                        >
                            <option>Select Your Prefered City</option>
                            {cities.map((city, index) => (
                                <option
                                    key={index}
                                    value={city}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {city}
                                </option>
                            ))}
                        </select>

                        {/* <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="border border-gray-400 rounded w-full py-2 px-3" /> */}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Prefered Channels</label>
                        <select
                            className='w-full py-2 px-3'
                            name="preferedchannel"
                            value={formData.preferedchannel}
                            onChange={handleChange}
                        >
                            <option>Select Your Prefered City</option>
                            {channels.map((channel, index) => (
                                <option
                                    key={index}
                                    value={channel}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {channel}
                                </option>
                            ))}
                        </select>

                        {/* <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-400 rounded w-full py-2 px-3" /> */}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Yrs of Experience</label>
                        <input type="number" id="yrsofexpereance" name="yrsofexpereance" value={formData.yrsofexpereance} onChange={handleChange} className="border border-gray-400 rounded w-full py-2 px-3" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="city" className="block text-gray-700 font-bold mb-2">Your Current CTC</label>
                        <input type="text" id="yourcurrentctc" name="yourcurrentctc" value={formData.yourcurrentctc} onChange={handleChange} className="border border-gray-400 rounded w-full py-2 px-3" />
                    </div>
                    <button type="submit" className="bg-blue-950 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Submit</button>
                    <div className="mt-4 mb-6">
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div className="bg-blue-950 h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>

    );
};

export default PrefrenceForm