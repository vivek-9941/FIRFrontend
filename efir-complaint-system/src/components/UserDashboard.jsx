import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import logo from '../assets/image.png';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showVictimForm, setShowVictimForm] = useState(false);
  const [showAccusedForm, setShowAccusedForm] = useState(false);
  const [evidenceLink, setEvidenceLink] = useState('');
  const [hasEvidenceLink, setHasEvidenceLink] = useState(false);
  const [activeComplaints, setActiveComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [incidentDetails, setIncidentDetails] = useState({
    date: '',
    time: '',
    description: '',
    address: {
      street: '',
      city: '',
      zip: '',
      state: '',
      country: ''
    }
  });
  
  // State for victim form
  const [victimFormData, setVictimFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    contactNumber: '',
    address: '',
    aadharNumber: ''
  });

  // State for accused form
  const [accusedFormData, setAccusedFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    contactNumber: '',
    address: '',
    aadharNumber: ''
  });

  // State to store all victims and accused
  const [victims, setVictims] = useState([]);
  const [accused, setAccused] = useState([]);

  // Mock user data for development
  const [user] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    totalComplaints: 5,
    activeComplaints: 2,
    resolvedComplaints: 3,
    recentComplaints: [
      {
        id: 1,
        subject: 'Water Supply Issue',
        status: 'Active',
        date: '2024-03-20',
        description: 'No water supply in Block A for the past 2 days'
      },
      {
        id: 2,
        subject: 'Street Light Malfunction',
        status: 'Resolved',
        date: '2024-03-15',
        description: 'Street lights not working in sector 7'
      },
      {
        id: 3,
        subject: 'Garbage Collection',
        status: 'Active',
        date: '2024-03-18',
        description: 'Irregular garbage collection in the area'
      }
    ]
  });

  // Fetch active complaints
  useEffect(() => {
    const fetchActiveComplaints = async () => {
      try {
        setIsLoading(true);
        // Replace this with your actual API call
        const response = await fetch('/api/complaints/active');
        const data = await response.json();
        setActiveComplaints(data);
      } catch (error) {
        console.error('Error fetching active complaints:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'complaints') {
      fetchActiveComplaints();
    }
  }, [activeTab]);

  // Handle victim form input changes
  const handleVictimInputChange = (e) => {
    const { name, value } = e.target;
    setVictimFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle accused form input changes
  const handleAccusedInputChange = (e) => {
    const { name, value } = e.target;
    setAccusedFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding victim
  const handleAddVictim = () => {
    if (victimFormData.name && victimFormData.age) {
      setVictims(prev => [...prev, { ...victimFormData, id: Date.now() }]);
      setVictimFormData({
        name: '',
        age: '',
        occupation: '',
        contactNumber: '',
        address: '',
        aadharNumber: ''
      });
      setShowVictimForm(false);
    }
  };

  // Handle adding accused
  const handleAddAccused = () => {
    if (accusedFormData.name && accusedFormData.age) {
      setAccused(prev => [...prev, { ...accusedFormData, id: Date.now() }]);
      setAccusedFormData({
        name: '',
        age: '',
        occupation: '',
        contactNumber: '',
        address: '',
        aadharNumber: ''
      });
      setShowAccusedForm(false);
    }
  };

  // Handle adding evidence link
  const handleAddEvidenceLink = () => {
    if (evidenceLink.trim()) {
      setHasEvidenceLink(true);
    }
  };

  // Handle removing evidence link
  const handleRemoveEvidenceLink = () => {
    setEvidenceLink('');
    setHasEvidenceLink(false);
  };

  // Handle incident details change
  const handleIncidentDetailsChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setIncidentDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setIncidentDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      victims,
      accused,
      incidentDetails,
      evidenceLink: hasEvidenceLink ? evidenceLink : null
    };

    console.log('Form Data:', formData);
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Handle complaint click
  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 w-full">
        <div className="flex w-full">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-none shadow-sm p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'complaints'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>My Complaints</span>
              </button>
              <button
                onClick={() => setActiveTab('new-complaint')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'new-complaint'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Complaint</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-none shadow-sm p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-purple-600 text-lg font-semibold">Total Complaints</div>
                    <div className="text-3xl font-bold text-purple-700">{user.totalComplaints}</div>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="text-yellow-600 text-lg font-semibold">Active Complaints</div>
                    <div className="text-3xl font-bold text-yellow-700">{user.activeComplaints}</div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="text-green-600 text-lg font-semibold">Resolved Complaints</div>
                    <div className="text-3xl font-bold text-green-700">{user.resolvedComplaints}</div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h3>
                  <div className="space-y-4">
                    {user.recentComplaints.map(complaint => (
                      <div key={complaint.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{complaint.subject}</h4>
                            <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            complaint.status === 'Active' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Filed on: {complaint.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'complaints' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Complaints</h2>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : selectedComplaint ? (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <button
                      onClick={() => setSelectedComplaint(null)}
                      className="mb-4 text-purple-600 hover:text-purple-700 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Complaints
                    </button>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{selectedComplaint.subject}</h3>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedComplaint.status === 'Active' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedComplaint.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Filed on: {selectedComplaint.date}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700">{selectedComplaint.description}</p>
                      </div>

                      {selectedComplaint.victims && selectedComplaint.victims.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Victims</h4>
                          <div className="space-y-2">
                            {selectedComplaint.victims.map((victim, index) => (
                              <div key={index} className="bg-purple-50 p-3 rounded-lg">
                                <p className="font-medium text-purple-900">{victim.name}</p>
                                <p className="text-sm text-purple-700">Age: {victim.age} | Occupation: {victim.occupation}</p>
                                <p className="text-sm text-purple-700">Contact: {victim.contactNumber}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedComplaint.accused && selectedComplaint.accused.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Accused</h4>
                          <div className="space-y-2">
                            {selectedComplaint.accused.map((person, index) => (
                              <div key={index} className="bg-purple-50 p-3 rounded-lg">
                                <p className="font-medium text-purple-900">{person.name}</p>
                                <p className="text-sm text-purple-700">Age: {person.age} | Occupation: {person.occupation}</p>
                                <p className="text-sm text-purple-700">Contact: {person.contactNumber}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedComplaint.evidenceLink && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Evidence</h4>
                          <a
                            href={selectedComplaint.evidenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            View Evidence
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeComplaints.map(complaint => (
                      <div
                        key={complaint.id}
                        onClick={() => handleComplaintClick(complaint)}
                        className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{complaint.subject}</h4>
                            <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            complaint.status === 'Active' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Filed on: {complaint.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'new-complaint' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">File New Complaint</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Victim Details Section */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Victim Details</h3>
                        <button
                          onClick={() => setShowVictimForm(prev => !prev)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Display added victims */}
                      {victims.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {victims.map((victim) => (
                            <div key={victim.id} className="bg-purple-50 p-3 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-purple-900">{victim.name}</p>
                                  <p className="text-sm text-purple-700">Age: {victim.age} | Occupation: {victim.occupation}</p>
                                  <p className="text-sm text-purple-700">Contact: {victim.contactNumber}</p>
                                </div>
                                <button
                                  onClick={() => setVictims(prev => prev.filter(v => v.id !== victim.id))}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showVictimForm && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              name="name"
                              value={victimFormData.name}
                              onChange={handleVictimInputChange}
                              placeholder="Name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Age</label>
                              <input
                                type="text"
                                name="age"
                                value={victimFormData.age}
                                onChange={handleVictimInputChange}
                                placeholder="Age"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Occupation</label>
                              <input
                                type="text"
                                name="occupation"
                                value={victimFormData.occupation}
                                onChange={handleVictimInputChange}
                                placeholder="Occupation"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                              <input
                                type="tel"
                                name="contactNumber"
                                value={victimFormData.contactNumber}
                                onChange={handleVictimInputChange}
                                placeholder="Contact Number"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                              name="address"
                              value={victimFormData.address}
                              onChange={handleVictimInputChange}
                              placeholder="Address..."
                              rows={3}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                            <input
                              type="text"
                              name="aadharNumber"
                              value={victimFormData.aadharNumber}
                              onChange={handleVictimInputChange}
                              placeholder="xxxx xxxx xxxx"
                              maxLength="12"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleAddVictim}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accused Details Section */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Accused Details</h3>
                        <button
                          onClick={() => setShowAccusedForm(prev => !prev)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Display added accused */}
                      {accused.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {accused.map((person) => (
                            <div key={person.id} className="bg-purple-50 p-3 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-purple-900">{person.name}</p>
                                  <p className="text-sm text-purple-700">Age: {person.age} | Occupation: {person.occupation}</p>
                                  <p className="text-sm text-purple-700">Contact: {person.contactNumber}</p>
                                </div>
                                <button
                                  onClick={() => setAccused(prev => prev.filter(a => a.id !== person.id))}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showAccusedForm && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              name="name"
                              value={accusedFormData.name}
                              onChange={handleAccusedInputChange}
                              placeholder="Name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Age</label>
                              <input
                                type="text"
                                name="age"
                                value={accusedFormData.age}
                                onChange={handleAccusedInputChange}
                                placeholder="Age"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Occupation</label>
                              <input
                                type="text"
                                name="occupation"
                                value={accusedFormData.occupation}
                                onChange={handleAccusedInputChange}
                                placeholder="Occupation"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                              <input
                                type="tel"
                                name="contactNumber"
                                value={accusedFormData.contactNumber}
                                onChange={handleAccusedInputChange}
                                placeholder="Contact Number"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                              name="address"
                              value={accusedFormData.address}
                              onChange={handleAccusedInputChange}
                              placeholder="Address..."
                              rows={3}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                            <input
                              type="text"
                              name="aadharNumber"
                              value={accusedFormData.aadharNumber}
                              onChange={handleAccusedInputChange}
                              placeholder="xxxx xxxx xxxx"
                              maxLength="12"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleAddAccused}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Incident Description Section */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Description</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Incident</label>
                            <input
                              type="date"
                              name="date"
                              value={incidentDetails.date}
                              onChange={handleIncidentDetailsChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Time of Incident</label>
                            <input
                              type="time"
                              name="time"
                              value={incidentDetails.time}
                              onChange={handleIncidentDetailsChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name="description"
                            value={incidentDetails.description}
                            onChange={handleIncidentDetailsChange}
                            rows={6}
                            placeholder="Provide a detailed description of the incident..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Incident Address</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-600">Street Address</label>
                              <input
                                type="text"
                                name="address.street"
                                value={incidentDetails.address.street}
                                onChange={handleIncidentDetailsChange}
                                placeholder="Street address"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600">City</label>
                              <input
                                type="text"
                                name="address.city"
                                value={incidentDetails.address.city}
                                onChange={handleIncidentDetailsChange}
                                placeholder="City"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600">ZIP Code</label>
                              <input
                                type="text"
                                name="address.zip"
                                value={incidentDetails.address.zip}
                                onChange={handleIncidentDetailsChange}
                                placeholder="ZIP code"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600">State</label>
                              <input
                                type="text"
                                name="address.state"
                                value={incidentDetails.address.state}
                                onChange={handleIncidentDetailsChange}
                                placeholder="State"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600">Country</label>
                              <input
                                type="text"
                                name="address.country"
                                value={incidentDetails.address.country}
                                onChange={handleIncidentDetailsChange}
                                placeholder="Country"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Links Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Evidence Link</label>
                    <div className="mt-1 space-y-2">
                      {/* Display added link */}
                      {hasEvidenceLink && (
                        <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                          <a 
                            href={evidenceLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-purple-600 hover:text-purple-700 truncate flex-1"
                          >
                            {evidenceLink}
                          </a>
                          <button
                            type="button"
                            onClick={handleRemoveEvidenceLink}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {/* Add link input */}
                      {!hasEvidenceLink && (
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            value={evidenceLink}
                            onChange={(e) => setEvidenceLink(e.target.value)}
                            placeholder="Enter evidence link (URL)"
                            className="block flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddEvidenceLink}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Add Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Submit Complaint
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard; 