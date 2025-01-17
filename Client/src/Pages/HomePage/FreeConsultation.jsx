import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const FreeConsultation = () => {
    return (
        <>
            <Navbar />
            <div>
                <div className='px-12'>
                    <h1 className='font-bold text-3xl mt-40'>Book Free Consultation</h1>
                    <div className='h-1 rounded-full w-44 bg-blue-900'></div>
                </div>

                <div className='mt-20 px-4 md:px-10'>
               
                        <li className="divide-y divide-gray-200 rounded-lg bg-white shadow flex-col flex-col justify-center md:w-1/2  mx-auto mb-10">
                            <div className="flex w-full items-center justify-between space-x-6 p-6">
                                <div className="flex-1 truncate">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="truncate text-lg font-semibold text-gray-900">Rahul Mathur</h3>
                                        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20">Career Consultant</span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Providing Professional Services in:</p>
                                    <ul className="mt-1 text-sm text-gray-500 list-disc pl-5">
                                        <li>Consultation</li>
                                        <li>Career Guidance</li>
                                        <li>Resume Review</li>
                                        <li>Mock Interviews</li>
                                    </ul>
                                </div>
                                <img className="h-20 w-20 flex-shrink-0 rounded-full bg-gray-300" src="https://www.svgrepo.com/show/382105/male-avatar-boy-face-man-user-5.svg" alt="Rahul Mathur" />
                            </div>
                            <div className="flex divide-x divide-gray-200">
                                <div className="flex w-0 flex-1 hover:rounded-md text-white bg-blue-900">
                                    <a href="https://meetpro.club/rahulmathur" target='_blank' className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                                        </svg>
                                        Book Free Consultation
                                    </a>
                                </div>
                            </div>
                        </li>
                   

                    <ul className="grid grid-cols-1 gap-4 lg:gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4">
                        {[
                            {
                                name: 'Pinky',
                                services: ['BM', 'PSU', 'Banca'],
                                img: 'https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png',
                                link: 'https://meetpro.club/PinkyYadav'
                            },
                            {
                                name: 'Amaan',
                                services: ['Direct-FLS', 'FLM'],
                                img: 'https://www.svgrepo.com/show/382105/male-avatar-boy-face-man-user-5.svg',
                                link: 'https://meetpro.club/Amaan'
                            },
                            // {
                            //     name: 'Sooraj',
                            //     services: ['Bank'],
                            //     img: 'https://www.svgrepo.com/show/382105/male-avatar-boy-face-man-user-5.svg',
                            //     link: 'https://meetpro.club/Surajsamrat'
                            // },
                            {
                                name: 'Swati',
                                services: ['Variable Agency/Partner channel', 'non sales', 'senior positions'],
                                img: 'https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png',
                                link: 'https://meetpro.club/swatichauhan'
                            },
                            // {
                            //     name: 'Sakshi Singh',
                            //     services: ['NBFC'],
                            //     img: 'https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png',
                            //     link: 'https://meetpro.club/SakshiSingh'
                            // }
                        ].map((consultant, index) => (
                            <li key={index} className="md:col-span-1 col-span-2 divide-y divide-gray-200 rounded-lg bg-white shadow-md flex flex-col">
                                <div className="flex w-full items-center justify-between space-x-6 p-6 flex-grow">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="truncate text-lg font-semibold text-gray-900">{consultant.name}</h3>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">Providing Professional Services in:</p>
                                        <ul className="mt-1 text-sm text-gray-500 list-disc pl-5">
                                            {consultant.services.map((service, i) => (
                                                <li key={i}>{service}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src={consultant.img} alt={consultant.name} />
                                </div>
                                <div className="flex divide-x divide-gray-200">
                                    <div className="flex w-0 flex-1 hover:rounded-md text-white bg-blue-900">
                                        <a href={consultant.link} target='_blank' className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold">
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                                            </svg>
                                            Book Free Consultation
                                        </a>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default FreeConsultation
