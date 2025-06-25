import ComplaintList from "../ComplaintList.jsx";
import {useEffect, useState} from "react";

const Complaints = () => {
    const [activeComplaints, setActiveComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    useEffect(() =>{
        const data = JSON.parse(sessionStorage.getItem("complaints"));
        setActiveComplaints(data);
    },[])
    const handleComplaintClick = (complaint) => {
        console.log('Complaint clicked:', complaint);
        setSelectedComplaint(complaint);
    };
    return (
        <div className="m-1 p-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Complaints</h2>
            {console.log('Rendering complaints section')}
            {selectedComplaint ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {console.log('Rendering selected complaint details:', selectedComplaint)}
                    <button
                        onClick={() => {
                            console.log('Back button clicked, clearing selected complaint');
                            setSelectedComplaint(null);
                        }}
                        className="mb-4 text-purple-600 hover:text-purple-700 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Complaints
                    </button>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Status: {selectedComplaint.status}</h3>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Incident Details</h4>
                            <p><span className="font-semibold">Date:</span> {selectedComplaint.incidence.date}</p>
                            <p><span className="font-semibold">Time:</span> {selectedComplaint.incidence.time}</p>
                            <p><span className="font-semibold">Type:</span> {selectedComplaint.incidence.crimetype}</p>
                            <p><span className="font-semibold">Description:</span> {selectedComplaint.incidence.description}</p>
                            <p><span className="font-semibold">Address:</span> {Object.values(selectedComplaint.incidence.address).join(', ')}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Victim Details</h4>
                            <p><span className="font-semibold">Name:</span> {selectedComplaint.victim.firstName} {selectedComplaint.victim.lastName}</p>
                            <p><span className="font-semibold">Phone:</span> {selectedComplaint.victim.phone}</p>
                            <p><span className="font-semibold">Address:</span> {Object.values(selectedComplaint.victim.address).join(', ')}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Accused Details</h4>
                            <p><span className="font-semibold">Name:</span> {selectedComplaint.accused.firstName} {selectedComplaint.accused.lastName}</p>
                            <p><span className="font-semibold">Phone:</span> {selectedComplaint.accused.phone}</p>
                            <p><span className="font-semibold">Address:</span> {Object.values(selectedComplaint.accused.address).join(', ')}</p>
                        </div>
                        {selectedComplaint.evidenceLink && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Evidence</h4>
                                <a
                                    href={selectedComplaint.evidenceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-700"
                                >
                                    {selectedComplaint.evidenceLink}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <ComplaintList complaints={activeComplaints} onSelect={handleComplaintClick} />
            )}
        </div>
    )
}
export default Complaints;