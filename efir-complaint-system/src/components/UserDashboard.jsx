import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import logo from '../assets/image.png';
import api from '../utils/api';
import ComplaintList from './ComplaintList';

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
  const [username, setUsername] = useState('');
  const [incidence, setIncidentDetails] = useState({
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
  
  // State to store victim and accused
  const [victim, setVictim] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });

  const [accused, setAccused] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });

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

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Fetch active complaints
  useEffect(() => {
    const fetchActiveComplaints = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching complaints...');
        const response = await api.get('/complaint/fetch');
        console.log('Raw API Response:', response);
        console.log('Fetched Complaints Data:', response.data);
        // Extract complaints array from the correct property or wrap single object
        const data = response.data;
        let complaintsArray = [];
        if (Array.isArray(data)) {
          complaintsArray = data;
        } else if (Array.isArray(data.complaints)) {
          complaintsArray = data.complaints;
        } else if (data && typeof data === 'object' && data.id) {
          // Single complaint object
          complaintsArray = [data];
        } else {
          complaintsArray = [];
        }
        if (Array.isArray(complaintsArray)) {
          console.log('Setting complaints in state:', complaintsArray);
          setActiveComplaints(complaintsArray);
        } else {
          console.error('Invalid complaints data format:', response.data);
          setActiveComplaints([]);
        }
      } catch (error) {
        console.error('Error fetching active complaints:', error);
        setActiveComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'complaints') {
      console.log('Tab changed to complaints, fetching data...');
      fetchActiveComplaints();
    }
  }, [activeTab]);

  // Handle victim form input changes
  const handleVictimInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setVictim(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setVictim(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle accused form input changes
  const handleAccusedInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setAccused(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setAccused(prev => ({
        ...prev,
        [name]: value
      }));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      victim,
      accused,
      incidence,
      evidenceLink: hasEvidenceLink ? evidenceLink : null
    };

    console.log('Submitting Complaint:', formData);

    try {
      const response = await api.post('/complaint/save', formData);
      console.log('Complaint Submission Response:', response.data);

      if (response.status === 200) {
        // Show success message
        alert('Complaint submitted successfully!');
        
        // Reset form
        setVictim({
          firstName: '',
          lastName: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          }
        });
        setAccused({
          firstName: '',
          lastName: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          }
        });
        setIncidentDetails({
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
        setEvidenceLink('');
        setHasEvidenceLink(false);
        
        // Optionally switch to complaints tab to see the new complaint
        setActiveTab('complaints');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint. Please try again.');
    }
  };
  

  const handleLogout = () => {
    navigate('/');
  };

  // Handle complaint click
  const handleComplaintClick = (complaint) => {
    console.log('Complaint clicked:', complaint);
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
                onClick={() => {
                  console.log('Setting activeTab to overview');
                  setActiveTab('overview');
                }}
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
                onClick={() => {
                  console.log('Setting activeTab to complaints');
                  setActiveTab('complaints');
                }}
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
                onClick={() => {
                  console.log('Setting activeTab to new-complaint');
                  setActiveTab('new-complaint');
                }}
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
            {console.log('Current activeTab:', activeTab)}
            {console.log('Current activeComplaints:', activeComplaints)}
            {console.log('Is Loading:', isLoading)}
            {console.log('Selected Complaint:', selectedComplaint)}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-purple-600 text-lg font-semibold">Total Complaints</div>
                    <div className="text-3xl font-bold text-purple-700">{activeComplaints.length}</div>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="text-yellow-600 text-lg font-semibold">Active Complaints</div>
                    <div className="text-3xl font-bold text-yellow-700">{
                      activeComplaints.filter(c => c.status === 'PROCESSING' || c.status === 'Active').length
                    }</div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="text-green-600 text-lg font-semibold">Resolved Complaints</div>
                    <div className="text-3xl font-bold text-green-700">{
                      activeComplaints.filter(c => c.status === 'Resolved' || c.status === 'RESOLVED').length
                    }</div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h3>
                  <div className="space-y-4">
                    {activeComplaints.slice(0, 3).map(complaint => (
                      <div key={complaint.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{Array.isArray(complaint.incidence?.crimetype)
                              ? complaint.incidence.crimetype.join(', ')
                              : (typeof complaint.incidence?.crimetype === 'string'
                                  ? (() => { try { return JSON.parse(complaint.incidence.crimetype).join(', '); } catch { return complaint.incidence.crimetype; } })()
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
            )}

            {activeTab === 'complaints' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Complaints</h2>
                {console.log('Rendering complaints section')}
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : selectedComplaint ? (
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
            )}

            {activeTab === 'new-complaint' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">File New Complaint</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Victim Details Section */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">Victim Details</h3>
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={victim.firstName}
                              onChange={handleVictimInputChange}
                              placeholder="First Name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={victim.lastName}
                              onChange={handleVictimInputChange}
                              placeholder="Last Name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={victim.phone}
                            onChange={handleVictimInputChange}
                            placeholder="Phone Number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600">Street Address</label>
                              <input
                                type="text"
                                name="address.street"
                                value={victim.address.street}
                                onChange={handleVictimInputChange}
                                placeholder="Street address"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-600">City</label>
                                <input
                                  type="text"
                                  name="address.city"
                                  value={victim.address.city}
                                  onChange={handleVictimInputChange}
                                  placeholder="City"
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-600">State</label>
                                <input
                                  type="text"
                                  name="address.state"
                                  value={victim.address.state}
                                  onChange={handleVictimInputChange}
                                  placeholder="State"
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-600">ZIP Code</label>
                                <input
                                  type="text"
                                  name="address.zip"
                                  value={victim.address.zip}
                                  onChange={handleVictimInputChange}
                                  placeholder="ZIP code"
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-600">Country</label>
                                <input
                                  type="text"
                                  name="address.country"
                                  value={victim.address.country}
                                  onChange={handleVictimInputChange}
                                  placeholder="Country"
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accused Details Section */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">Accused Details</h3>
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={accused.firstName}
                              onChange={handleAccusedInputChange}
                              placeholder="First Name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={accused.lastName}
                              onChange={handleAccusedInputChange}
                              placeholder="Last Name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={accused.phone}
                            onChange={handleAccusedInputChange}
                            placeholder="Phone Number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600">Street Address</label>
                              <input
                                type="text"
                                name="address.street"
                                value={accused.address.street}
                                onChange={handleAccusedInputChange}
                                placeholder="Street address"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-600">City</label>
                                <input
                                  type="text"
                                  name="address.city"
                                  value={accused.address.city}
                                  onChange={handleAccusedInputChange}
                                  placeholder="City"
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-600">State</label>
                                <input
                                  type="text"
                                  name="address.state"
                                  value={accused.address.state}
                                  onChange={handleAccusedInputChange}
                                  placeholder="State"
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-600">ZIP Code</label>
                                <input
                                  type="text"
                                  name="address.zip"
                                  value={accused.address.zip}
                                  onChange={handleAccusedInputChange}
                                  placeholder="ZIP code"
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-600">Country</label>
                                <input
                                  type="text"
                                  name="address.country"
                                  value={accused.address.country}
                                  onChange={handleAccusedInputChange}
                                  placeholder="Country"
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                              value={incidence.date}
                              onChange={handleIncidentDetailsChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Time of Incident</label>
                            <input
                              type="time"
                              name="time"
                              value={incidence.time}
                              onChange={handleIncidentDetailsChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name="description"
                            value={incidence.description}
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
                                value={incidence.address.street}
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
                                value={incidence.address.city}
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
                                value={incidence.address.zip}
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
                                value={incidence.address.state}
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
                                value={incidence.address.country}
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