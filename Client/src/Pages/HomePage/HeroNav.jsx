import React from "react";
import Boyimage from "../../assets/Boyimage.jpg";

const HeroNav = () => {
  return (
    <div>
      <section className="overflow-hidden flex flex-between sm:grid sm:grid-cols-2">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24 mr-0 xxs:mr-0">
          <div className="mx-auto max-w-xl text-left ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-5xl font-bold text-gray-700 md:text-5xl sm:text-2xl font-serif">
            Welcome to <span className="text-blue-950">Diamond Ore Consulting Pvt Ltd</span>
            </h2>

            <p className="text-2xl text-gray-500 md:mt-4">
            Your dynamic workforce solution partner! 
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

        <div className="hidden sm:flex justify-center px-10 ">
        <img
          alt="Image by Freepik"
          src={Boyimage}
          className="h-56 w-full object-cover rounded-b-full rounded-t-md sm:h-full"
        />
        </div>
      </section>
    </div>
  );
};

export default HeroNav;
