import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "../../assets/home-page-image.jpg";
import logoImg from "../../assets/logowhite.png";
import PopUpBox from "./PopUpBox";
import { ScaleLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { FaLaptopCode, FaUserTie, FaAddressCard, FaFileAlt, FaGraduationCap, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Import Professional Indian Hero Images
import heroDiamond from "../../assets/hero_images/hero_diamond_indian.png";
import heroDoclabz from "../../assets/hero_images/hero_doclabz_indian.png";
import heroGuruzkool from "../../assets/hero_images/hero_guruzkool_indian.png";
import heroProfile from "../../assets/hero_images/hero_profile_indian.png";
import heroCv from "../../assets/hero_images/hero_cv_indian.png";

const slidesData = [
  {
    id: 1,
    type: "diamondore",
    portalName: "Diamond Ore Consulting",
    logoImg: logoImg,
    title: (
      <>
        Seize the Job You Deserve,
        <br />
        Right Here!
      </>
    ),
    desc: (
      <>
        Explore Endless Opportunities with{" "}
        <span className="font-bold text-yellow-400 text-xl tracking-wide">Diamond Ore Consulting,</span>{" "}
        <br /> your{" "}
        <span className="font-bold">placement consulting company</span>{" "}
        and Gateway to Career Success.
        <br /> Discover, Connect, Excel.
        <br /> Choose us, Choose Your Future.
      </>
    ),
    btn1: { text: "Find Current Job Openings", link: "/all-jobs-page", isReactLink: true, primary: true },
    btn2: { text: "Book Free Consultation", link: "/get-free-consultation", isReactLink: true, primary: false },
    bgImg: "none",
    heroImg: heroDiamond
  },
  {
    id: 2,
    type: "doclabz",
    portalName: "DOC-LABZ",
    logoImg: "https://www.doclabz.com/assets/logo2-BiJheRdI.png",
    subtitle: "# Bit By Bit, Building Tomorrow",
    title: "Drive Your Business Forward With Our Customized E-Commerce Website Solutions",
    btn1: { text: "Visit Doc-Labz", link: "https://www.doclabz.com/", primary: true },
    bgImg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    heroImg: heroDoclabz
  },
  {
    id: 3,
    type: "guruzkool",
    portalName: "Guruzkool",
    logoDomain: "guruzkool.com",
    subtitle: "Job-Oriented \u2022 Career Focused",
    title: "Human Resource Management Certification",
    desc: "Master end-to-end HR practices with real-world training and placement assistance designed for corporate roles.",
    btn1: { text: "Join Webinar", link: "https://guruzkool.com", primary: true },
    bgImg: "linear-gradient(135deg, #171717 0%, #20134e 100%)",
    heroImg: heroGuruzkool
  },
  {
    id: 4,
    type: "profilegenie",
    portalName: "Profile Genie",
    logoDomain: "profilegenie.in",
    title: "Ditch the Paper Elevate Your Networking!",
    desc: "Profile Genie - Your all-in-one digital identity, seamlessly shareable with a single click for smarter, paperless networking and connections.",
    btn1: { text: "Get Your Smart Card !", link: "https://profilegenie.in", primary: true },
    bgImg: "radial-gradient(circle at center, #1f2937, #0f172a, #020617)",
    heroImg: heroProfile
  },
  {
    id: 5,
    type: "cvgenie",
    portalName: "CV GENIE",
    logoDomain: "cvgenie.in",
    subtitle: "Where Human Insight Meets Resume Excellence",
    title: "Get Shortlisted Faster with Resumes Tailored by Professionals",
    desc: "At CVGenie, every resume is written by real humans who understand hiring \u2014 not AI bots.",
    btn1: { text: "Make my resume", link: "https://cvgenie.in", primary: true },
    bgImg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
    heroImg: heroCv
  }
];

const HeroNav = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
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

  const getPrimaryBtnClass = () => "inline-block rounded-full bg-blue-600 px-8 py-3.5 text-sm md:text-base font-bold text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all hover:bg-blue-700 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] focus:outline-none focus:ring focus:ring-yellow-400 w-full sm:w-auto text-center";
  const getSecondaryBtnClass = () => "inline-block rounded-full bg-transparent border-2 border-white/80 backdrop-blur-sm px-8 py-3.5 text-sm md:text-base font-bold text-white shadow-lg transition-all hover:bg-white hover:text-blue-900 hover:-translate-y-1 focus:outline-none focus:ring focus:ring-yellow-400 w-full sm:w-auto text-center";

  const renderButton = (btn) => {
    if (!btn) return null;
    const btnClass = btn.primary ? getPrimaryBtnClass() : getSecondaryBtnClass();

    if (btn.isReactLink) {
      return (
        <Link to={btn.link} className={btnClass}>
          {btn.text}
        </Link>
      );
    }

    return (
      <a href={btn.link} target="_blank" rel="noopener noreferrer" className={btnClass}>
        {btn.text}
      </a>
    );
  };

  return (
    <div className="hero-nav-wrapper relative overflow-x-hidden">
      {showModal && (
        <PopUpBox closeModal={closeModal} setShowModal={setShowModal} />
      )}
      <section className="relative overflow-hidden   h-screen bg-gray-950">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {slidesData.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="relative w-full h-full flex items-center bg-cover bg-center overflow-hidden"
                style={{ background: slide.bgImg !== "none" ? slide.bgImg : "none" }}
              >
                {/* Background Video/Overlay uniquely for DiamondOre, or General Dark overlay for others */}
                {slide.type === "diamondore" ? (
                  <>
                    <div className="absolute inset-0 bg-slate-950/75 z-10 transition-opacity duration-1000"></div>
                    <video
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-60"
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      controls={false}
                      onLoadedData={() => setVideoLoaded(true)}
                      onError={() => {
                        setVideoError(true);
                        setVideoLoaded(true);
                      }}
                    >
                      <source
                        src="https://s3.tebi.io/general-pics/hero-section-video.webm"
                        type="video/webm"
                      />
                      Your browser does not support the video tag.
                    </video>
                    {!videoLoaded && !videoError && (
                      <div className="inset-0 absolute z-[50000] flex flex-col items-center justify-center bg-gray-900 w-full h-full">
                        <ScaleLoader size={120} color="#3b82f6" />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-30">
                      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[70%] rounded-full bg-blue-500 blur-[150px] mix-blend-screen"></div>
                      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[70%] rounded-full bg-purple-500 blur-[150px] mix-blend-screen"></div>
                    </div>
                  </>
                )}

                {/* LAYOUT CONTAINER */}
                <div className="relative z-20 w-full h-full flex items-center">
                  <div className="w-full h-full max-w-7xl mx-auto flex items-center px-6 md:px-10 lg:px-20 pt-28 pb-20 md:pt-32 md:pb-24">

                    {/* LEFT COLUMN: Text Content */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      viewport={{ once: false }}
                      className="text-center lg:text-left text-white w-full lg:w-1/2 max-w-3xl mx-auto lg:mx-0 flex flex-col items-center lg:items-start"
                    >
                      {/* Unified Logo Placement */}
                      <div className="flex justify-center lg:justify-start items-center mb-4 flex-shrink-0">
                        <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center p-2.5 border border-white/20 transform transition hover:scale-105 duration-300 flex-shrink-0">
                          {slide.logoImg ? (
                            <img
                              src={slide.logoImg}
                              alt={`${slide.portalName} Logo`}
                              className="w-full h-full object-contain filter drop-shadow-lg"
                            />
                          ) : (
                            <img
                              src={`https://logo.clearbit.com/${slide.logoDomain}`}
                              alt={`${slide.portalName} Logo`}
                              className="w-full h-full object-contain filter drop-shadow-lg rounded-lg"
                              onError={(e) => {
                                e.target.onError = null;
                                e.target.src = `https://www.google.com/s2/favicons?domain=${slide.logoDomain}&sz=128`;
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {slide.subtitle && (
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-[10px] md:text-xs font-medium tracking-widest mb-4 uppercase text-blue-200 shadow-lg">
                          {slide.subtitle}
                        </span>
                      )}

                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-white">
                        {slide.title}
                      </h2>

                      {slide.desc && (
                        <p className="text-xs sm:text-sm md:text-base leading-relaxed mb-6 text-gray-300 drop-shadow-md font-normal max-w-2xl mx-auto lg:mx-0">
                          {slide.desc}
                        </p>
                      )}

                      <div className="mt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                        {renderButton(slide.btn1)}
                        {renderButton(slide.btn2)}
                      </div>
                    </motion.div>
                  </div>

                  {/* RIGHT COLUMN: Professional Hero Image (Edge to Edge) */}
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    viewport={{ once: false }}
                    className="hidden lg:block absolute right-0 top-[10%] w-1/2 h-[90%] z-10"
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      <img
                        src={slide.heroImg}
                        alt={slide.portalName}
                        className="w-full h-full object-contain object-right-bottom"
                        style={{
                          maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
                          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)'
                        }}
                      />
                      {/* Subtle Overlay to match theme better */}
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                  </motion.div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="custom-prev absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all hover:bg-white/20 hover:scale-110 text-white md:flex hidden">
          <FaChevronLeft size={18} />
        </div>
        <div className="custom-next absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all hover:bg-white/20 hover:scale-110 text-white md:flex hidden">
          <FaChevronRight size={18} />
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .swiper-slide {
          opacity: 0 !important;
          visibility: hidden;
          transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out !important;
        }
        .swiper-slide-active {
          opacity: 1 !important;
          visibility: visible;
          z-index: 10 !important;
        }
        .swiper-button-next, .swiper-button-prev {
          display: none !important;
        }
        .custom-next, .custom-prev {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }
        .custom-next.swiper-button-disabled, .custom-prev.swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }
        .swiper-pagination {
          z-index: 50 !important;
          bottom: 25px !important;
        }
        .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: white !important;
          opacity: 0.3 !important;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: #ffffff !important;
          transform: scale(1.2);
          width: 24px !important;
          border-radius: 4px !important;
        }
        @media (max-width: 1024px) {
          .swiper-pagination {
             bottom: 12px !important;
          }
          .swiper-button-next, .swiper-button-prev {
            display: none !important;
          }
          .swiper-pagination-bullet {
            width: 6px !important;
            height: 6px !important;
          }
          .swiper-pagination-bullet-active {
            width: 16px !important;
            height: 6px !important;
          }
        }
      `}} />
    </div>
  );
};

export default HeroNav;

