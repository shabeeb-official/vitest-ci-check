import { describe, it, expect, vi } from "vitest";
import { handleTextSelection } from "@/utils/helper/textSelector";

describe("handleTextSelection", () => {
  it("stops propagation for mouse pointer events", () => {
    const stopPropagation = vi.fn();

    const event = {
      nativeEvent: {
        pointerType: "mouse",
      },
      stopPropagation,
    } as any;

    handleTextSelection(event);

    expect(stopPropagation).toHaveBeenCalledOnce();
  });

  it.each(["touch", "pen", ""])(
    "does not stop propagation for pointer type '%s'",
    (pointerType) => {
      const stopPropagation = vi.fn();

      const event = {
        nativeEvent: {
          pointerType,
        },
        stopPropagation,
      } as any;

      handleTextSelection(event);

      expect(stopPropagation).not.toHaveBeenCalled();
    },
  );
});
