import React from 'react'



const EmpHome = ({ employee, latestnews, hrname, client, RnRinterns, RnRRecruiter, Joinings , userData }) => {

    console.log( "employee", employee)


    return (
        <>

        <span className='text-4xl font-bold text-gray-700'>Welcome,</span>
        <span className='font-bold text-4xl ml-2 text-gray-700'>{userData?.name}</span>

            {latestnews?.map((newNews) => (
                <div id="alert-additional-content-3" class="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800 mt-8" role="alert">
                    <div class="flex items-center">
                        <svg class="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span class="sr-only">Info</span>
                        <h3 class="text-lg font-medium">Breaking News & Annoucement</h3>
                    </div>
                    <div class="mt-2 mb-4 text-sm">
                        {newNews.news}
                    </div>
                    {/* <div class="flex">
                    <button type="button" class="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <svg class="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                        </svg>
                        View more
                    </button>
                    <button type="button" class="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-green-600 dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:focus:ring-green-800" data-dismiss-target="#alert-additional-content-3" aria-label="Close">
                        Dismiss
                    </button>
                </div> */}
                </div>
            ))}

            {/* Employee Of the Month  */}

            <div className='my-10 '>
                <div className='grid grid-cols-1 md:grid-cols-3 px-6'>
                    <div className='col'>
                        <div className='absolute border border-blue-900 border-2 opacity-1 h-40 w-60 mt-10 '></div>
                        <div><img className="relative bottom-1 left-10  w-60 h-40 " src="https://easy-feedback.de/wp-content/uploads/2022/10/Employee-Journey-What-it-is-and-how-to-improve-it.jpg" alt="" /></div>
                    </div>

                    <div className='md:col-span-2  mt-20 md:mt-0 flex flex-col '>
                        <h1 className='uppercase font-bold text-3xl md:text-5xl text-gray-700'>Employee of the month</h1>

                        <div className='mt-4'>
                            <h1 className='font-bold text-xl capitilized'>{employee?.name}</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga quisquam ratione facere quaerat quam. Iste dolorum, quod sed nihil sint, debitis vel illo, voluptas labore odit nulla dolore? Libero exercitationem fuga harum quo! Delectus sequi ut est sunt, a doloremque ipsum impedit culpa maiores possimus suscipit nostrum id quidem, odio nihil aut expedita, perspiciatis repudiandae. Soluta voluptates rerum hic odit?</p>
                        </div>
                    </div>

                </div>

            </div>

            <div className='mx-auto bg-blue-900 w-60  h-0.5'></div>


            {/* hr and clints div */}

            <div className='mt-10 md:mt-20 md:px-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    <div className=''>
                        <h1 className='uppercase text-2xl font-semibold  text-gray-900 px-10 py-2 text-center'> Top 5 hr</h1>
                        <table className="w-full text-sm text-center rtl:text-right text-gray-500 border border-1">
                            <thead className="text-xs text-gray-700 uppercase bg-white  ">
                                <tr className="bg-blue-900 text-white">
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
                        <h1 className='uppercase text-xl font-semibold  text-gray-900 px-10 py-2 text-center'> Top 5 Clients</h1>
                        <table className="w-full text-sm text-center rtl:text-right text-gray-500 border border-1">
                            <thead className="text-xs text-gray-700 uppercase bg-white  ">
                                <tr className="bg-blue-900 text-white">
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

            <div className='mt-20 px-2'>
                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-10'>
                    <div className='md:overflow-auto overflow-scroll'>
                        <h1 className='uppercase text-2xl font-semibold  text-gray-900 px-10 py-2 text-center'>R & R LeaderBoard</h1>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-1 ">
                            <thead className="text-xs text-gray-700 uppercase   text-center">
                                <tr className='bg-blue-900 text-white'>
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
                                    <tr className="bg-white border-b hover:bg-gray-50 text-center">
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
                    <div className='md:overflow-auto overflow-scroll'>
                        <h1 className='uppercase text-xl font-semibold  text-gray-900 px-10 py-2 text-center'>R & R LeaderBoard Recruiter</h1>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-1 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                                <tr className='bg-blue-900 text-white text-center'>
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

                                    <tr className="bg-white border-b hover:bg-gray-50 text-center ">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center"
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

            <div className='mt-6 mb-10 md:overflow-auto overflow-scroll'>
                <h1 className='uppercase text-xl font-semibold  text-gray-900 px-10 py-2 text-center'> This Week's Joinings</h1>
                <table className="w-full text-sm text-center rtl:text-right text-gray-500 border">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center border">
                        <tr className="bg-blue-950 text-white">
                            <th scope="col" className="px-6 py-3">
                                position
                            </th>
                            <th scope="col" className="px-6 py-3">
                                No. of joinings
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Joinings?.map((join) => (
                            <tr className="bg-white border-b  hover:bg-gray-50 ">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                    {join.names}
                                </th>
                                <td className="px-6 py-4">{join.noOfJoinings}</td>
                            </tr>

                        ))}

                    </tbody>
                </table>
            </div>


        </>
    )
}

export default EmpHome