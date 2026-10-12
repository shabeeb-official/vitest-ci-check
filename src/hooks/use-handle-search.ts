import { useState } from "react";

type UseHandleSearch = [string, (s: string) => void];

const useHandleSearch = (): UseHandleSearch => {
  const [searchTerm, setSearchTerm] = useState("");
  const onTextChange = (v: string) => {
    setSearchTerm(v);
  };

  return [searchTerm, onTextChange];
};

export default useHandleSearch;
