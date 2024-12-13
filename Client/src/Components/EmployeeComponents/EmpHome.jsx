import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti';


const EmpHome = ({ employee, latestnews, profilePicUrl, hrname, client, RnRinterns, RnRRecruiter, Joinings, userData, empOfMonthDesc, recognitionType }) => {

    const [showConfetti, setShowConfetti] = useState(true);
    useEffect(() => {
        // Automatically stop the confetti after 5 seconds
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 20000);

        return () => clearTimeout(timer);
    }, []);



    return (
        <div className='relative overflow-x-hidden'>
            {showConfetti && <Confetti />}
            <span className='text-4xl font-bold text-gray-700'>Welcome,</span>
            <span className='ml-2 text-4xl font-bold text-gray-700'>{userData?.name}</span>

            {latestnews?.map((newNews, index) => (
                <div key={index} id="alert-additional-content-3" className="p-4 mt-8 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50" role="alert">
                    <div className="flex items-center">
                        <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <h3 className="text-lg font-medium">Breaking News & Annoucement</h3>
                    </div>
                    <div className="mt-2 mb-4 text-sm">
                        {newNews.news}
                    </div>
                    {/* <div class="flex">
                    <button type="button" class="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center   ">
                        <svg class="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                        </svg>
                        View more
                    </button>
                    <button type="button" class="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center     " data-dismiss-target="#alert-additional-content-3" aria-label="Close">
                        Dismiss
                    </button>
                </div> */}
                </div>
            ))}

            {/* Employee Of the Month  */}

            <div className='my-10 '>
                <div className='grid grid-cols-1 px-6 md:grid-cols-3'>
                    <div className='col'>
                        <div className='absolute mt-10 border border-2 border-blue-900 h-52 opacity-1 w-60 '></div>
                        <div><img className="relative object-cover h-52 bottom-1 left-10 w-60 " src={profilePicUrl || "https://easy-feedback.de/wp-content/uploads/2022/10/Employee-Journey-What-it-is-and-how-to-improve-it.jpg"} alt="" /></div>
                    </div>

                    <div className='flex flex-col mt-20 md:col-span-2 md:mt-0 '>
                        {/* <h1 className='text-3xl font-bold text-gray-700 uppercase md:text-5xl'>Employee of the month</h1> */}
                        <h1 className='text-3xl font-bold text-gray-700 uppercase md:text-5xl'>{recognitionType}</h1>

                        <div className='mt-4'>
                            <h1 className='text-xl font-bold capitilized'>{employee?.name}</h1>
                            <p>{empOfMonthDesc}</p>
                        </div>
                    </div>

                </div>

            </div>

            <div className='mx-auto bg-blue-900 w-60  h-0.5'></div>


            {/* hr and clints div */}

            <div className='mt-10 md:mt-20 md:px-6'>
                <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
                    <div className=''>
                        <h1 className='px-10 py-2 text-2xl font-semibold text-center text-gray-900 uppercase'> Top 5 hr</h1>
                        <table className="w-full text-sm text-center text-gray-500 border rtl:text-right border-1">
                            <thead className="text-xs text-gray-700 uppercase bg-white ">
                                <tr className="text-white bg-blue-900">
                                    <th scope="col" className="px-6 py-3">
                                        serial No
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Top5hrs
                                    </th>
                                </tr>

                                {hrname?.map((hrs) => (
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            {hrs.serialNumber}
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            {hrs.name}
                                        </th>
                                    </tr>
                                ))}
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    <div className=''>
                        <h1 className='px-10 py-2 text-xl font-semibold text-center text-gray-900 uppercase'> Top 5 Clients</h1>
                        <table className="w-full text-sm text-center text-gray-500 border rtl:text-right border-1">
                            <thead className="text-xs text-gray-700 uppercase bg-white ">
                                <tr className="text-white bg-blue-900">
                                    <th scope="col" className="px-6 py-3">
                                        S. No.
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Top5Client
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {client?.map((cl) => (
                                    <tr className="bg-white">
                                        <th scope="col" className="px-6 py-3">
                                            {cl.serialNumber}
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            {cl.name}
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>


            {/* leaderbord & joinings */}

            <div className='px-2 mt-20'>
                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-10'>
                    <div className='overflow-scroll md:overflow-auto'>
                        <h1 className='px-10 py-2 text-2xl font-semibold text-center text-gray-900 uppercase'>R & R LeaderBoard Interns</h1>
                        <table className="w-full text-sm text-left text-gray-500 border rtl:text-right border-1 ">
                            <thead className="text-xs text-center text-gray-700 uppercase">
                                <tr className='text-white bg-blue-900'>
                                    <th scope="col" className="px-6 py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Counts
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Percentage
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {RnRinterns?.map((interns) => (
                                    <tr className="text-center bg-white border-b hover:bg-gray-50">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                        >
                                            {interns.title}
                                        </th>
                                        <td className="px-6 py-4">{interns.name}</td>
                                        <td className="px-6 py-4">{interns.count}</td>
                                        <td className="px-6 py-4">{interns.percentage}</td>
                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>
                    <div className='overflow-scroll md:overflow-auto'>
                        <h1 className='px-10 py-2 text-xl font-semibold text-center text-gray-900 uppercase'>R & R LeaderBoard Recruiter</h1>
                        <table className="w-full text-sm text-left text-gray-500 border rtl:text-right border-1 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                                <tr className='text-center text-white bg-blue-900'>
                                    <th scope="col" className="px-6 py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Counts
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Percentage
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {RnRRecruiter?.map((recuiter) => (

                                    <tr className="text-center bg-white border-b hover:bg-gray-50 ">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap"
                                        >
                                            {recuiter.title}
                                        </th>
                                        <td className="px-6 py-4">{recuiter.name}</td>
                                        <td className="px-6 py-4">{recuiter.count}</td>
                                        <td className="px-6 py-4">{recuiter.percentage}</td>
                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>



                </div>
            </div>

            <div className='mt-6 mb-10 overflow-scroll md:overflow-auto'>
                <h1 className='px-10 py-2 text-xl font-semibold text-center text-gray-900 uppercase'> This Week's Joinings</h1>
                <table className="w-full text-sm text-center text-gray-500 border rtl:text-right">
                    <thead className="text-xs text-center text-gray-700 uppercase border bg-gray-50">
                        <tr className="text-white bg-blue-950">
                            <th scope="col" className="px-6 py-3">
                                Channel
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Client
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Recruiter Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tema Leader
                            </th>
                            <th scope="col" className="px-6 py-3">
                                No. of joinings
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Joinings?.map((join) => (
                            <tr className="bg-white border-b hover:bg-gray-50 ">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                    {join.names}
                                </th>

                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                    {join.client}
                                </th>
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                    {join.location}
                                </th>

                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                    {join.recruiterName}
                                </th>

                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                    {join.teamLeaderName}
                                </th>



                                <td className="px-6 py-4">{join.noOfJoinings}</td>
                            </tr>

                        ))}

                    </tbody>
                </table>
            </div>


        </div>
    )
}

export default EmpHome