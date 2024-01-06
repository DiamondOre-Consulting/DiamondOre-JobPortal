import React from 'react'

const SideMenu = () => {
  return (
    // Inside your React component render function
<div className='hidden lg:flex fixed inset-y-auto left-1' >
    <div className="flex w-24 flex-col justify-between border-e border-s border-t bg-white" >
        <div>
            <div className="inline-flex h-20 w-20 items-center justify-center">
                <span className="grid h-14 w-14 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
                    U
                </span>
            </div>

            <div className="border-t border-gray-100">
                <div className="px-4">
                    <div className="py-4">
                        <a href="" className="t group relative flex justify-center rounded bg-blue-50 px-2 py-1.5 text-blue-700">
                            General
                        </a>
                    </div>

                    <ul className="space-y-3 border-t border-gray-100 pt-4">
                        <li>
                            <a href="" className="group relative flex justify-center rounded px-4 py-4 text-gray-500 hover:bg-gray-50 hover:text-gray-700" >
                                Applied
                            </a>
                        </li>

                        <li>
                            <a href="" className="group relative flex justify-center rounded px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-b" >
                                Shortlisted
                            </a>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>




  )
}

export default SideMenu
