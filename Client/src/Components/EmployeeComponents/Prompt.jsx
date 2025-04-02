import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ConstructionOutlined } from "@mui/icons-material";
import { FadeLoader } from "react-spinners";

export default function Prompt() {
  const [openModal, setOpenModal] = useState(false);
  const [loading,setLoading] = useState(false)
  const [phoneNumber,setPhoneNumber] = useState()
  const [jobsData,setJobsData] = useState()

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    
    formState: { errors,isSubmitting },
  } = useForm();

  
   
  const token = localStorage.getItem("token")

  const onSubmit = async(data) => {

    try{
        setLoading(true)

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/employee/upload-dsr-by-employee`,data,{
            
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        reset()
    }
    catch(err){
      
        alert(err.response.data.message)
        return
    }
    finally{
       setLoading(false)
    }
    
  };

  const formState = [
    {
      label: "Candidate Name",
      inputType: "text",
      name: "candidateName",
      error: {
        required: "Candidate name is required",
        minLength: { value: 3, message: "Minimum 4 characters required" },
        maxLength: { value: 24, message: "Maximum 10 characters allowed" },
      },
    },
    {
      label: "Email",
      inputType: "email",
      name: "email",
    },
    {
      label: "Phone",
      inputType: "number",
      name: "phone",
      error: {
        required: "Phone no. is required",
 
      },
    },
    {
      label: "Current Company",
      inputType: "text",
      name: "currentCompany",
    },
    {
      label: "Current Channel",
      inputType: "text",
      name: "currentChannel",
    },
    {
      label: "Current CTC",
      inputType: "number",
      name: "currentCTC",
      error: { required: "Current ctc is required" },
    },
    {
      label: "Current Location",
      inputType: "text",
      name: "currentLocation",
      error: { required: "Current location is required" },
    },
    {
      label: "Recruiter Name",
      inputType: "text",
      name: "recruiterName",
      error: { required: "Recruiter name is required" },
    },
    {
      label: "KAM Name",
      inputType: "text",
      name: "kamName",
      error: { required: "Kam Name is required" },
    },
    {
      label: "Date",
      inputType: "date",
      name: "currentDate",
      error: { required: "Date is required" },
    }
  ];


  const handleFetchJobs = async()=>{
        try {           
            setLoading(true);
                   const response = await axios.get(
                       `${import.meta.env.VITE_BASE_URL}/admin-confi/findJobs/${phoneNumber}`
                   );
                   console.log(response.data)
                    setJobsData(response.data)
                    
               } catch (error) {
                   setJobsData(error.response.data)
                   alert(error.response.data.message)
                   return
               } finally { 
                setLoading(false);              
               }
  }


  console.log("afed",jobsData)




  return (
    <div className=" w-full h-full">
      {openModal ? (
        <div className="  min-h-[80vh] shadow-md z-50 flex flex-col items-center justify-start p-3 rounded-md border border-gray-300 "> 

          <div className=" flex items-end relative gap-2 justify-center  w-full max-w-[95vw] sm:max-w-[80vw] ">
            <button
              onClick={() => {
                setOpenModal(false);
                setPhoneNumber("")
                setJobsData([])
              }}
              className="absolute top-0 right-0 text-red-600 text-2xl"
            >
              ✖
            </button>
            <div className="w-full">
              <h2 className="text-lg font-semibold mb-4">Enter Phone Number</h2>
              <input
                type="tel" 
                placeholder="Phone Number"
                className="border p-[0.4rem] w-full rounded"
                onChange={(e)=>{
                    setPhoneNumber(e.target.value)
                    setJobsData([])
                }}
              />
            </div>
            <button onClick={handleFetchJobs} className=" bg-blue-500 text-white py-[0.45rem] px-4 rounded w-full sm:w-[30%]">
            {loading? <div className="border-2 mx-auto rounded-full border-dashed animate-spin border-white size-5"></div>:"Search"} 
            </button>
          </div>

                <div>

                {jobsData?.suitableJobs?.length>0 && (
                        <div className="px-4 md:px-40 py-4">
                            <h2 className="text-2xl font-bold mb-4 text-center">Recommended Jobs For {jobsData?.candidateName}</h2>

                            <div className="relative md:w-full w-80 overflow-x-auto rounded-md">
                                <table className="w-full text-sm text-left text-gray-500  rounded-md border">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100  ">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Company</th>
                                            <th scope="col" className="px-6 py-3">Job Title</th>
                                            <th scope="col" className="px-6 py-3">Industry</th>
                                            <th scope="col" className="px-6 py-3">Channel</th>
                                            <th scope="col" className="px-6 py-3">City</th>
                                            <th scope="col" className="px-6 py-3">Min Experience</th>
                                            <th scope="col" className="px-6 py-3">Max Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody className=''>
                                        {jobsData?.suitableJobs?.map((job, index) => (
                                            <tr key={index} className="bg-white border-b   ">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">{job.Company}</td>
                                                <td className="px-6 py-4">{job.JobTitle}</td>
                                                <td className="px-6 py-4">{job.Industry}</td>
                                                <td className="px-6 py-4">{job.Channel}</td>
                                                <td className="px-6 py-4">{job.City}</td>
                                                <td className="px-6 py-4 text-center">{job.MinExperience}</td>
                                                <td className="px-6 py-4 text-center">{job.MaxSalary}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {jobsData.success==false&&<p>No jobs found</p>}
                    
                </div>
        </div>
      ) : (
        <div className=" relative pt-12">
          <button
            onClick={() => {
              setOpenModal(true);
            }}
            className="bg-blue-500 font-semibold text-sm border border-red-500 rounded-sm text-white p-[0.4rem] absolute right-0 top-0"
          >
            Search by Phone number
          </button>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-[45rem] mx-auto bg-white p-6 rounded-lg shadow-md grid grid-cols-1 border border-gray-300 md:grid-cols-2 gap-4"
          >
            <p className="md:col-span-2 text-2xl font-bold text-center">
               Upload candidate info.
            </p>
            {formState.map((input, index) => (
              <div key={index} className="">
                <label className="block text-gray-700 text-sm">
                  {input.label}
                </label>
                <input
                
                  type={input.inputType}
                  {...register(input.name, input.error)}
                  className={`w-full px-2 py-[0.3rem] border rounded-sm focus:outline-none focus:ring-1 ${
                    errors[input.name]
                      ? "border-red-500 "
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors[input.name] && (
                  <span className="text-red-500 text-sm">
                    {errors[input.name].message}
                  </span>
                )}
              </div>
            ))}
            <button type="submit" className="w-full bg-blue-500 text-white py-[0.4rem] rounded-sm hover:bg-blue-600 md:col-span-2">
             {isSubmitting? <div className="border-2 mx-auto rounded-full border-dashed animate-spin border-white size-5"></div>:"Submit"} 
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
