
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroNav = () => {
  
  return (
    <div>
      <section className="overflow-hidden flex items-center h-screen bg-cover bg-center" style={{backgroundImage: 'url(https://s3.tebi.io/generalpics/DOC-HomeGIF.gif)'}}>
        <div className="p-8 md:p-12 lg:px-16 lg:py-40 relative z-10 flex items-center justify-center sm:justify-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center sm:text-left text-white"
          >
            <div className="mx-auto max-w-xl">
              <h2 className="text-5xl font-bold md:text-5xl sm:text-3xl ">
                Seize the Job You Deserve,<br />Right Here!
              </h2>

              <p className="text-sm md:mt-4 mt-4">
                Explore Endless Opportunities with <span className="font-bold">Diamond Ore Consulting.</span> Your Gateway to Career Success. Discover, Connect, Excel.<br />Choose us, Choose Your Future.
              </p>

              <div className="mt-4 md:mt-8">
                <div className="flex items-center">
                <Link
                  to={'/login'}
                  className="inline-block rounded bg-blue-900 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-950 focus:outline-none focus:ring focus:ring-yellow-400"
                >
                  Get Started Today
                </Link>
                <Link
                  to={'/get-free-consultation'}
                  className="inline-block ml-4 rounded bg-blue-900 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-950 focus:outline-none focus:ring focus:ring-yellow-400"
                >
                  Book Free Consultation
                </Link>

                </div>
                
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HeroNav;
