import { createContext, useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getAllDoctors = useCallback(
    async function getAllDoctors() {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/admin/all-doctors",
          {},
          { headers: { Authorization: `Bearer ${aToken}` } }
        );
        if (data.success) {
          setDoctors(data.doctors);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
    [backendUrl, aToken]
  );

  const changeAvailability = async (docId) => {
    try {
      const toastId = toast.loading("Change Availability in progress");
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      console.log(data);
      if (data.success) {
        console.log(data);
        toast.update(toastId, {
          render: data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        getAllDoctors();
      } else {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = useCallback(
    async function getAllAppointments() {
      try {
        const { data } = await axios.get(
          backendUrl + "/api/admin/appointments",
          {
            headers: { Authorization: `Bearer ${aToken}` },
          }
        );
        if (data.success) {
          setAppointments(data.appointments);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    },
    [backendUrl, aToken]
  );

  const cancelAppointment = async (appointmentId) => {
    try {
      const toastId = toast.loading("Cancelling Appointment in progress");
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      if (data.success) {
        toast.update(toastId, {
          render: data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        getAllAppointments();
        getDashData();
      } else {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = useCallback(
    async function getDashData() {
      try {
        const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${aToken}` },
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
    [backendUrl, aToken]
  );
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    getDashData,
    dashData,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
