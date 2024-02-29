import React, { useState } from 'react'
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import simg from '../../assets/formsvg.svg';

const Cvform = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        linkdin: '',
        educatinaldetailsform: [{ degree: '', school: '', city: '', country: '' }],
        experience: [{ jobtitle: '', employer: '', city: '', country: '', enddate: '' }]
        // Add more fields for each step
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., submit data to backend
        console.log('Form submitted:', formData);
    };

    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleItemInputChange = (field, index, key, value) => {
        const updatedItems = [...formData[field]];
        updatedItems[index][key] = value;
        setFormData({
            ...formData,
            [field]: updatedItems,
        });
    };
    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="max-w-screen-xl sm:max-w-screen-lg md:max-w-screen-md lg:max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 shadow-lg bg-white rounded-md  ">
                    <div className="flex items-center justify-center  rounded-lg  ">
                        <div className="hidden md:block">
                            <img src={simg} />
                        </div>
                    </div>
                    <div className="space-y-4 ">
                        <form onSubmit={handleSubmit}>
                            {/* Step 1 */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 className='font-bold text-4xl '>Personal Details</h2>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                    />
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone No."
                                        className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                    />
                                    <textarea
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Your Address"
                                        className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                    />
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        placeholder="dd/mm/yyyy"
                                        className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                    />
                                    <input
                                        type="url"
                                        name="linkdin"
                                        value={formData.linkdin}
                                        onChange={handleChange}
                                        placeholder="Linkdin URL"
                                        className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                    />

                                    <button type="button" onClick={nextStep} className="mt-4 bg-blue-950 text-white px-4 py-2 rounded-md float-right">Next</button>
                                </div>
                            )}

                            {/* Step 2 */}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className='font-bold text-4xl mb-2'>Educational Details</h2>

                                    <div className="sm:col-span-2">
                                        {formData.educatinaldetailsform.map((det, index) => (
                                            <div key={index} className=" items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Enter Degree/ Feild Of Study"
                                                    className="border border-1 rounded-md px-3 py-2 mt-2 w-full "
                                                    value={det.degree}
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "educatinaldetailsform",
                                                            index,
                                                            "degree",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Enter School/university"
                                                    className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                                    value={det.school}
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "educatinaldetailsform",
                                                            index,
                                                            "school",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Enter City"
                                                    className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                                    value={det.city}
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "educatinaldetailsform",
                                                            index,
                                                            "city",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Enter Country"
                                                    className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                                    value={det.country}
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "educatinaldetailsform",
                                                            index,
                                                            "country",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-red-400 p-2  text-gray-100 rounded hover:bg-red-600 w-full"
                                                    onClick={() => handleRemoveItem("educatinaldetailsform", index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => handleAddItem("educatinaldetailsform")}
                                            className="p-2 my-2 bg-blue-950 rounded text-gray-100 w-full">
                                            Add Education
                                        </button>
                                    </div>

                                    <div className="mt-4 flex justify-between">
                                        <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-md">Previous</button>
                                        <button type="button" onClick={nextStep} className="bg-blue-950 text-white px-4 py-2 rounded-md">Next</button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3 */}
                            {currentStep === 3 && (
                                <div>
                                    <h2  className='font-bold text-4xl mb-2'>Professional Experience</h2>
                                    <div className="sm:col-span-2">
                                        {formData.experience.map((exp, index) => (
                                            <div key={index} className=" items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Enter Job Title"
                                                    className="border border-1 rounded-md px-3 py-2 mt-2 w-full "
                                                    value={exp.jobtitle}
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "experience",
                                                            index,
                                                            "jobtitle",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Enter Employer"
                                                    className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                                    value={exp.employer}
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "experience",
                                                            index,
                                                            "employer",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Enter City"
                                                    className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                                    value={exp.city}
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "experience",
                                                            index,
                                                            "city",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Enter Country"
                                                    className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                                    value={exp.country}
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "experience",
                                                            index,
                                                            "country",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <input
                                                    type="date"
                                                    value={exp.enddate}
                                                    placeholder="Your End Date"
                                                    className="border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "experience",
                                                            index,
                                                            "enddate",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-red-400 p-2  text-gray-100 rounded hover:bg-red-600 w-full"
                                                    onClick={() => handleRemoveItem("experience", index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => handleAddItem("experience")}
                                            className="p-2 my-2 bg-blue-950 rounded text-gray-100 w-full">
                                            Add Experience
                                        </button>
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-md">Previous</button>
                                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Submit</button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                </div>


            </div>
            <Footer />
        </div>
    )
}

export default Cvform