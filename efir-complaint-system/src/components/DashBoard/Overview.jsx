import {useEffect, useState} from "react";
import {decryptAES} from "../../utils/AESEncryption.js";

const Overview = () => {
    const [activeComplaints, setActiveComplaints] = useState([]);
    useEffect(() => {
        const encrypted = sessionStorage.getItem("complaints");
        if (encrypted) {
            const data = JSON.parse(decryptAES(encrypted));
            setActiveComplaints(data);
        }
    }, [])
    return (
        <div className="space-y-6 m-1 p-2">
            <h2 className="text-2xl font-bold text-gray-900 flex justify-center">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-2 border-gray-100 p-3 rounded-lg ">
                <div className="bg-purple-50 p-6 rounded-lg shadow-lg">
                    <div className="text-purple-600 text-lg font-semibold">Total Complaints</div>
                    <div className="text-3xl font-bold text-purple-700">{activeComplaints.length}</div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg shadow-lg">
                    <div className="text-yellow-600 text-lg font-semibold">Active Complaints</div>
                    <div className="text-3xl font-bold text-yellow-700">{
                        activeComplaints.filter(c => c.status === 'PROCESSING').length
                    }</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-lg">
                    <div className="text-green-600 text-lg font-semibold">Resolved Complaints</div>
                    <div className="text-3xl font-bold text-green-700">{
                        activeComplaints.filter(c => c.status === 'SUCCEEDED').length
                    }</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-lg">
                    <div className="text-green-600 text-lg font-semibold">Rejected Complaints</div>
                    <div className="text-3xl font-bold text-green-700">{
                        activeComplaints.filter(c => c.status === 'REJECTED').length
                    }</div>
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h3>
                <div className="space-y-4 border-2 border-gray-100 p-3 rounded-lg ">
                    {activeComplaints.slice(0, 3).map(complaint => (
                        <div key={complaint.id} className="bg-gray-50 rounded-lg p-4 shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium text-gray-900">{Array.isArray(complaint.incidence?.crimetype)
                                        ? complaint.incidence.crimetype.join(', ')
                                        : (typeof complaint.incidence?.crimetype === 'string'
                                            ? (() => {
                                                try {
                                                    return JSON.parse(complaint.incidence.crimetype).join(', ');
                                                } catch {
                                                    return complaint.incidence.crimetype;
                                                }
                                            })()
                                            : 'Unknown Crime Type')}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">{complaint.incidence?.description || 'No Description'}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    complaint.status === 'Active' || complaint.status === 'PROCESSING'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                }`}>
                            {complaint.status || 'Unknown Status'}
                          </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Filed on: {complaint.incidence?.date || 'No Date'}
                            </div>
                        </div>
                    ))}
                    {activeComplaints.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>No complaints found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Overview;