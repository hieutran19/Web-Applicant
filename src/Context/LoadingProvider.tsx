import { ReactNode, createContext, useState } from "react";
import Loading from "../components/loading/Loading";

interface AuthProviderProps {
  children: ReactNode;
}

const LoadingContext = createContext({});
export const LoadingProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && <Loading isOverlay />} {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
