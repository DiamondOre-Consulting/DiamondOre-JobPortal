import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import PropagateLoader from "react-spinners/PropagateLoader";

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAllAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/fetch-all-admins`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAdmins(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  const handleDeleteClick = (adminId) => {
    setAdminToDelete(adminId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin-confi/delete/admin/${adminToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAllAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setAdminToDelete(null);
    }
  };

  const override = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div className="px-4">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
            <div className="w-20 h-1 my-2 bg-blue-900"></div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this admin? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold">All Admins</h1>
        <div className="w-20 h-1 mx-auto mt-2 bg-blue-900"></div>
      </div>

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
        <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-4">
          {admins.map((admin) => (
            <div
              className="relative flex justify-between p-5 overflow-hidden transition-all duration-500 transform bg-white shadow-xl cursor-pointer hover:shadow-2xl group rounded-xl"
              key={admin._id}
            >
              <div
                onClick={() => handleDeleteClick(admin._id)}
                className="absolute top-0 left-0 z-10 p-1 text-[1.5rem] text-red-800 bg-red-200 shadow-md rounded-tl-xl hover:bg-red-300"
              >
                <MdDelete />
              </div>

              <div className="flex">
                <div className="w-1 h-full bg-blue-900 rounded-full"></div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="transition-all duration-500 transform w-fit">
                    <h1 className="font-bold text-gray-900">{admin.name}</h1>
                    <p className="text-gray-400 capitalize">{admin.adminType}</p>
                    <p className="text-xs text-gray-500 transition-all duration-500 delay-300 transform">
                      Email: {admin.email}
                    </p>
                    <p className="text-xs text-gray-500 transition-all duration-500 delay-300 transform">
                      Created At: {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="w-20 h-20 bg-blue-900 rounded-full -mr-14"></div>
                <div className="z-10 w-5 h-5 -mr-10 bg-blue-900 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAdmins;