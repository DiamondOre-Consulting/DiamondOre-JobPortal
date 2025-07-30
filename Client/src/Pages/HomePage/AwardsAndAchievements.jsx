import React, { useState } from "react";
import Marquee from "react-marquee-slider";
import certificate from "../../assets/startup.png";
import certificat2 from "../../assets/certificate2.jpg";



const awards = [
  "https://res.cloudinary.com/dmpkp9ux2/image/upload/v1750828089/img2_u0dmjt.jpg",
  "https://res.cloudinary.com/dmpkp9ux2/image/upload/v1750828089/img1_cesor6.jpg",
  certificate,
  certificat2,
  "https://res.cloudinary.com/dmpkp9ux2/image/upload/v1750831138/ChatGPT_Image_Jun_25_2025_11_27_02_AM_erkiul.png",
  "https://res.cloudinary.com/dmpkp9ux2/image/upload/v1750831587/ChatGPT_Image_Jun_25_2025_11_36_07_AM_ymmxy8.png",
];

const AwardsAndAchievements = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (src) => {
    setSelectedImage(src);
    setIsModalOpen(true);
  };

  return (
    <div className="py-8">
      <h1 className=" text-2xl md:text-4xl text-center font-semibold mb-10">
        Awards & Achievements
      </h1>

      <Marquee velocity={25} minScale={0.7} resetAfterTries={200}>
        {awards.map((src, index) => (
          <div key={index} className="mx-4 cursor-pointer">
            <img
              src={src}
              alt={`Award ${index + 1}`}
              className="w-[30rem] h-80 object-top rounded-lg shadow-md"
              onClick={() => openModal(src)}
            />
          </div>
        ))}
      </Marquee>

      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-3xl mx-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Selected Award"
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardsAndAchievements;
