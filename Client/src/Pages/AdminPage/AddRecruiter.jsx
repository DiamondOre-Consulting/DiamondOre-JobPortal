import axios from 'axios';
import React, { useEffect, useState } from 'react'

const AddRecruiter = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const AddingRecruiter = async (e) => {
    setError(null);
    e.preventDefault();
    setShowLoader(true);

    try {
      const response = await axios.post("https://api.diamondore.in/api/admin-confi/register-recruiter-kam", {
        name,
        email,
      });

      if (response.status === 201) {
        setShowLoader(false);
        setName("");
        setEmail("");
        setError(null);
      }
    } catch (error) {
      console.error("Error Registering:", error);
      if (error.response) {
        const status = error.response.status;
        if (status === 402) {
          setError("Filling all the fields is required!");
        } else if (status === 401) {
          setError("This recruiter or KAM has already been registered!");
        }
      } else {
        setError("An error occurred while registering.");
      }
    } finally {
      setShowLoader(false);
    }
  };
  return (
    <>


      <div className="flex items-center justify-center mt-10">
        <div className="bg-white p-8 rounded-lg shadow-lg relative max-w-md md:w-full  md:mx-0">

          <h2 className="text-2xl mb-4"> Add Recruiter/KAM </h2>
          <form onSubmit={AddingRecruiter}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Name:</label>
              <input type="text" id="name" className="w-full px-3 py-2 border rounded-lg" value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email:</label>
              <input type="email" id="email" className="w-full px-3 py-2 border rounded-lg" value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </div>



            <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-950" disabled={showLoader}>
              {showLoader ? (
                <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
              ) : (<span className="relative z-10">Submit</span>
              )}</button>
          </form>
          {error && (
            <div className="flex items-center justify-center bg-red-300 p-4 rounded-md">
              <p className="text-center text-sm text-red-500">{error}</p>
            </div>
          )}
        </div>
      </div>

    </>
  )
}

export default AddRecruiter