import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";

const Employees = () => {
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllEmployee = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        navigate("/");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/all-employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setActiveEmployees(response.data.activeEmployees);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEmployee();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">All Employees</h1>
            <div className="w-20 h-1 mx-auto sm:mx-0 mt-2 bg-blue-900"></div>
          </div>
          
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-full sm:w-auto"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Sign Out
          </button>
        </header>

        {/* Loading State */}
        {loading ? (
          <div style={override}>
            <PropagateLoader
              color={"#023E8A"}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Active Employees ({activeEmployees.length})</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeEmployees.map((emp) => (
                <Link
                  to={`/employee-kpi/${emp?._id}`}
                  className="relative flex flex-col p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group overflow-hidden"
                  key={emp._id}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-900 rounded-r"></div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                        {emp?.name?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{emp?.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{emp?.empType}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 truncate">
                          <span className="font-medium">Email:</span> {emp?.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">DOJ:</span> {emp?.doj || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Employees;