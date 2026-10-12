import { useMemo } from "react";
import { DEFAULT_REGION } from "@/config";
import { useRegion } from "@/contexts/layoutContext";

const regionMap = {
  en_AU: "au",
  en_NZ: "nz",
  en_US: "us",
  en_GB: "gb",
  en_CA: "ca",
  en: "eu",
  fr_FR: "fr",
  fr_CA: "ca/fr",
  de_DE: "eu/de",
};

const useGetCountry = () => {
  const region = useRegion();
  const activeRegions = useMemo(() => {
    return regionMap[region] || regionMap[DEFAULT_REGION];
  }, [region]);

  // console.log("activeRegions", activeRegions);
  return activeRegions;
};

export default useGetCountry;
