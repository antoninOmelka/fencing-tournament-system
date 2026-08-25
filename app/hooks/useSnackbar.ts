"use client";

import { useContext } from "react";
import { SnackbarContext } from "../components/SnackbarProvider/SnackbarProvider";
import { SnackbarContextValue } from "../types/snackbar";

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}
