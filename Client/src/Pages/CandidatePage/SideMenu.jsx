import React, { useState } from 'react';
import JobsData from './JobsData'; // Import the component you want to render
import AllJobs from './AllJobs';

const SideMenu = () => {
  const [selectedComponent, setSelectedComponent] = useState('home');

  const handleButtonClick = (component) => {
    setSelectedComponent(component);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'home':
        return <JobsData />; // Render the Home component
      // Add cases for other components you want to render

      case 'all':
        return <AllJobs/>

      default:
        return null;
    }
  };

  return (
    <div className="flex">

    <div className='hidden lg:flex fixed inset-y-auto left-1' >
        <div className="flex w-28 flex-col justify-between border-e border-s border-t bg-white" >
            <div>
                <div className="inline-flex h-20 w-20 items-center justify-center">
                    <span className="grid h-14 w-14 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
                        U
                    </span>
                </div>

                <div className="border-t border-gray-100">
                    <div className="px-4">
                        <div className="py-4">
                            <button 
                                onClick={() => handleButtonClick('home')}
                                className="t group relative flex justify-center rounded px-4 py-2 text-gray-500 hover:bg-gray-200 hover:text-blue-950">
                                Home
                            </button>
                        </div>

                        <ul className="space-y-3 border-t border-gray-100 pt-4">

                            <li>
                                <button
                                onClick={() => handleButtonClick('all')}
                                className="group relative flex justify-center rounded px-4 py-2 text-gray-500 hover:bg-gray-200 hover:text-blue-950" >
                                    All Jobs
                                </button>
                            </li>

                            <li>
                                <a href="" className="group relative flex justify-center rounded px-4 py-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700" >
                                    Applied
                                </a>
                            </li>

                            <li>
                                <a href="" className="group relative flex justify-center rounded px-4 py-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 border-b" >
                                    Shortlisted
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    {renderComponent()}

    </div>




  )
}

export default SideMenu
