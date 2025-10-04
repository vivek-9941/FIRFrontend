import axios from "axios";
import toast from "react-hot-toast";
import {decryptComplaint} from "../context/DecryptionHelper.js";

export const  fetchActiveComplaints = async () => {
    try {
        console.log('Fetching complaints...');
        const token  = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8085/complaint/fetch', {headers:{'Authorization':'Bearer '+token }});
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
        toast.success("fetched complains");
        const decryptedComplaints = complaintsArray.map(decryptComplaint);
        sessionStorage.setItem('complaints', JSON.stringify(decryptedComplaints));
        return true;
    } catch (error) {
        console.error('Error fetching active complaints:', error);
        return false;
    }
};

