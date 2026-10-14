
import { afterEach, describe, expect, it, vi } from "vitest";
import logger from "@/utils/logger";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages with the INFO prefix", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    logger.info("Application started");

    expect(spy).toHaveBeenCalledWith("INFO: ", "Application started");
  });

  it("forwards multiple info arguments", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    logger.info("User", 123, { active: true });

    expect(spy).toHaveBeenCalledWith(
      "INFO: ",
      "User",
      123,
      { active: true },
    );
  });

  it("logs debug messages with the DEBUG prefix", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => {});

    logger.debug("Debug details");

    expect(spy).toHaveBeenCalledWith("DEBUG: ", "Debug details");
  });

  it("forwards multiple debug arguments", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => {});

    logger.debug("Request", 200, { success: true });

    expect(spy).toHaveBeenCalledWith(
      "DEBUG: ",
      "Request",
      200,
      { success: true },
    );
  });

  it("logs error messages with the ERROR prefix", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.error("Something went wrong");

    expect(spy).toHaveBeenCalledWith("ERROR: ", "Something went wrong");
  });

  it("forwards multiple error arguments", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const error = new Error("Network failure");

    logger.error("Request failed", error);

    expect(spy).toHaveBeenCalledWith("ERROR: ", "Request failed", error);
  });

  it("supports calls without arguments", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.info();
    logger.debug();
    logger.error();

    expect(logSpy).toHaveBeenCalledWith("INFO: ");
    expect(debugSpy).toHaveBeenCalledWith("DEBUG: ");
    expect(errorSpy).toHaveBeenCalledWith("ERROR: ");
  });
});
