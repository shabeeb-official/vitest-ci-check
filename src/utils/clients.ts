import { isEqualTo } from "./predicates/equals";
import { TENANT_NAME } from "@/config";

import gs_chat from "../layouts/skins/gs/chat.json";
import gs_plp from "../layouts/skins/gs/plp.json";
import gs_pdp from "../layouts/skins/gs/pdp.json";
import gs_home from "../layouts/skins/gs/home.json";

import rd_chat from "../layouts/skins/rd/chat.json";
import rd_plp from "../layouts/skins/rd/plp.json";
import rd_pdp from "../layouts/skins/rd/pdp.json";
import rd_home from "../layouts/skins/rd/home.json";

import cb_chat from "../layouts/v2/cb/chat.json";
import cb_plp from "../layouts/v2/cb/plp.json";
import cb_pdp from "../layouts/v2/cb/pdp.json";
import cb_home from "../layouts/v2/cb/home.json";

export const getActiveClientConfig = () => {
  const [_, clientConfig] = Object.entries(clients).find(([_, v]) => {
    return v.isActive(TENANT_NAME);
  });
  return clientConfig;
};

type ClientConfig = {
  [v: string]: {
    isActive: (b: string) => boolean;
    session_id: string;
    layouts: {
      chat: any;
      plp: any;
      pdp: any;
      home: any;
    };
  };
};

const clients: ClientConfig = {
  cityBeach: {
    isActive: isEqualTo("citybeach"),
    session_id: "bz_cb",
    layouts: {
      chat: cb_chat,
      plp: cb_plp,
      pdp: cb_pdp,
      home: cb_home,
    },
  },
  roddGunn: {
    isActive: isEqualTo("roddgunn"),
    session_id: "bz_rg",
    layouts: {
      chat: rd_chat,
      plp: rd_plp,
      pdp: rd_pdp,
      home: rd_home,
    },
  },
  graceStella: {
    isActive: isEqualTo("gracestella"),
    session_id: "bz_gs",
    layouts: {
      chat: gs_chat,
      plp: gs_plp,
      pdp: gs_pdp,
      home: gs_home,
    },
  },
};

export default clients;
