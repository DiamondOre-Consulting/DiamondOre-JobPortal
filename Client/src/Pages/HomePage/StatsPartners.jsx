import React, { useEffect, useState } from "react";
import abglogo from "../../assets/ABG-logo.png";
import agarwal from "../../assets/agarwal.png";
import india from "../../assets/india-png.png";
import punjab from "../../assets/Punjab_National_Bank.png";
import sbi from "../../assets/sbinew-png.png";
import kotak from "../../assets/kotakli.png";
import canara from "../../assets/canara.png";
import edelweiss from "../../assets/edelweiss.png";
import { motion } from "framer-motion";
import Marquee from "react-marquee-slider";
import maxlogo from "../../assets/maxlogo.png";

const StatsPartners = () => {
  const [companies, setCompanies] = useState(0);
  const [vacancies, setVacancies] = useState(0);
  const [placed, setPlaced] = useState(0);

  useEffect(() => {
    const companiesInterval = setInterval(() => {
      if (companies >= 30) {
        clearInterval(companiesInterval);
      } else {
        setCompanies((prevCompanies) => prevCompanies + 1);
      }
    }, 10);

    const vacanciesInterval = setInterval(() => {
      if (vacancies >= 3000) {
        clearInterval(vacanciesInterval);
      } else {
        setVacancies((prevVacancies) => prevVacancies + 20);
      }
    }, 10);

    const placedInterval = setInterval(() => {
      if (placed >= 10000) {
        clearInterval(placedInterval);
      } else {
        setPlaced((prevPlaced) => prevPlaced + 20);
      }
    }, 5);

    // Clear intervals on component unmount
    return () => {
      clearInterval(companiesInterval);
      clearInterval(vacanciesInterval);
      clearInterval(placedInterval);
    };
  }, [vacancies, companies, placed]);

  return (
    <div className="mt-20 ">
      <div className=" py-6 sm:py-8 lg:py-18 bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl ">
              Our Work By Numbers
            </h2>

            <p
              className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg"
              style={{}}
            >
              We eagerly partner with vacancies, awaiting talented individuals.
              As each position is filled, our numerical narrative transforms,
              reflecting the continual influx of talent that propels our
              collective success.
            </p>
          </div>
          <motion.div
            className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0 md:divide-x"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div className="flex flex-col items-center md:p-4 hover:shadow-lg">
              <motion.div
                className="text-xl font-bold text-blue-900 sm:text-2xl md:text-3xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {companies}+
              </motion.div>
              <div className="text-sm font-semibold sm:text-base">Clients</div>
            </motion.div>

            <motion.div className="flex flex-col items-center md:p-4 hover:shadow-lg">
              <motion.div
                className="text-xl font-bold text-blue-900 sm:text-2xl md:text-3xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {vacancies}+
              </motion.div>
              <div className="text-sm font-semibold sm:text-base">
                Vacancies
              </div>
            </motion.div>

            <motion.div className="flex flex-col items-center md:p-4 hover:shadow-lg">
              <motion.div
                className="text-xl font-bold text-blue-900 sm:text-2xl md:text-3xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                6000+
              </motion.div>
              <div className="text-sm font-semibold sm:text-base">
                Got Placed
              </div>
            </motion.div>

            <motion.div className="flex flex-col items-center md:p-4 hover:shadow-lg">
              <motion.div
                className="text-xl font-bold text-blue-900 sm:text-2xl md:text-3xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                A couple of
              </motion.div>
              <div className="text-sm font-semibold sm:text-base">
                Coffee breaks
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Get hired in top Companies component starts */}

      <div className="bg-white py-6 sm:py-8 lg:py-8 mt-20">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-1 lg:text-3xl ">
            Trusted by the best
          </h2>
          <div className="bg-blue-900 w-56 h-1 align-center mx-auto"></div>

          <div className="overflow-hidden mt-16 text-center">
            <Marquee velocity={40}>
              <img
                src={abglogo}
                alt=""
                className="w-14 sm:w-14 md:w-20 lg:w-44 object-cover mb-4 mr-16 inline-block"
              />
              <img
                src={sbi}
                alt=""
                className="w-14 sm:w-14 md:w-20 lg:w-20 object-cover mb-4 mr-16 inline-block"
              />
              <img
                src={agarwal}
                alt=""
                className="w-14 sm:w-14 md:w-20 lg:w-20 object-cover mb-4 mr-16 inline-block"
              />
              <img
                src={india}
                alt=""
                className="w-14 sm:w-14 md:w-20 lg:w-32 object-cover mb-4  mr-16 inline-block"
              />
              <img
                src={punjab}
                alt=""
                className="w-14 sm:w-14 md:w-20 lg:w-44 object-cover mb-4 mr-16 inline-block"
              />
              <img
                src={canara}
                alt=""
                className="w-20 sm:w-32 md:w-20 lg:w-44 object-cover mb-4 mr-16 inline-block"
              />
              <img
                src={kotak}
                alt=""
                className="w-20 sm:w-32 md:w-10 lg:w-44 object-cover mb-4 mr-16 inline-block"
              />
              <img
                src="https://www.careinsurance.com/images/care_health_insurance_logo.svg"
                alt="helthcare"
                className="w-18 sm:w-14 md:w-20 lg:w-44 object-cover mb-4 mr-16 inline-block"
              />
              <img
                src="https://companieslogo.com/img/orig/MOTILALOFS.NS_BIG-55e383aa.png?t=1720436307"
                alt="motilal oswal"
                className="w-14 sm:w-10 md:w-10 lg:w-44 object-cover mb-4 mr-16 inline-block"
              />
              <img
                src={edelweiss}
                alt="motilal oswal"
                className="w-14 sm:w-10 md:w-10 lg:w-44 object-cover mb-4 mr-16 inline-block"
              />
              <img
                src={maxlogo}
                alt="motilal oswal"
                className="w-14 sm:w-10 md:w-10 lg:w-44 object-cover mb-4 mr-16 inline-block"
              />
            </Marquee>
          </div>

          {/* <marquee behavior="scroll" direction="right" scrollamount="12" scrolldelay="0">
            <div className="flex flex-wrap justify-between sm:gap-4 gap-0 sm:justify-start md:justify-between lg:justify-around xl:justify-between items-center p-4 mt-2">

              <div className="flex justify-center text-indigo-500 object-cover mb-4">
                <img src={canara} alt="" className="w-14 sm:w-10 md:w-10 lg:w-44 object-cover" />
              </div>


              <div className="flex justify-center text-indigo-500 object-cover mb-4">
                <img src={kotak} alt="" className="w-14 sm:w-10 md:w-10 lg:w-44 object-cover" />
              </div>

              <div className="flex justify-center text-indigo-500 object-cover mb-4">
                <img src="https://www.careinsurance.com/images/care_health_insurance_logo.svg" alt="helthcare" className="w-18 sm:w-14 md:w-20 lg:w-44 object-cover" />
              </div>

              <div className="flex justify-center text-indigo-500 object-cover mb-4">
                <img src="https://www.motilaloswal.com/img/mologo.png?1210" alt="motilal oswal" className="w-14 sm:w-10 md:w-10 lg:w-44 object-cover" />
              </div>

              <div className="flex justify-center text-indigo-500 object-cover mb-4">
                <img src={edelweiss} alt="motilal oswal" className="w-14 sm:w-10 md:w-10 lg:w-44 object-cover" />
              </div>
            </div>
          </marquee> */}
        </div>
      </div>

      {/* Get hired in top Companies component ends */}
    </div>
  );
};

export default StatsPartners;
