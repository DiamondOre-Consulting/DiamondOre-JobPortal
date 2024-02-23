import React, { useState } from 'react'
import Navbar from './Navbar';
import Footer from './Footer';


const Beourclient = () => {
    const [Name, setName] = useState(null);
    const [Email, setEmail] = useState(null);
    const [phoneno,setPhoneno] =useState(null);
    const [companyname,setCompanyName]=useState(null);
    const [designation,setDesignation] =useState(null);
    const [sucesss, setsucess] = useState(null);
    const [error, seterror] = useState(null)

    const sendmessage = async (e) => {
        e.preventDefault();

        console.log("Sending data:", { Name, Email,phoneno,companyname,designation });
        // const formData = { Name, Email, Message };
        try {
            const response = await axios.post(
                'https://diamond-ore-job-portal-backend.vercel.app/api/candidates/help-contact',
                {
                    Name,
                    Email,
                    phoneno,
                    companyname,
                    designation
                }
            );

            console.log("API Response:", response.data);

            if (response.status === 201) {
                console.log("Data sent successfully");
                setsucess("Data Sent Sucessfully");
                setName('');
                setEmail('');
                setPhoneno('');
                setCompanyName('');
                setDesignation('');
            } else {
                console.log("error occured");
            }

        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className='flex flex-col justify-center items-center bg-gray-100 p-4'>
                
               <div className='bg-blue-950 px-28 rounded-tl-3xl rounded-br-3xl mb-4'><h1 className='text-5xl font-bold  my-4 text-white '>Be Our Client</h1></div> 
                <div class="rounded-md bg-white shadow-gray-500 shadow-xl  lg:col-span-3 lg:p-12">
                    <form class="space-y-3 p-4">
                        <h1 className='text-center  text-3xl text-black mb-6'>Reach out to us</h1>
                        <div>
                            <label class="sr-only" for="name">Name</label>
                            <input
                                class="w-full rounded-lg border-gray-400 bg-gray-50 p-3 text-sm"
                                placeholder="Name"
                                type="text"
                                id="name"
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label class="sr-only" for="email">Email</label>
                                <input
                                    class="w-full rounded-lg border-gray-400 bg-gray-50 p-3 text-sm"
                                    placeholder="Email address"
                                    type="email"
                                    id="email"
                                    value={Email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label class="sr-only" for="Phone">phone</label>
                                <input
                                    class="w-full rounded-lg border-gray-400 bg-gray-50 p-3 text-sm"
                                    placeholder="Phone no."
                                    type="number"
                                    id="phone"
                                    value={phoneno}
                                    onChange={(e) => setPhoneno(e.target.value)}
                                />
                            </div>

                        </div>
                            <div>
                                <label class="sr-only" for="Phone">Company Name</label>
                                <input
                                    class="w-full rounded-lg border-gray-400 bg-gray-50 p-3 text-sm"
                                    placeholder="Your Company Name"
                                    type="text"
                                    id="companyname"
                                    value={companyname}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label class="sr-only" for="Phone">Designation</label>
                                <input
                                    class="w-full rounded-lg border-gray-400 bg-gray-50 p-3 text-sm"
                                    placeholder=" Your Desgnation"
                                    type="text"
                                    id="designation"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                />
                            </div>


                        <div class="mt-4">
                            <button
                                type="submit"
                                class="inline-block w-full  rounded-lg bg-blue-950 px-5 py-3 font-medium text-white sm:w-auto"
                                onClick={sendmessage}
                            >
                                Send Message
                            </button>
                            {sucesss && (
                                <div className="flex items-center justify-center bg-green-500 mt-3 p-4 rounded-md">
                                    <p className="text-center text-sm text-3xl text-gray-200">{sucesss}</p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Beourclient