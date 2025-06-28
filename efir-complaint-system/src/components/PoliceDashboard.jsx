import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from "axios";

const PoliceDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const { user } = useAuth();
  const navigate = useNavigate();
  const checkAuthStatus  = useAuth();
  const logout = () =>{
    localStorage.clear();
    navigate("/");
  }
  useEffect(() => {
    fetchComplaints();
  }, [currentPage]);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if(!checkAuthStatus){
        navigate('/login');
      }
      const response = await axios.get(`http://localhost:8080/api/police/complaints?pageNumber=${currentPage}&size=${pageSize}` , {headers:{'Authorization' : 'Bearer '+token}});
      setComplaints(response.data.complaints);
      setTotalPages(Math.ceil(response.data.total / pageSize));
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        // Handle unauthorized access
        logout();
        navigate('/login');
      } else {
        setError('Failed to fetch complaints. Please try again later.');
        console.error('Error fetching complaints:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await axios.put(`/user/api/complaints/${complaintId}`, { status: newStatus });
      // Update the local state to reflect the change
      setComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
          complaint._id === complaintId
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        console.error('Error updating complaint status:', err);
        setError('Failed to update complaint status. Please try again.');
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Dashboard Header */}
      <div className="bg-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Police Dashboard</h2>
            <p className="text-purple-100">Manage and track complaint status</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-purple-100">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complaint ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {complaint._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {complaint.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {complaint.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          complaint.status === 'succeeded'
                            ? 'bg-green-100 text-green-800'
                            : complaint.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(complaint._id, 'succeeded')}
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                          >
                            Mark Succeeded
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                          >
                            Mark Rejected
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PoliceDashboard; 