import { useContext } from "react";
import { DialogContext } from "../context/DialogContext";

export const useDialogContext = () => useContext(DialogContext)
