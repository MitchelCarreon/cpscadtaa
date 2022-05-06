import React, { useEffect, useState } from "react";
import "./RegRequestsPage.css";
import userBackground from "../../assets/svg/background_user.svg";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

import RegistrationRequestsTable from "../../components/Tables/RegistrationRequestsTable";
import Loader from "../../components/LoadingScreen/Loader";
import { Navigate } from "react-router-dom";

import { useSpring, animated } from "react-spring";

// import Notification from "../Forms/SectionForm/controls/Notification";
import Notification from "../../components/Forms/SectionForm/controls/Notification"

export default function RegRequestsPage(props) {
  document.title = "Registration requests - ADTAA";
  // For <Loader />
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 900);
  // }, []);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [credentials, setCredentials] = React.useState(null);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);

    axios
      .get("/credentials", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        console.log(response);
        const data = response.data;
        data.access_token && props.setToken(data.access_token);
        setCredentials({
          user_email: data.email,
          user_access_level: data.accessLevel,
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          // localStorage.removeItem("token");
          props.removeToken()
        }
      });

    // getRegisterRequests(); // Table used to be here. This call was needed to fill the table w/ initial data
  }, []);

  // const fadeInAnimationStyle = useSpring({to: {opacity: 1}, from: {opacity: -1}, config : {duration: 2500} })

  // useEffect() runs after render. Render loading page first to ensure credentials are retrieved.
  if (loading === true) return <Loader message={""} />;
  else if (credentials === undefined || credentials === null)
    // handles tampering using localStorage.setItem("token") and localStorage.removeItem("token")
    return (
      <Loader message={"Authenticating... Please refresh if page does not load"} />
    );
  else if (credentials.user_access_level !== "ROOT") {
    // handles going to page via URL and unauthorized access.
    return <Navigate replace to="/dashboard" />;
  }
  return (
    <div className="background-requests">
      <div className="banner-requests">
        <img
          src={userBackground}
          alt="person logo"
          className="person-background"
        />
      </div>

      <Sidebar
        page="regRequests"
        accessLevel={credentials.user_access_level}
        email={credentials.user_email}
        logout={props.removeToken}
      />
      <div className="table-container-requests">
        <RegistrationRequestsTable
          token={props.token}
          setToken={props.setToken}
          setNotify={setNotify}
        />
        <Notification notify={notify} setNotify={setNotify} />
      </div>
    </div>
  );
}

// SIMPLE TEST TABLE:
// {/* <div className="table-container" style={{ top: "25%" }}>
//   {/* <button onClick={getRegisterRequests}>temp button</button> */}
//   <table>
//     <thead>
//       <tr>
//         <th>Username</th>
//         <th>Email Address</th>
//         <th>Requested Access Level</th>
//       </tr>
//     </thead>
//     <tbody>
//       {tableData.map((user) => {
//         return (
//           <tr>
//             <td>{user.username}</td>
//             <td>{user.email}</td>
//             <td>{user.accessLevel}</td>
//             <td>
//               <button onClick={() => setRegistrationStatus(true, user.email)}>
//                 Approve
//               </button>
//               <button onClick={() => setRegistrationStatus(false, user.email)}>
//                 Deny
//               </button>
//             </td>
//           </tr>
//         );
//       })}
//     </tbody>
//   </table>
// </div>; */}
