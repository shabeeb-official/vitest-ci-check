
import { afterEach, describe, expect, it, vi } from "vitest";
import { customEvent } from "@/utils/events";

describe("customEvent", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  describe("publish", () => {
    it("dispatches a custom event with the provided data", () => {
      const listener = vi.fn();

      document.addEventListener("product-added", listener);

      const data = { sku: "SKU123", quantity: 2 };
      customEvent.publish("product-added", data);

      expect(listener).toHaveBeenCalledTimes(1);

      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event).toBeInstanceOf(CustomEvent);
      expect(event.type).toBe("product-added");
      expect(event.detail).toEqual(data);

      document.removeEventListener("product-added", listener);
    });

    it("supports publishing null data", () => {
      const listener = vi.fn();
      document.addEventListener("test-event", listener);

      customEvent.publish("test-event", null);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].detail).toBeNull();

      document.removeEventListener("test-event", listener);
    });
  });

  describe("subscribe", () => {
    it("calls the listener when the subscribed event is published", () => {
      const listener = vi.fn();

      customEvent.subscribe("cart-updated", listener);
      const data = { count: 3 };

      customEvent.publish("cart-updated", data);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].detail).toEqual(data);
    });

    it("returns an unsubscribe function that removes the listener", () => {
      const listener = vi.fn();

      const unsubscribe = customEvent.subscribe("cart-updated", listener);

      customEvent.publish("cart-updated", { count: 1 });
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      customEvent.publish("cart-updated", { count: 2 });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("does not call the listener for a different event type", () => {
      const listener = vi.fn();

      customEvent.subscribe("cart-updated", listener);
      customEvent.publish("product-added", { sku: "SKU123" });

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
