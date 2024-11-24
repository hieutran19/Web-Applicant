import { useContext } from "react";
import LoadingContext from "../Context/LoadingProvider";

const useLoading = () => {
  const { loading } = useContext(LoadingContext);
  return useContext(LoadingContext);
};

export default useLoading;
