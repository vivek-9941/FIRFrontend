import SideBar from "./SideBar.jsx";
import {useEffect, useState} from "react";
import {fetchActiveComplaints} from "../../utils/session.js";
import MainDashboard from "./MainDashboard.jsx";
import {useNavigate} from "react-router-dom";
import Footer from "../Footer.jsx";
import {decryptAES} from "../../utils/AESEncryption.js";
import {decryptuser} from "../../context/DecryptionHelper.js";

const Dashboard = () =>{
    const [platform,setplatform] = useState("overview");
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            try {
                const encrypted = localStorage.getItem("user");
                if (encrypted) {
                const person = decryptuser(JSON.parse(encrypted));
                setUser(person);
                }

                if (sessionStorage.getItem("complaints") === null) {
                    await fetchActiveComplaints(); // Wait for the fetch to complete
                }

                setLoading(false);
            } catch (error) {
                console.error("Error loading data:", error);
                setLoading(false); // Ensure loading stops even if there's an error
            }
        };

        loadData();
    }, []);

    if(loading){
        return(
            <>
            <div className="text-center text-xl">Loading...</div></>
        )
    }

    function handlelogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        sessionStorage.removeItem("complaints")
        navigate("/");
    }


    return(
<div className="m-2">

           <span className="h-10 flex justify-end  py-1 text-lg font-semibold">
               <div >Welcome, {user.firstName + " "+ user.lastName}</div>
              <button className="bg-red-500 text-white rounded px-3 mx-2" onClick={handlelogout}> logout</button>
           </span>
        <div className={`flex `}>
        <div className="w-[20%]">
        <SideBar select={platform} onSelect={setplatform}/>
        </div>
            <div className="w-full">

         <MainDashboard platform={platform}/>
            </div>
        </div>
    <Footer/>
</div>
        )



}
export default Dashboard;