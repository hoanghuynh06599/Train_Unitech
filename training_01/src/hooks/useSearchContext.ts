import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

export const useSearchContext = () => useContext(SearchContext)
