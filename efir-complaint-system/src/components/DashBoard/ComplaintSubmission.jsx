import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Footer from '../Footer.jsx';
import axios from "axios";
import toast from "react-hot-toast";
import {encryptComplaint} from "../../context/DecryptionHelper.js";

const ComplaintSubmission = () => {
    const navigate = useNavigate();
    const [evidenceLink, setEvidenceLink] = useState('');
    const [hasEvidenceLink, setHasEvidenceLink] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleVictimInputChange = (e) => {
        const {name, value} = e.target;
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
        const {name, value} = e.target;
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
        const {name, value} = e.target;
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
        setIsSubmitting(true); // start loading

        const formData = {
            victim,
            accused,
            incidence,
            evidenceLink: hasEvidenceLink ? evidenceLink : null
        };
        const encrypted = encryptComplaint(formData);
        console.log('Submitting Complaint:', encrypted);
        try {
            const response = await axios.post('http://localhost:8085/complaint/save', encrypted, {headers: {'Authorization': "Bearer " + localStorage.getItem('token')}});
            console.log('Complaint Submission Response:', response.data);

            if (response.status === 200) {
                // Show success message
                toast.success('Complaint submitted successfully!');

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

            }
        } catch (error) {
            toast.error(error.message);
            console.error('Error submitting complaint:', error);
            alert('Failed to submit complaint. Please try again.');
        }
        finally {
            setIsSubmitting(false);
            window.location.reload();
        }
    };


    return (
        <div className="w-full mx-2 px-2 my-1">
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
                                        <label className="block text-sm font-medium text-gray-600">Street
                                            Address</label>
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
                                        <label className="block text-sm font-medium text-gray-600">Street
                                            Address</label>
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
                                        <label className="block text-sm font-medium text-gray-600">Street
                                            Address</label>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"/>
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

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            isSubmitting
                                ? "bg-purple-400 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Complaint"}
                    </button>

                </div>
            </form>

        </div>
    )
}


export default ComplaintSubmission;