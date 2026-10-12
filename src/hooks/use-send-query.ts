import { useState, useRef, useCallback, startTransition } from "react";
import {
  saveChatToSessionStorage,
  genAssistantChatMessage,
  genUserChatMessage,
} from "@/utils/chat";
import { useChat } from "@/store/chat";
import { useProductsDispatch } from "@/store/products";
import { useNavigate } from "react-router-dom";
import sendPrompt from "@/utils/api/send-prompt";
import { RequestStatus } from "@/types/req-resonse";
import { OnSendQuery, QueryResponse } from "@/types/chat";
import { debug } from "debug";
import { useIsMobileWidth } from "./use-mobile-width";
import { PATHS } from "@/paths";
import { botTurn, viewItemList } from "@/utils/gtm_events";
import { saveProductToSessionStorage } from "@/utils/product";
import { useAuth } from "@/store/auth/use-auth";
import useGetCountry from "./use-country";
import { preloadImages } from "@/hooks/use-preload-images";

const log = debug("app:Chat");
const COUNT_DOWN_IN_MILLI_SECONDS = 5000;

const useSendQuery = (switchToProductsView?: () => void): QueryResponse => {
  const country = useGetCountry();
  const reqCount = useRef(0);
  const isMobile = useIsMobileWidth();
  const [requestStatus, setRequstStatus] = useState<RequestStatus>("idle");
  const [countDownInMilliSeconds, setCountDownInMilliSeconds] =
    useState<number>(0);

  const [_, chatDispatch] = useChat();
  const productsDispatch = useProductsDispatch();

  const sendPromptBtn = useRef(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const onSendQuery: OnSendQuery = useCallback(
    async (opts) => {
      const { beforeSend, onSuccess, query, trend } = opts || {};
      const queryText = trend ? trend.trim() : query.trim();
      if (!queryText) {
        log("no query text provided aborting");
        return;
      }

      if (requestStatus === "pending") {
        log("request pending aborting");
        return;
      }
      log("request send, response pending status: loading");
      setRequstStatus("pending");
      productsDispatch({ type: "LOADING_PRODUCT" });
      if (isMobile) {
        log("device is in mobile width resetting countdonw timer");
        setCountDownInMilliSeconds(0);
      }
      sendPromptBtn.current = true;

      const requestMessage = genUserChatMessage(queryText);
      saveChatToSessionStorage(requestMessage);
      chatDispatch({
        type: "ADD_CHAT",
        payload: requestMessage,
      });
      log("request message added to chat history");

      const loadingMessage = genAssistantChatMessage("loading");
      chatDispatch({
        type: "ADD_CHAT",
        payload: loadingMessage,
      });
      log("loading assistant message added to chat history");
      if (beforeSend) {
        beforeSend();
      }

      console.log("country", country);
      const { products, message, status, chips } = await sendPrompt(
        queryText,
        {
          token: auth.token,
          trend: Boolean(trend),
        },
        country,
      );

      log("response received status:", status ? "success" : "failed");
      botTurn(reqCount.current);

      setRequstStatus(status ? "success" : "failed");
      chatDispatch({
        type: "UPDATE_CHAT",
        payload: {
          content: message,
          chips: chips,
          id: loadingMessage.id,
          productCount: products?.length || 0,
        },
      });
      saveChatToSessionStorage({
        ...loadingMessage,
        content: message,
        chips: chips,
      });
      log("updating assistant chat bubble with server response");

      if (products.length > 0) {
        setCountDownInMilliSeconds(COUNT_DOWN_IN_MILLI_SECONDS);
        // Start image downloads immediately — before navigation / PLP paint.
        preloadImages(products.map((product) => product.imageUrl));
        log("adding assistant response for products");
        productsDispatch({ type: "REPLACE_PRODUCT", payload: products });
        saveProductToSessionStorage(products);
        if (onSuccess) {
          onSuccess();
        }
        reqCount.current += 1;
        viewItemList(products);
        if (isMobile) {
          log("setting coutdown due to mobile width");
          setCountDownInMilliSeconds(COUNT_DOWN_IN_MILLI_SECONDS);
          return;
        }
        if (switchToProductsView) {
          switchToProductsView();
          return;
        }
        startTransition(() => navigate(PATHS.products.root));
      }
    },
    [
      isMobile,
      requestStatus,
      chatDispatch,
      navigate,
      productsDispatch,
      switchToProductsView,
      auth.token,
      country,
    ],
  );

  return {
    onSendQuery,
    status: requestStatus,
    countDownInMilliSeconds,
    resetCountdown: () => setCountDownInMilliSeconds(0),
  };
};

export default useSendQuery;
