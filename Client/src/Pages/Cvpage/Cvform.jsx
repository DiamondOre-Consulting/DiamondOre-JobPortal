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
        careerobjective: [{ objective: '' }],
        educatinaldetailsform: [{ degree: '', school: '', city: '', country: '' }],
        experience: [{ jobtitle: '', company: '', city: '', country: '', enddate: '' }]
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
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="max-w-screen-xl sm:max-w-screen-lg md:max-w-screen-md lg:max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 shadow-lg bg-white rounded-md  ">
                    <div className="flex rounded-lg mr-4 ">
                        {/* <div className="hidden md:block">
                            <img src={simg} />
                        </div> */}
                        <div className='border border-1 border-black flex flex-col w-full p-4'>
                            <div className='border-b-2 border-gray-800'>
                                <h1 className='text-center font-bold font-serif text-3xl'>RESUME</h1>
                                <p className='font-bold uppercase text-xl'>{formData.name}</p>
                                <p className='font-bold'>Email id:  <span className='text-blue-400 underline underline-offset-4'>{formData.email}</span></p>
                                <p className='font-bold'>Mobile No:  <span className='text-gray-700'>{formData.phone}</span></p>
                                <p className='font-bold'>Date of Birth:  <span className='text-gray-700'>{formData.dob}</span></p>
                                <p className='font-bold'>Linkdin URL:  <span className='underline underline-offset-4 text-blue-400'>{formData.linkdin}</span></p>
                                <p className='font-bold'>Address:  <span className='text-gray-700'>{formData.address}</span></p>
                            </div>
                            <div className='mt-2'>
                                <h1 className='font-serif font-bold text-xl underline underline-offset-4'>CAREER OBJECTIVE</h1>
                                <ul className='list-disc pl-4'>
                                    {formData.careerobjective.map((obj, index) => (
                                        <li className="" key={index}>{obj.objective}</li>
                                    ))}
                                </ul>

                            </div>
                            <div className='mt-4'>
                                <h1 className='font-serif font-bold text-xl underline underline-offset-4'>ACADEMIC QUALIFICATION</h1>
                                <ul className='list-disc pl-4'>
                                    {formData.educatinaldetailsform.map((edu, index) => (
                                        <li className="" key={index}><span className='font-bold uppercase'>{edu.degree} </span>,<span>{edu.school}</span>
                                            <p><span>{edu.city}</span>  | <span>{edu.country}</span></p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className='mt-4'>
                                <h1 className='font-serif font-bold text-xl underline underline-offset-4'>Experience</h1>
                                <ul className='list-disc pl-4'>
                                    {formData.experience.map((exp, index) => (
                                        <li className="" key={index}><span className='font-bold uppercase'>{exp.jobtitle} </span>,<span>{exp.company}</span>
                                            <p><span>{exp.city}</span>  | <span>{exp.enddate}</span></p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='mt-4'>
                                Date:- {day}/{month}/{year}
                            </div>
                            <div className='mt-4 float-right italic font-bold'>
                                <p className='font-bold'>Sign :- <span>{formData.name}</span></p>
                            </div>

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
                                    {/* objective */}


                                    <div className="sm:col-span-2 ">
                                        {formData.careerobjective.map((obj, index) => (
                                            <div key={index} className="flex items-center">
                                                <input
                                                    type="text"
                                                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 my-1 "
                                                    value={obj.objective}
                                                    placeholder='Career Objective'
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "careerobjective",
                                                            index,
                                                            "objective",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-red-400 p-2 mx-2 text-gray-100 hover:bg-red-600"
                                                    onClick={() => handleRemoveItem("careerobjective", index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => handleAddItem("careerobjective")}
                                            className="p-2 my-2 bg-green-500 rounded text-gray-100"
                                        >
                                            Add Objective
                                        </button>
                                    </div>


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
                                    <h2 className='font-bold text-4xl mb-2'>Professional Experience</h2>
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
                                                    placeholder="Enter CompanyName"
                                                    className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                                    value={exp.company}
                                                    onChange={(e) =>
                                                        handleItemInputChange(
                                                            "experience",
                                                            index,
                                                            "company",
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