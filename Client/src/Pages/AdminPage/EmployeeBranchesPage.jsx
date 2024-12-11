import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import EmployessEditDetails from '../../Components/EmployeeComponents/EmployessEditDetails';
import crossIcon from '../../assets/crossIcon.svg'

const EmployeeBranchesPage = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState('')
    const [editEmployeeToggle, setEditEmployeeToggle] = useState(false);
    const [update, setUpdate] = useState(false);

    // get Employee Data


    useEffect(() => {
        const getEmployeeData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`https://api.diamondore.in/api/admin-confi/all-employees/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.status === 201) {

                    setEmployee(response.data);


                }

            }
            catch (error) {

            }

        }


        getEmployeeData();
    }, [])


    const handleEditEmloyeeClick = () => {

        setEditEmployeeToggle(prev => !prev);


    }



    const handleEditEmployeeBack = () => {
        setEditEmployeeToggle(prev => !prev);

    }

    const employeename = employee?.name;
    // 

    return (
        <div className='realtive'>

            {editEmployeeToggle && (
                <>
                    {/* Overlay with opacity */}
                    <div className='fixed top-10 left-0 z-20 h-screen w-full bg-black opacity-60  '></div>

                    <div className='ml-8  absolute z-40 cursor-pointer'  >

                        <img onClick={handleEditEmployeeBack} src={crossIcon} alt="" className='h-12 w-12  z-40 cursor-pointer' />
                    </div>
                    {/* Popup Form */}
                    <div className=' mt-20 absolute z-30 inset-0 flex justify-center items-center'>
                        <div className='mt-28  p-6 rounded-lg  max-w-lg w-full'>
                            <EmployessEditDetails id={employee._id} handleEditEmployeeBack={handleEditEmployeeBack} />
                        </div>
                    </div>
                </>
            )}


            <div>

                <h1 className='text-center text-3xl uppercase'>{employee.name}</h1>
                <button onClick={handleEditEmloyeeClick} className='bg-blue-900 px-3 py-2 text-white rounded-sm font-medium right-14 absolute'> Edit Employee </button>
                <div className='mx-auto w-20 h-1 bg-blue-900'></div>

                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-10 md:px-20 px-2   my-20 '>

                    {employee.accountHandler && <Link className='rounded-md relative flex h-60 items-center justify-center overflow-hidden bg-blue-900 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96'>
                        <Link to={`/admin-dashboard/each-account/${id}`} className='relative z-10 text-xl cursor-pointer'>Account Handling</Link>
                    </Link>}

                    <Link className='rounded-md relative flex h-60 items-center justify-center overflow-hidden bg-blue-900 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96'>
                        <Link to={`/admin-dashboard/kpi/${id}`} className='relative z-10 text-xl'>KPI Score</Link>
                    </Link>

                    <Link to={`/admin-dashboard/goal-sheet/${id}/${encodeURIComponent(employeename)}`} className="rounded-md relative flex h-60 items-center justify-center overflow-hidden bg-blue-900 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96">
                        <span className="relative z-10 text-xl">Goal Sheet</span>
                    </Link>

                    <Link className='rounded-md relative flex h-60 items-center justify-center overflow-hidden bg-blue-900 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96'>
                        <Link className='relative z-10 text-xl'>Incentive</Link>
                    </Link>


                </div>


            </div>


        </div>
    )
}

export default EmployeeBranchesPage