import { createContext, useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState();
  const getAppointments = useCallback(
    async function getAppointments() {
      try {
        const { data } = await axios.get(
          backendUrl + "/api/doctor/appointments",
          {
            headers: { Authorization: `Bearer ${dToken}` },
          }
        );
        if (data.success) {
          setAppointments(data.appointments);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
    [dToken, backendUrl]
  );

  const completeAppointment = async (appointmentId) => {
    try {
      const toastId = toast.loading("Appointment Complete in progress");
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (data.success) {
        toast.update(toastId, {
          render: data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const toastId = toast.loading("Cancel Appointment in progress");
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (data.success) {
        toast.update(toastId, {
          render: data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = useCallback(
    async function getDashData() {
      try {
        const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
          headers: { Authorization: `Bearer ${dToken}` },
        });
        if (data.success) {
          setDashData(data.dashData);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
    [backendUrl, dToken]
  );
  const getProfileData = useCallback(
    async function getProfileData() {
      try {
        const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
          headers: { Authorization: `Bearer ${dToken}` },
        });
        if (data.success) {
          setProfileData(data.profileData);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
    [backendUrl, dToken]
  );
  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    getProfileData,
    setProfileData,
    profileData,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
