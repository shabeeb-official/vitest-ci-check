import { describe, expect, it } from "vitest";
import {
  toastInitialState,
  toastReducer,
} from "@/hooks/toast-reducer";

const toast = (id: string, overrides: Record<string, unknown> = {}) => ({
  id,
  title: `Toast ${id}`,
  open: true,
  ...overrides,
});

describe("toastReducer", () => {
  it.each([
    {
      name: "ADD_TOAST prepends toast",
      prev: toastInitialState,
      action: { type: "ADD_TOAST" as const, toast: toast("1") },
      expected: { toasts: [toast("1")] },
    },
    {
      name: "UPDATE_TOAST merges fields for matching id",
      prev: { toasts: [toast("1"), toast("2")] },
      action: {
        type: "UPDATE_TOAST" as const,
        toast: { id: "2", title: "Updated" },
      },
      expected: {
        toasts: [toast("1"), toast("2", { title: "Updated" })],
      },
    },
    {
      name: "DISMISS_TOAST sets open false for matching id",
      prev: { toasts: [toast("1"), toast("2")] },
      action: { type: "DISMISS_TOAST" as const, toastId: "1" },
      expected: {
        toasts: [toast("1", { open: false }), toast("2")],
      },
    },
    {
      name: "DISMISS_TOAST without id dismisses all",
      prev: { toasts: [toast("1"), toast("2")] },
      action: { type: "DISMISS_TOAST" as const },
      expected: {
        toasts: [
          toast("1", { open: false }),
          toast("2", { open: false }),
        ],
      },
    },
    {
      name: "REMOVE_TOAST removes matching id",
      prev: { toasts: [toast("1"), toast("2")] },
      action: { type: "REMOVE_TOAST" as const, toastId: "1" },
      expected: { toasts: [toast("2")] },
    },
    {
      name: "REMOVE_TOAST without id clears all",
      prev: { toasts: [toast("1"), toast("2")] },
      action: { type: "REMOVE_TOAST" as const },
      expected: { toasts: [] },
    },
  ])("$name", ({ prev, action, expected }) => {
    expect(toastReducer(prev as never, action as never)).toEqual(expected);
  });

  it("ADD_TOAST enforces TOAST_LIMIT of 1", () => {
    const prev = { toasts: [toast("old")] };
    const next = toastReducer(prev as never, {
      type: "ADD_TOAST",
      toast: toast("new") as never,
    });
    expect(next.toasts).toHaveLength(1);
    expect(next.toasts[0].id).toBe("new");
  });

  it("UPDATE_TOAST with unknown id leaves toasts unchanged", () => {
    const prev = { toasts: [toast("1")] };
    const next = toastReducer(prev as never, {
      type: "UPDATE_TOAST",
      toast: { id: "missing", title: "nope" },
    });
    expect(next.toasts).toEqual(prev.toasts);
    expect(next.toasts[0]).toBe(prev.toasts[0]);
  });

  it("returns the same state reference for unknown actions", () => {
    const prev = Object.freeze({ toasts: Object.freeze([toast("1")]) });
    const next = toastReducer(prev as never, { type: "UNKNOWN" } as never);
    expect(next).toBe(prev);
  });

  it("does not mutate previous state on ADD/UPDATE/REMOVE", () => {
    const prev = {
      toasts: [toast("1", { title: "Original" })],
    };
    const snapshot = structuredClone(prev);
    Object.freeze(prev);
    Object.freeze(prev.toasts);
    Object.freeze(prev.toasts[0]);

    toastReducer(prev as never, {
      type: "ADD_TOAST",
      toast: toast("2") as never,
    });
    toastReducer(prev as never, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "Changed" },
    });
    toastReducer(prev as never, { type: "REMOVE_TOAST", toastId: "1" });
    toastReducer(prev as never, { type: "DISMISS_TOAST", toastId: "1" });

    expect(prev).toEqual(snapshot);
  });

  it("handles empty toasts payload paths safely", () => {
    expect(
      toastReducer(toastInitialState, {
        type: "UPDATE_TOAST",
        toast: { id: "x", title: "noop" },
      }),
    ).toEqual(toastInitialState);

    expect(
      toastReducer(toastInitialState, {
        type: "DISMISS_TOAST",
        toastId: "x",
      }),
    ).toEqual(toastInitialState);

    expect(
      toastReducer(toastInitialState, {
        type: "REMOVE_TOAST",
        toastId: "x",
      }),
    ).toEqual(toastInitialState);
  });
});
