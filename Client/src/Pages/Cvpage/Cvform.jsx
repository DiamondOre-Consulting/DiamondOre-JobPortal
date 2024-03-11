import React, { useState } from 'react'
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import simg from '../../assets/formsvg.svg';
import axios from "axios";
import { Link } from 'react-router-dom';

const Cvform = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [url, setUrl] = useState(null);
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        linkedinUrl: '',
        summary: '',
        tech_skills: [],
        soft_skills: [],
        graduation: { degree_name: '', degree_field: '', graduation_year: '', university_name: '', university_city: '' },
        twelfth: { twelfth_field: '', twelfth_year: '', twelfth_school_name: '', twelfth_school_city: '', twelfth_board_name: '' },
        tenth: { tenth_year: '', tenth_school_name: '', tenth_school_city: '', tenth_board_name: '', tenth_field: '' },
        experience: { designation: '', start_month: '', start_year: '', end_month: '', end_year: '', company: '', company_city: '', work_description: '' }
        // Add more fields for each step
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleInputChange = (field, subfield, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: {
                ...prevFormData[field],
                [subfield]: value,
            },
        }));
    };

    // const handleAddItem = (field) => {
    //     setFormData({
    //         ...formData,
    //         [field]: [...formData[field], {}],
    //     });
    // };


    const handleTechSkillInputChange = (index, value) => {
        const updatedTechSkills = [...formData.tech_skills];
        updatedTechSkills[index] = value;
        setFormData(prevFormData => ({
            ...prevFormData,
            tech_skills: updatedTechSkills
        }));
    };

    const handleSoftSkillInputChange = (index, value) => {
        const updatedSoftSkills = [...formData.soft_skills];
        updatedSoftSkills[index] = value;
        setFormData(prevFormData => ({
            ...prevFormData,
            soft_skills: updatedSoftSkills
        }));
    };

    const handleAddItem = (field) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: [...prevFormData[field], '']
        }));
    };

    const handleRemoveItem = (field, index) => {
        const updatedItems = [...formData[field]];
        updatedItems.splice(index, 1);
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: updatedItems
        }));
    };

    // const handleRemoveItem = (field, index) => {
    //     const updatedItems = [...formData[field]];
    //     updatedItems.splice(index, 1);
    //     setFormData({
    //         ...formData,
    //         [field]: updatedItems,
    //     });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null)
        if (!formData.full_name || !formData.email || !formData.phone || !formData.address || !formData.linkedinUrl || !formData.summary || !formData.tech_skills || !formData.soft_skills || !formData.experience || !formData.graduation || !formData.twelfth || !formData.tenth) {
            console.log("please fill all the feilds")
            setError("Filling all the feild are compulsory.")
            return;
        }
        setUrl(null)
        console.log(formData)
        try {
            const response = await axios.post("https://diamond-ore-job-portal-backend.vercel.app/api/candidates/free-resume"
                , formData
            )

            if (response.status === 200) {
                console.log(response.data)
                const myurl = response.data
                setUrl(myurl)
                alert("form has been submitted click on dawnload button to dawunload your CV")
                console.log('Form submitted:', formData);
            }

        }
        catch (error) {
            console.log("error in building resume", error)

        }
        // Handle form submission, e.g., submit data to backend

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
            <div className="flex items-center bg-gray-50">
                <div className=" mx-auto max-w-screen-xl sm:max-w-screen-lg lg:mx-auto md:max-w-screen-md lg:max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 shadow-lg bg-white rounded-md  ">
                    <div className="flex rounded-lg mr-4 ">
                        <div className="hidden md:block">
                            <img src={simg} />
                        </div>
                        {/* <div className='border border-1 border-black flex flex-col w-full p-4'>
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

                        </div> */}
                    </div>
                    <div className="space-y-4">
                        <form onSubmit={handleSubmit}>
                            {/* Step 1 */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 className='font-bold text-4xl '>Personal Details</h2>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
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
                                        type="text"
                                        name="linkedinUrl"
                                        value={formData.linkedinUrl}
                                        onChange={handleChange}
                                        placeholder="Linkdin URL"
                                        className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                    />
                                    <textarea
                                        type="text"
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleChange}
                                        placeholder="Your summary"
                                        className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                    />
                                    {/* objective */}
                                    {/* <div className="sm:col-span-2 ">
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
                                    </div> */}


                                    <button type="button" onClick={nextStep} className="mt-4 bg-blue-950 text-white px-4 py-2 rounded-md float-right">Next</button>
                                </div>
                            )}



                            {/* Step 2 */}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className='font-bold text-4xl mb-2'>Educational Details</h2>

                                    <div className="sm:col-span-2">
                                        <h1>Graduation details</h1>

                                        <input
                                            type="text"
                                            placeholder="Enter Degree/ Feild Of Study"
                                            className="border border-1 rounded-md px-3 py-2 mt-2 w-full "
                                            value={formData.graduation.degree_name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "graduation",
                                                    "degree_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="Enter Feild"
                                            className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                            value={formData.graduation.degree_field}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "graduation",
                                                    "degree_field",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="Graduation year"
                                            className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                            value={formData.graduation.graduation_year}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "graduation",
                                                    "graduation_year",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="unvirsity name"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.graduation.university_name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "graduation",
                                                    "university_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="unvirsity city"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.graduation.university_city}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "graduation",
                                                    "university_city",
                                                    e.target.value
                                                )
                                            }
                                        />



                                        {/*  12th details */}
                                        <h1>12th DETAILS</h1>

                                        <input
                                            type="text"
                                            placeholder="twelfth _feilds"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.twelfth.twelfth_field}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "twelfth",
                                                    "twelfth_field",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="twelfth_year"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.twelfth.twelfth_year}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "twelfth",
                                                    "twelfth_year",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="twelfth_school name"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.twelfth.twelfth_school_name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "twelfth",
                                                    "twelfth_school_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="twelfth school city"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.twelfth.twelfth_school_city}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "twelfth",
                                                    "twelfth_school_city",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="twelfth_board name"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.twelfth.twelfth_board_name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "twelfth",
                                                    "twelfth_board_name",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <h1>10th details</h1>

                                        <input
                                            type="text"
                                            placeholder="tenth feilds"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.tenth.tenth_field}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "tenth",
                                                    "tenth_field",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="tenth year"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.tenth.tenth_year}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "tenth",
                                                    "tenth_year",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="tenth school name"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.tenth.tenth_school_name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "tenth",
                                                    "tenth_school_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="tenth school city"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.tenth.tenth_school_city}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "tenth",
                                                    "tenth_school_city",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="tenth board name"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.tenth.tenth_board_name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "tenth",
                                                    "tenth_board_name",
                                                    e.target.value
                                                )
                                            }
                                        />



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

                                        <input
                                            type="text"
                                            placeholder="Designation"
                                            className="border border-1 rounded-md px-3 py-2 mt-2 w-full "
                                            value={formData.experience.designation}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "designation",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="starth month"
                                            className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                            value={formData.experience.start_month}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "start_month",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="start Year"
                                            className="border border-1 rounded-md px-3 py-2 mt-2 w-full"
                                            value={formData.experience.start_year}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "start_year",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <input
                                            type="text"
                                            placeholder="end_month"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.experience.end_month}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "end_month",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <input
                                            type="text"
                                            placeholder="end_year"
                                            className=" border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            value={formData.experience.end_year}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "end_year",
                                                    e.target.value
                                                )
                                            }
                                        />


                                        <input
                                            type="text"
                                            value={formData.experience.company}
                                            placeholder="company name"
                                            className="border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "company",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <input
                                            type="text"
                                            value={formData.experience.company_city}
                                            placeholder="company city"
                                            className="border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "company_city",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <textarea
                                            type="text"
                                            value={formData.experience.work_description}
                                            placeholder="work discription"
                                            className="border border-1 rounded-md px-3 py-2 mt-2 w-full mb-2"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "work_description",
                                                    e.target.value
                                                )
                                            }
                                        />


                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-md">Previous</button>
                                        <button type="button" onClick={nextStep} className="bg-blue-950 text-white px-4 py-2 rounded-md">Next</button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div>
                                    <h2 className='font-bold text-4xl mb-2'>Skills</h2>
                                    <div className="sm:col-span-2 ">
                                        <h1>Tech Skills</h1>
                                        {formData.tech_skills.map((skill, index) => (
                                            <div key={index}>
                                                <input
                                                    type="text"
                                                    className="w-3/4 rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 my-1"
                                                    value={skill}
                                                    placeholder="Enter skill"
                                                    onChange={(e) =>
                                                        handleTechSkillInputChange(index, e.target.value)
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-red-400 p-2 text-gray-100 p-4 mx-4 rounded-md"
                                                    onClick={() => handleRemoveItem("tech_skills", index)}
                                                >
                                                    <svg class="h-3 w-3 text-slate-50" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => handleAddItem("tech_skills")}
                                            className="p-2 my-2 bg-green-500 rounded text-gray-100"
                                        >
                                            Add Tech Skill
                                        </button>

                                        <h1>Soft Skills</h1>
                                        {formData.soft_skills.map((skill, index) => (
                                            <div key={index}>
                                                <input
                                                    type="text"
                                                    className="w-3/4 rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 my-1"
                                                    value={skill}
                                                    placeholder="Enter skill"
                                                    onChange={(e) =>
                                                        handleSoftSkillInputChange(index, e.target.value)
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-red-400 p-2 text-gray-100 p-4 mx-4 rounded-md"
                                                    onClick={() => handleRemoveItem("soft_skills", index)}
                                                >
                                                    <svg class="h-3 w-3 text-slate-50" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => handleAddItem("soft_skills")}
                                            className="p-2 my-2 bg-green-500 rounded text-gray-100"
                                        >
                                            Add Soft Skill
                                        </button>
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-md">Previous</button>
                                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Submit</button>
                                    </div>

                                    <a href={url} className='bg-blue-950 text-white uppercase p-4 flex justify-center mt-10'> dawnload Your Free CV</a>
                                </div>

                            )}



                        </form>
                        {error && (
                            <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
                                <p className="text-center text-sm text-red-500">{error}</p>
                            </div>
                        )}
                    </div>

                </div>


            </div>
            <Footer />
        </div>
    )
}

export default Cvform