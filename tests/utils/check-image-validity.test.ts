import { afterEach, describe, expect, it, vi } from "vitest";
import checkImageValidity from "@/utils/check-image-validity";

describe("checkImageValidity", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves with the URL when the image loads successfully", async () => {
    const url = "https://example.com/image.png";

    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(value: string) {
        expect(value).toBe(url);
        this.onload?.();
      }
    }

    vi.stubGlobal("Image", MockImage);

    await expect(checkImageValidity(url)).resolves.toBe(url);
  });

  it("rejects with an error when the image fails to load", async () => {
    const url = "https://example.com/broken.png";

    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(value: string) {
        expect(value).toBe(url);
        this.onerror?.();
      }
    }

    vi.stubGlobal("Image", MockImage);

    await expect(checkImageValidity(url)).rejects.toThrow(
      `Failed to load image at: ${url}`,
    );
  });
});
