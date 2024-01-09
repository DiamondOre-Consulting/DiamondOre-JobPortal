import React from 'react'
import Boyimage from '../../assets/Boyimage.jpg'

const HeroNav = () => {
  return (
    <div>
        <section className="overflow-hidden sm:grid sm:grid-cols-2">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24 mr-10">
            <div className="mx-auto max-w-xl text-left ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-5xl font-bold text-gray-900 md:text-5xl">
                Comprehensive Job Aggregator Platform
            </h2>

            <p className="hidden text-gray-500 md:mt-4 md:block">
                Our platform is your ultimate destination for job hunting. We've gathered an extensive array of job listings from various sources.
            </p>

            <div className="mt-4 md:mt-8">
                <a
                href="#"
                className="inline-block rounded bg-blue-900 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-950 focus:outline-none focus:ring focus:ring-yellow-400"
                >
                Get Started Today
                </a>
            </div>
            </div>
        </div>

        <img
            alt="Image by Freepik"
            src={Boyimage}
            className="h-56 w-full object-cover rounded-b-full rounded-t-md sm:h-full"
        />
        </section>
    </div>
  )
}

export default HeroNav
