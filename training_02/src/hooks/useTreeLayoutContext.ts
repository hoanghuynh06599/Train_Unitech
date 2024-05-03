import { useContext } from "react";
import { TreeLayoutContext } from "../context/TreeLayoutContext";

export const useTreeLayoutContext = () => useContext(TreeLayoutContext)
