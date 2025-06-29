import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PopUpBox from "./PopUpBox";
import { ScaleLoader } from "react-spinners";

const HeroNav = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showModal, setShowModal] = useState(() => {
    const isPopupShown = sessionStorage.getItem("isPopupShown");
    return !isPopupShown;
  });

  useEffect(() => {
    if (showModal) {
      sessionStorage.setItem("isPopupShown", "true");
    }
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {showModal && (
        <PopUpBox closeModal={closeModal} setShowModal={setShowModal} />
      )}
      <section className="relative overflow-hidden flex items-center h-screen bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video
          className="absolute inset-0 w-full  h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controls={false}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source
            src="https://s3.tebi.io/general-pics/hero-section-video.webm"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
        {!videoLoaded && (
          <div className="inset-0 absolute z-[50000] flex flex-col items-center justify-center bg-white w-[100vw]  h-screen">
            <ScaleLoader size={150} color="#023E8A" />
            <p className="text-black text-center mt-2 font-bold text-2xl">
              Loading opportunities...
            </p>
          </div>
        )}

        <div className="p-8 md:p-12  lg:px-16 lg:py-40 relative z-10 flex items-center justify-center sm:justify-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center sm:text-left text-white"
          >
            <div className="mx-auto max-w-xl ">
              <h2 className="text-5xl font-bold md:text-5xl sm:text-3xl ">
                Seize the Job You Deserve,
                <br />
                Right Here!
              </h2>

              <p className="text-md md:mt-4 mt-4">
                Explore Endless Opportunities with{" "}
                <span className="font-bold">Diamond Ore Consulting,</span>{" "}
                <br></br> your{" "}
                <span className="font-bold ">placement consulting company</span>{" "}
                and Gateway to Career Success.
                <br /> Discover, Connect, Excel.
                <br />
                Choose us, Choose Your Future.
              </p>

              <div className="mt-4 md:mt-8">
                <div className="flex items-center">
                  <Link
                    to={"/all-jobs-page"}
                    className="inline-block rounded bg-blue-900 px-4 md:px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-950 focus:outline-none focus:ring focus:ring-yellow-400"
                  >
                    Find Current Job Openings
                  </Link>
                  <Link
                    to={"/get-free-consultation"}
                    className="inline-block ml-4 rounded bg-blue-900 px-4 md:px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-950 focus:outline-none focus:ring focus:ring-yellow-400"
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
