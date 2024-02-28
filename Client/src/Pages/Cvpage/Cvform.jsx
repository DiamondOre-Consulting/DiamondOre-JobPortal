import React, { useState } from 'react'
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';

const Cvform = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        linkdin: '',
        educatinaldetailsform: [{ degree: '', school: '', city: '', country: '' }]
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
            <div className="max-w-lg mx-auto border border-1 p-4 shadow-lg">
                <form onSubmit={handleSubmit}>
                    {/* Step 1 */}
                    {currentStep === 1 && (
                        <div>
                            <h2 className='text-bold text-2xl'>Personal Details</h2>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full"
                            />
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone No."
                                className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full"
                            />
                            <textarea
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Your Address"
                                className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full"
                            />
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                placeholder="dd/mm/yyyy"
                                className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full"
                            />
                            <input
                                type="url"
                                name="linkdin"
                                value={formData.linkdin}
                                onChange={handleChange}
                                placeholder="Linkdin URL"
                                className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full"
                            />

                            <button type="button" onClick={nextStep} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">Next</button>
                        </div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                        <div>
                            <h2 className='text-bold text-2xl'>Educational Details</h2>

                            <div className="sm:col-span-2">
                                {formData.educatinaldetailsform.map((det, index) => (
                                    <div key={index} className=" items-center">
                                        <input
                                            type="text"
                                            placeholder="Enter Degree/ Feild Of Study"
                                            className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full "
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
                                            className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full"
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
                                            className="border border-gray-300 rounded-md px-3 py-2 mt-2 w-full"
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
                                            className=" border border-gray-300 rounded-md px-3 py-2 mt-2 w-full mb-2"
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
                            <h2>Step 3</h2>
                            <input
                                type="text"
                                name="step3Data"
                                value={formData.step3Data}
                                onChange={handleChange}
                                placeholder="Step 3 Data"
                                className="border border-gray-300 rounded-md px-3 py-2 mt-2"
                            />
                            <div className="mt-4 flex justify-between">
                                <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-md">Previous</button>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Submit</button>
                            </div>
                        </div>
                    )}
                </form>

            </div>
            <Footer />
        </div>
    )
}

export default Cvform