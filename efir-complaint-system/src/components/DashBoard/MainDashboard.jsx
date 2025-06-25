import Overview from "./Overview.jsx";
import Complaints from "./Complaints.jsx";
import ComplaintSubmission from "./ComplaintSubmission.jsx";

const MainDashboard = ({platform}) =>{

    if(platform === 'overview')return <Overview/>
    if(platform === 'complaints')return <Complaints/>
    if(platform === 'new-complaint')return <ComplaintSubmission/>
}
export default MainDashboard;