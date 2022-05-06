import "./App.css";
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
} from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
  Navigate,
} from "react-router-dom";
import RegisterPage from "./pages/RegistrationPage/RegisterPage";
import SetupPage from "./pages/SetupPage/SetupPage";
import SetupSectionsPage from "./pages/SetupSectionsPage/SetupSectionsPage";
import AssistantPage from "./pages/AssistantPage/AssistantPage";

import useToken from "./components/Token/useToken";
// import Header from "./components/Token/Header";
import RegRequestsPage from "./pages/RegistrationRequestsPage/RegRequestsPage";
import EditSchedulePage from "./pages/EditSchedulePage/EditSchedulePage";
// const App = () => {
//   let routes = useRoutes([
//     { path: "/", element: <RegisterPage /> },

//     { path: "/login", element: <LoginPage /> },
//     { path: "/register", element: <RegisterPage /> },
//     { path: "/dashboard", element: <DashboardPage /> },
//     { path: "/setup", element: <SetupPage /> },
//   ]);
//   return routes;
// };
// const AppWrapper = () => {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// };
// export default AppWrapper;

export default function App() {
  const { token, removeToken, setToken } = useToken();
  let isLoggedIn = token !== null && token !== undefined;
  return (
    <Router>
      {/* <Header token={removeToken} /> TODO: logout button move to another component*/}
      <Routes>
        <Route
          exact
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />

        {isLoggedIn
          ? [
              <Route
                path={"/dashboard"}
                element={
                  <DashboardPage
                    token={token}
                    setToken={setToken}
                    removeToken={removeToken}
                  />
                }
              />,
              <Route
                path={"/setup"}
                element={
                  <SetupPage
                    token={token}
                    setToken={setToken}
                    removeToken={removeToken}
                  />
                }
              />,
              <Route
                path={"/assign-sections"}
                element={
                  <SetupSectionsPage
                    token={token}
                    setToken={setToken}
                    removeToken={removeToken}
                  />
                }
              />,
              <Route
                exact
                path="/registration-requests"
                element={
                  <RegRequestsPage
                    token={token}
                    setToken={setToken}
                    removeToken={removeToken}
                  />
                }
              />,
              <Route
                exact
                path="/assistant"
                element={
                  <AssistantPage
                    token={token}
                    setToken={setToken}
                    removeToken={removeToken}
                  />
                }
              />,
              <Route
                exact
                path="/edit-schedules"
                element={
                  <EditSchedulePage
                    token={token}
                    setToken={setToken}
                    removeToken={removeToken}
                  />
                }
              />,
            ]
          : [
              <Route
                exact
                path="/login"
                element={<LoginPage setToken={setToken} />}
              />,
              <Route exact path="/register" element={<RegisterPage />} />,
            ]}

        <Route path={"*"} element={<Navigate replace to={"/"} />} />
      </Routes>
    </Router>
  );
}
