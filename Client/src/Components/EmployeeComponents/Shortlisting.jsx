import React, { useState } from "react";
import axios from "axios";

const Shortlisting = ({ userData }) => {
  const id = userData?.id;
  console.log(id);
  // for uploading joining Excel
  const [file, setFile] = useState(null); // Selected file
  const [loading, setLoading] = useState(false); // Loader state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const hanndleUpload = async () => {
    if (!file) {
      alert("Please Upload File.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("ShortlistedCandidatesExcel", file);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/employee/upload-shortlistedsheet/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      

      if (response.status === 200) {
        setLoading(false);
        alert("File Uploaded  Successfully");
        window.location.reload();
        setFile("");
      }
    } catch (error) {
      console.log(error);
      alert("Error in uploading File", error);
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-3xl text-center mb-4 ">Upload Shorlisted Candidates</p>
      <input
        className="border border-1 w-full"
        onChange={handleFileChange}
        type="file"
      />{" "}
      <p
        className="bg-black text-gray-100 p-4 cursor-pointer text-center mt-2 "
        onClick={hanndleUpload}
        disable={loading}
      >
        {loading ? "uploading..." : "Upload Shorlisted Candidates"}
      </p>
      <a
        target="_blank"
        href={userData?.shortlistedCandidates}
        rel="noopener noreferrer"
        className="w-full bg-green-400 text-lg cursor-pointer flex text-center justify-center py-2 mt-4  items-center"
      >
        View File
      </a>
    </>
  );
};

export default Shortlisting;
