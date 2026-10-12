const logger = {
  info: (...message: any[]) => {
    console.log("INFO: ", ...message);
  },
  debug: (...message: any[]) => {
    console.debug("DEBUG: ", ...message);
  },
  error: (...message: any[]) => {
    console.error("ERROR: ", ...message);
  },
};

export default logger;
