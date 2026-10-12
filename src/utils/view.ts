import { View } from "@/pages/View";

export const getSelectedView = () => {
  const saved = localStorage.getItem("selected-view") as View;
  return saved ? saved : "chat";
};

export const setSelectedView = (view: View) => {
  localStorage.setItem("selected-view", view);
};
