
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import axios from "axios";
import loader from '../../assets/loader.svg'

const EmployessEditDetails = ({ id, handleEditEmployeeBack }) => {
    const navigate = useNavigate();
    const { decodedToken } = useJwt(localStorage.getItem("token"));
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/admin-login");
        } else {
            const tokenExpiration = decodedToken ? decodedToken.exp * 1000 : 0;

            if (tokenExpiration && tokenExpiration < Date.now()) {
                localStorage.removeItem("token");
                navigate("/admin-login");
            }
        }
    }, [decodedToken, navigate, token]);
    // 



    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [empType, setEmpType] = useState('');
    const [dob, setDob] = useState('');
    const [doj, setDoj] = useState('');
    const [error, setError] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const [added, setAdded] = useState(null);
    const [accountHandler, setAccountHandler] = useState()
    const [editEmployee, setEditEmployee] = useState();
    const [loading, setLoading] = useState(false)


    const [employee, setEmployeeData] = useState()

    useEffect(() => {
        setEditEmployee(employee);
    }, [employee]);



    useEffect(() => {
        const getEmployeeData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.status === 201) {

                    setEmployeeData(response.data);

                }

            }
            catch (error) {


            }

        }


        getEmployeeData();
    }, [])












    const hadnleEditEmplyeeDetails = async () => {
        // Log the editEmployee to check its structure

        try {
            setLoading(true);
            const id = employee._id; // Get the employee ID

            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees-edit/${id}`,  // Correct URL format
                editEmployee,  // Pass the editEmployee object directly (ensure it's structured correctly)
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization header
                    }
                }
            );



            // setRerender(prev=>!prev)
            handleEditEmployeeBack();
            // Log the response data


        } catch (error) {
            console.error("Error updating employee:", error);  // Log the error if something goes wrong
        }
        finally {
            setLoading(false)

        }
    }

    const hadndleFullName = (e) => {

        setEmployeeData(prevDetails => (
            {
                ...prevDetails,
                name: e.target.value
            }))

    }

    const handleEditEmployeeEmail = (e) => {
        setEmployeeData(prevDetails => (
            {
                ...prevDetails,
                email: e.target.value
            }))
    }


    const handleEditEmpType = (e) => {
        setEmployeeData(prevDetails => (
            {
                ...prevDetails,
                empType: e.target.value
            }))
    }

    const handleKPIDesignationType = (e) => {
        setEmployeeData(prevDetails => (
            {
                ...prevDetails,
                kpiDesignation: e.target.value
            }))
    }


    const handleEditAccountHandler = (e) => {
        setEmployeeData(prevDetails => (
            {
                ...prevDetails,
                accountHandler: e.target.value === "true"
            }))
    }


    const handleEditEmployeeDob = (e) => {
        setEmployeeData(prevDetails => (
            {
                ...prevDetails,
                dob: e.target.value
            }))
    }

    const handleEditEmployeeDoj = (e) => {
        setEmployeeData(prevDetails => (
            {
                ...prevDetails,
                doj: e.target.value
            }))
    }







    if (!editEmployee || loading) {
        return (
            <div className="flex justify-center items-center"> <img className="h-16 w-16" src={loader} alt="Loader" /> </div>
        )
    }



   console.log("employee",editEmployee)






    return (
        <div className="mx-auto max-w-screen-xl  px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg">
                <div

                    className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-white shadow-gray-300"
                >
                    <p className="text-center text-xl uppercase font-bold">

                        Edit Employee
                    </p>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            className="w-full rounded-lg border p-4 text-sm shadow-sm mt-1"
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Full Name"
                            value={editEmployee?.name}
                            onChange={hadndleFullName}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            className="w-full rounded-lg border p-4 text-sm shadow-sm mt-1"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={editEmployee.email}
                            onChange={handleEditEmployeeEmail}
                        />
                    </div>

                    <div>
                        <label htmlFor="empType" className="block text-sm font-medium text-gray-700">
                            Designation
                        </label>
                        <select
                            className="py-2 w-full px-2 rounded-md mt-1"
                            value={editEmployee.empType}
                            onChange={handleEditEmpType}
                        >
                            <option value="">Select Designation</option>
                            <option value="Recruiter">Recruiter</option>
                            <option value="SeniorRecruiter"> Senior Recruiter</option>
                            <option value="TeamLeader">Team Leader</option>
                            <option value="Trainee2x">Trainee 2x</option>
                            <option value="JrRecruiter3x">Jr Recruiter 3x</option>
                            <option value="Recruiter&Mentor4x">Recruiter & Mentor 4x</option>
                            <option value="Sr.Recruiter&Mentor5x">Sr. Recruiter & Mentor 5x</option>
                            <option value="TeamLeader6x">Team Leader 6x</option>
                            <option value="HrConsultant6x">Hr Consultant 6x</option>


                        </select>
                    </div>

                    <div>
                        <label htmlFor="empType" className="block text-sm font-medium text-gray-700">
                            KPI Designation
                        </label>
                        <select
                            className="py-2 w-full px-2 rounded-md mt-1"
                            value={editEmployee?.kpiDesignation}
                            onChange={handleKPIDesignationType}
                        >
                            <option value="">Select KPI Designation</option>
                            <option value="Recruiter/KAM/Mentor">Recruiter/KAM/Mentor</option>
                            <option value="Sr. Consultant">Sr. Consultant</option>                            
                            <option value="Recruiter">Recruiter</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="empType" className="block text-sm font-medium text-gray-700">
                            Account Handeling
                        </label>
                        <select
                            className="py-2 w-full px-2 rounded-md mt-1"
                            value={editEmployee.accountHandler}
                            onChange={handleEditAccountHandler}
                        >
                            <option value="">Select Account Handeling</option>
                            <option value="true">Yes </option>
                            <option value="false">No</option>



                        </select>
                    </div>

                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            className="w-full rounded-lg border p-4 text-sm shadow-sm mt-1"
                            type="date"
                            id="dob"
                            name="dob"
                            placeholder="Date of Birth"
                            value={editEmployee.dob}
                            onChange={handleEditEmployeeDob}
                        />
                    </div>

                    <div>
                        <label htmlFor="doj" className="block text-sm font-medium text-gray-700">
                            Date of Joining
                        </label>
                        <input
                            className="w-full rounded-lg border p-4 text-sm shadow-sm mt-1"
                            type="date"
                            id="doj"
                            name="doj"
                            placeholder="Date of Joining"
                            value={editEmployee.doj}
                            onChange={handleEditEmployeeDoj}
                        />
                    </div>



                    <button
                        onClick={hadnleEditEmplyeeDetails}
                        className={`block w-full rounded-lg bg-blue-900 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600`}

                    >
                        Edit Employee Details
                    </button>



                    {error && (
                        <p className="text-center text-red-500">
                            {error}
                        </p>
                    )}
                </div>

                {added && (
                    <div className="flex items-center justify-center bg-green-400 p-4 rounded-md mt-4">
                        <p className="text-center text-sm text-white">{added}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployessEditDetails;











