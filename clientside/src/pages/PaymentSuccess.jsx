import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const PaymentSuccess = () => {
  const { backendUrl, token } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus({ success: false, message: "Missing session id" });
      return;
    }

    const checkSession = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/user/session?sessionId=${sessionId}`,
          { headers: { token } }
        );
        if (data.success) {
          setStatus({ success: data.session.payment_status === "paid", session: data.session });
        } else {
          setStatus({ success: false, message: data.message });
        }
      } catch (err) {
        console.error(err);
        setStatus({ success: false, message: err.message });
      }
    };

    checkSession();
  }, [sessionId]);

  if (!status) return <div className="p-8">Checking payment status...</div>;

  return (
    <div className="p-8">
      {status.success ? (
        <div>
          <h2 className="text-2xl font-semibold">Payment Successful</h2>
          <p>Your payment was successful. Thank you!</p>
          <button onClick={() => navigate("/my-appointments")} className="mt-4 bg-primary text-white px-4 py-2 rounded">
            View Appointments
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold">Payment Pending/Failed</h2>
          <p>{status.message || "Payment not completed."}</p>
          <button onClick={() => navigate("/my-appointments")} className="mt-4 bg-primary text-white px-4 py-2 rounded">
            Back to Appointments
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
