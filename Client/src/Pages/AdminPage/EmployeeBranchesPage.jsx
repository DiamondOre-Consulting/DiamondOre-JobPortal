import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

const EmployeeBranchesPage = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState('')

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

                    setEmployee(response.data)
                    ;

                }

            }
            catch (error) {
                console.log(error, 'this is the error')
            }

        }


        getEmployeeData();
    }, [])
    return (
        <>

            <div>

                <h1 className='text-center text-3xl uppercase'>{employee.name}</h1>
                <div className='mx-auto w-20 h-1 bg-blue-900'></div>

                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-10 md:px-20 px-2   my-20 '>

                    <Link className='rounded-md relative flex h-60 items-center justify-center overflow-hidden bg-blue-900 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96'>
                        <Link to={`/admin-dashboard/each-account/${id}`} className='relative z-10 text-xl cursor-pointer'>Account Handling</Link>
                    </Link>

                    <Link className='rounded-md relative flex h-60 items-center justify-center overflow-hidden bg-blue-900 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96'>
                        <Link to={`/admin-dashboard/kpi/${id}`} className='relative z-10 text-xl'>KPI Score</Link>
                    </Link>

                     <Link to={`/admin-dashboard/goal-sheet/${id}`}  className='rounded-md relative flex h-60 items-center justify-center overflow-hidden bg-blue-900 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96'>
                        <Link to={`/admin-dashboard/goal-sheet/${id}`} className='relative z-10 text-xl'>Goal Sheet</Link>
                    </Link>

                    <Link className='rounded-md relative flex h-60 items-center justify-center overflow-hidden bg-blue-900 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-950 before:duration-500 before:ease-out hover:shadow-blue-950 hover:before:h-96 hover:before:w-96'>
                        <Link className='relative z-10 text-xl'>Incentive</Link>
                    </Link>


                </div>


            </div>


        </>
    )
}

export default EmployeeBranchesPage