import React from 'react';

const renderAddress = (address) => {
  if (!address) return 'N/A';
  return [
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country
  ].filter(Boolean).join(', ');
};

const renderCrimeType = (crimetype) => {
  if (Array.isArray(crimetype)) return crimetype.join(', ');
  if (typeof crimetype === 'string') {
    try {
      const arr = JSON.parse(crimetype);
      if (Array.isArray(arr)) return arr.join(', ');
      return crimetype;
    } catch {
      return crimetype;
    }
  }
  return 'Unknown Crime Type';
};

const ComplaintList = ({ complaints, onSelect }) => {
  if (!Array.isArray(complaints) || complaints.length === 0) {
    return <div className="text-center py-8 text-gray-500">No complaints found.</div>;
  }
  return (
    <div className="space-y-6">
      {complaints.map((complaint) => (
        <div
          key={complaint.id}
          onClick={() => onSelect && onSelect(complaint)}
          className="bg-white rounded-xl shadow p-8 cursor-pointer hover:shadow-lg transition-all border border-gray-100"
        >
          {/* Header: Crime Type & Status */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div className="text-xl font-bold text-purple-700">
              Crime Type: <span className="font-normal text-gray-900">{renderCrimeType(complaint.incidence?.crimetype)}</span>
            </div>
            <span className={`px-4 py-1 rounded-full text-sm font-bold ${complaint.status === 'PROCESSING'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-800'
            }`}>
              {complaint.status}
            </span>
          </div>

          {/* Description */}
          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-1">Description:</div>
            <div className="text-gray-800">{complaint.incidence?.description || 'N/A'}</div>
          </div>

          {/* Filed On & Time */}
          <div className="mb-4 flex flex-wrap gap-6 text-sm text-gray-600">
            <div><span className="font-semibold">Filed on:</span> {complaint.incidence?.date || 'N/A'}</div>
            <div><span className="font-semibold">Time:</span> {complaint.incidence?.time || 'N/A'}</div>
          </div>

          {/* Incident Address */}
          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-1">Incident Address:</div>
            <div className="text-gray-800">{renderAddress(complaint.incidence?.address)}</div>
          </div>

          {/* Victim Section */}
          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-1">Victim Details:</div>
            <div className="text-gray-800">
              <span className="font-semibold">Name:</span> {complaint.victim?.firstName} {complaint.victim?.lastName} <br />
              <span className="font-semibold">Phone:</span> {complaint.victim?.phone || 'N/A'} <br />
              <span className="font-semibold">Address:</span> {renderAddress(complaint.victim?.address)}
            </div>
          </div>

          {/* Accused Section */}
          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-1">Accused Details:</div>
            <div className="text-gray-800">
              <span className="font-semibold">Name:</span> {complaint.accused?.firstName} {complaint.accused?.lastName} <br />
              <span className="font-semibold">Phone:</span> {complaint.accused?.phone || 'N/A'} <br />
              <span className="font-semibold">Address:</span> {renderAddress(complaint.accused?.address)}
            </div>
          </div>

          {/* Evidence Section */}
          {complaint.evidenceLink && (
            <div className="mb-4">
              <div className="font-semibold text-gray-700 mb-1">Evidence:</div>
              <a
                href={complaint.evidenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline break-all"
              >
                {complaint.evidenceLink}
              </a>
            </div>
          )}

          {/* Complaint ID (for reference/debug) */}
          <div className="text-xs text-gray-400 mt-4">Complaint ID: {complaint.id}</div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList; 