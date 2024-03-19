import React from "react";
import Boyimage from "../../assets/Boyimage.jpg";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroNav = () => {
  
  return (
    <div>
      <section className="overflow-hidden flex flex-between sm:grid sm:grid-cols-2">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24 mr-0 xxs:mr-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto max-w-xl text-left ltr:sm:text-left rtl:sm:text-right">
              <h2 className="text-5xl font-bold text-gray-700 md:text-5xl sm:text-3xl ">
                <span className="text-gray-900">Seize the Job You Deserve,<br></br>Right Here!</span>
              </h2>

              <p className="text-sm text-gray-500 md:mt-4 mt-4">
                Explore Endless Opportunities with <span className="text-blue-900 font-bold">Diamond Ore Consulting</span> Your Gateway to Career. Success, Discover, Connect, Excel,<br></br>Choose us, Choose Your Future
              </p>

              <div className="mt-4 md:mt-8">
                <Link
                  to={'/login'}
                  className="inline-block rounded bg-blue-900 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-950 focus:outline-none focus:ring focus:ring-yellow-400"
                >
                  Get Started Today
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="hidden sm:flex justify-center px-10 ">
          <LazyLoadImage

            alt="Image by Freepik"
            effect="blur"
            src={Boyimage}
            className="h-56 w-full object-cover rounded-b-full rounded-t-md sm:h-full"
          />

        </div>
      </section>
    </div>

  );
};

export default HeroNav;
