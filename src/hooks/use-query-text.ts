import { useState } from "react";

const useQueryText = () => {
  const [queryText, setQueryText] = useState<string>("");
  const handleQueryTextChange = (v: string) => setQueryText(v);
  const resetQueryText = () => setQueryText("");

  return { queryText, handleQueryTextChange, resetQueryText };
};

export default useQueryText;
