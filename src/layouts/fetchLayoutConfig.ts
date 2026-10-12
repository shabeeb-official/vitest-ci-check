import { THEME_CONFIG_URI } from "@/config";
import axios from "axios";
import { normalizeLayouts } from "./normalizeLayout";

export type ServerLayoutResponse = {
  status: boolean;
  data: {
    theme_config: {
      chat: any;
      plp: any;
      pdp: any;
      home: any;
    };
    "layout-schema": any;
  };
};

export async function fetchLayoutConfig(token?: string) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: THEME_CONFIG_URI,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request<ServerLayoutResponse>(config);
    const data = response.data;

    if (!data?.status) {
      throw new Error("Invalid layout config response");
    }

    if (!data?.data?.["layout-schema"] || !data?.data?.theme_config) {
      return false;
    }

    const { theme_config, "layout-schema": layoutSchema } = data.data;
    const layouts = normalizeLayouts(theme_config, layoutSchema);

    return layouts;
  } catch (error) {
    console.error("Error fetching layout config:", error);
    return false;
  }
}
