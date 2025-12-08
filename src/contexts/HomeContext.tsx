"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type HomeContextProps = {
  mainSearchQuery: string;
  setMainSearchQuery: (mainSearchQuery: string) => void;
  selectedLocation: string;
  setSelectedLocation: (selectedLocation: string) => void;
};

const HomeContext = createContext<undefined | HomeContextProps>(undefined);

type HomeContextProviderProps = {
  children: ReactNode;
};

export const HomeContextProvider = ({ children }: HomeContextProviderProps) => {
  const [mainSearchQuery, setMainSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    if (selectedLocation) {
      sessionStorage.setItem("SELECTED_LOCATION", selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    const storedLocation = sessionStorage.getItem("SELECTED_LOCATION");
    if (storedLocation) {
      setSelectedLocation(storedLocation);
    }
  }, []);

  return (
    <HomeContext.Provider
      value={{
        mainSearchQuery,
        setMainSearchQuery,
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);

  if (!context) {
    throw new Error("Home context should be used within HomeContextProvider");
  }

  return context;
};
