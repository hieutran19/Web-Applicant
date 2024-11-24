import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const getToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_FE_LINKS
        }api/v1/hrm/applicant/oauth_callback?code=${code}&state=${state}`
      );
      localStorage.setItem(
        "google_token",
        JSON.stringify(response.data.token_infor)
      );
      navigate(-3);
    } catch (error) {
      console.error("Error cridentals:", error);
    }
  };
  useEffect(() => {
    getToken();
  }, []);
  return <div></div>;
}
