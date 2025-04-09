import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Admin/Dashboard";
import AllApointments from "./pages/Admin/AllApointments";
import AddDoctors from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import { AdminContext } from "./context/AdminContext";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const isAuthenticated = aToken || dToken;

  return (
    <>
      <ToastContainer />
      {isAuthenticated ? (
        <div className="bg-[#F8F9FD]">
          <Navbar />
          <div className="flex items-start">
            <Sidebar />
            <Routes>
              {/* Redirect root to appropriate dashboard */}
              <Route
                path="/"
                element={
                  aToken ? (
                    <Navigate to="/admin-dashboard" />
                  ) : (
                    <Navigate to="/doctor-dashboard" />
                  )
                }
              />

              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/all-appointments" element={<AllApointments />} />
              <Route path="/add-doctor" element={<AddDoctors />} />
              <Route path="/doctor-list" element={<DoctorsList />} />

              {/* Doctor Routes */}
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route
                path="/doctor-appointments"
                element={<DoctorAppointment />}
              />
              <Route path="/doctor-profile" element={<DoctorProfile />} />

              {/* Catch-all route */}
              <Route
                path="*"
                element={
                  aToken ? (
                    <Navigate to="/admin-dashboard" />
                  ) : (
                    <Navigate to="/doctor-dashboard" />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Redirect all unknown routes to login if not authenticated */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
};

export default App;
