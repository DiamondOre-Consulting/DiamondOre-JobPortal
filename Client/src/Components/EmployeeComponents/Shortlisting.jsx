import React, { useState } from "react";
import axios from "axios";

const Shortlisting = ({ userData }) => {
  const id = userData?.id;
console.log(id)
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
      formData.append("myFileImage", file);

      const uploadResponse = await axios.post(
        "https://api.diamondore.in/api/admin-confi/upload-shortlisted-url",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const excelUrl = uploadResponse.data;
      console.log(excelUrl);

      const response = await axios.post(
        `https://api.diamondore.in/api/admin-confi/upload-shortlistedsheet/${id}`,
        { shortlistedCandidates: excelUrl }
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


      <p className="bg-green-400 mt-4 p-4  text-center text-xl text-white cursor-pointer "><a href={userData?.shortlistedCandidates} target="_blank">View File</a></p>
    </>
  );
};

export default Shortlisting;
