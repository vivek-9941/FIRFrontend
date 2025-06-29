import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import axios from "axios";
import toast from "react-hot-toast";

const PoliceDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);
    const {user, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [selectedcomplaints, setSelectedcomplaints] = useState(null);

    const logout = () => {
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

            // Check authentication
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/police/complaints?pageNumber=${currentPage}&size=${pageSize}`, {
                headers: {'Authorization': 'Bearer ' + token}
            });

            setComplaints(response.data.complaints);
            setTotalPages(Math.ceil(response.data.total / pageSize));
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
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

    const display = (complaintid) => {
        const selectedComplaint = complaints.find(c => c.id === complaintid);
        setSelectedcomplaints(selectedComplaint);
    }

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:8080/api/police/update?verdict=${newStatus}&id=${complaintId}`,
                {},
                {headers: {Authorization: 'Bearer ' + token}}
            );

            if (response.status === 200) {
                toast.success("Complaint updated successfully.");

                // Update the local state to reflect the change
                setComplaints(prevComplaints =>
                    prevComplaints.map(complaint =>
                        complaint.id === complaintId
                            ? {...complaint, status: newStatus}
                            : complaint
                    )
                );

                // Update selected complaint if it's the one being updated
                if (selectedcomplaints && selectedcomplaints.id === complaintId) {
                    setSelectedcomplaints(prev => ({...prev, status: newStatus}));
                }
            }
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                navigate('/login');
            } else {
                console.error('Error updating complaint status:', err);
                setError('Failed to update complaint status. Please try again.');
                toast.error('Failed to update complaint status.');
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
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
                        <span className="text-purple-100">Welcome, {user?.firstName}</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-md transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {!selectedcomplaints ? (
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
                                    <tr className="bg-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        <th className="px-6 py-3 text-left">ID</th>
                                        <th className="px-6 py-3 text-left">Accused</th>
                                        <th className="px-6 py-3 text-left">Victim</th>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Crime Types</th>
                                        <th className="px-6 py-3 text-left">Description</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                        <th className="px-6 py-3 text-left">Evidence</th>
                                        <th className="px-6 py-3 text-left">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 text-sm">
                                    {complaints.map((complaint) => (
                                        <tr key={complaint.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">{complaint.id}</td>

                                            <td className="px-6 py-4">
                                                {complaint.accused?.firstName} {complaint.accused?.lastName}<br />
                                                <span className="text-xs text-gray-500">{complaint.accused?.phone}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                {complaint.victim?.firstName} {complaint.victim?.lastName}<br />
                                                <span className="text-xs text-gray-500">{complaint.victim?.phone}</span>
                                            </td>

                                            <td className="px-6 py-4 w-fit">{complaint.incidence?.date}</td>

                                            <td className="px-6 py-4">
                                                {Array.isArray(JSON.parse(complaint.incidence?.crimetype))
                                                    ? JSON.parse(complaint.incidence?.crimetype).join(", ")
                                                    : complaint.incidence?.crimetype}
                                            </td>

                                            <td className="px-6 py-4">
                                                {complaint.incidence?.description?.length > 100
                                                    ? complaint.incidence.description.substring(0, 100) + ' ...'
                                                    : complaint.incidence?.description}
                                            </td>

                                            <td className="px-6 py-4">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                complaint.status === 'SUCCEEDED' || complaint.status === 'succeeded'
                    ? 'bg-green-100 text-green-800'
                    : complaint.status === 'REJECTED' || complaint.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
            }`}>
              {complaint.status}
            </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                {complaint.evidenceLink ? (
                                                    <a
                                                        href={complaint.evidenceLink}
                                                        className="text-purple-600 hover:underline"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Evidence
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">N/A</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => display(complaint.id)}
                                                    className="text-white bg-purple-600 hover:bg-purple-700 rounded-lg px-3 py-1 transition"
                                                >
                                                    View
                                                </button>
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
                                        Showing page {currentPage + 1} of {totalPages}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(0)}
                                        disabled={currentPage === 0}
                                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        First
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages - 1}
                                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages - 1)}
                                        disabled={currentPage === totalPages - 1}
                                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Last
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <button
                        onClick={() => setSelectedcomplaints(null)}
                        className="mb-4 text-purple-600 hover:text-purple-700 flex items-center transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Complaints
                    </button>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                Complaint #{selectedcomplaints.id}
                            </h3>
                            <p className="text-lg text-gray-600 mt-2">
                                Status: <span className={`font-semibold ${
                                selectedcomplaints.status === 'SUCCEEDED' || selectedcomplaints.status === 'succeeded'
                                    ? 'text-green-600'
                                    : selectedcomplaints.status === 'REJECTED' || selectedcomplaints.status === 'rejected'
                                        ? 'text-red-600'
                                        : 'text-yellow-600'
                            }`}>
                                    {selectedcomplaints.status}
                                </span>
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Incident Details</h4>
                            <div className="space-y-1">
                                <p><span className="font-semibold">Date:</span> {selectedcomplaints.incidence?.date}</p>
                                <p><span className="font-semibold">Time:</span> {selectedcomplaints.incidence?.time}</p>
                                <p><span className="font-semibold">Type:</span> {selectedcomplaints.incidence?.crimetype}</p>
                                <p><span className="font-semibold">Description:</span> {selectedcomplaints.incidence?.description}</p>
                                <p><span className="font-semibold">Address:</span> {selectedcomplaints.incidence?.address ? Object.values(selectedcomplaints.incidence.address).join(', ') : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Victim Details</h4>
                            <div className="space-y-1">
                                <p><span className="font-semibold">Name:</span> {selectedcomplaints.victim?.firstName} {selectedcomplaints.victim?.lastName}</p>
                                <p><span className="font-semibold">Phone:</span> {selectedcomplaints.victim?.phone}</p>
                                <p><span className="font-semibold">Address:</span> {selectedcomplaints.victim?.address ? Object.values(selectedcomplaints.victim.address).join(', ') : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Accused Details</h4>
                            <div className="space-y-1">
                                <p><span className="font-semibold">Name:</span> {selectedcomplaints.accused?.firstName} {selectedcomplaints.accused?.lastName}</p>
                                <p><span className="font-semibold">Phone:</span> {selectedcomplaints.accused?.phone}</p>
                                <p><span className="font-semibold">Address:</span> {selectedcomplaints.accused?.address ? Object.values(selectedcomplaints.accused.address).join(', ') : 'N/A'}</p>
                            </div>
                        </div>

                        {selectedcomplaints.evidenceLink && (
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Evidence</h4>
                                <a
                                    href={selectedcomplaints.evidenceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-700 underline"
                                >
                                    View Evidence
                                </a>
                            </div>
                        )}

                        <div className="flex space-x-4 pt-4 border-t">
                            <button
                                onClick={() => handleStatusUpdate(selectedcomplaints.id, "SUCCEEDED")}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                                disabled={selectedcomplaints.status === 'SUCCEEDED' || selectedcomplaints.status === 'succeeded'}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedcomplaints.id, "REJECTED")}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                                disabled={selectedcomplaints.status === 'REJECTED' || selectedcomplaints.status === 'rejected'}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoliceDashboard;