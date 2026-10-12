import { AUTHENTICATION_SERVER, TENANT_ID } from "@/config";
import axios from "axios";

const authenticateSession = async () => {
  try {
    const response = await axios.post(
      AUTHENTICATION_SERVER,
      {
        tenant_id: TENANT_ID,
      },
      {
        headers: {
          Origin: "https://citybeach-demo.aventusinformatics.com",
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.token;
  } catch (error) {
    console.error("Request failed:", error.message);
    return null;
  }
};

export default authenticateSession;
