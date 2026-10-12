export const customEvent = {
  publish: (name: string, data: any) => {
    const event = new CustomEvent(name, {
      detail: data,
    });
    document.dispatchEvent(event);
  },

  subscribe: (
    type: string,
    listener: (event: CustomEvent) => Promise<void> | void,
  ) => {
    document.addEventListener(type, listener, true);
    return () => document.removeEventListener(type, listener, true);
  },
};
