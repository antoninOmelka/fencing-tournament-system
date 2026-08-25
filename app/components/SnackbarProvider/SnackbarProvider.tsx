"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { SnackbarContextValue, SnackbarSeverity } from "@/app/types/snackbar";

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

type SnackbarProviderProps = {
  children: React.ReactNode;
};

function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<SnackbarSeverity>("success");

  const showSnackbar = useCallback(
    (newMessage: string, newSeverity: SnackbarSeverity) => {
      setMessage(newMessage);
      setSeverity(newSeverity);
      setIsOpen(true);
    },
    [],
  );

  const handleClose = (_event?: unknown, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpen(false);
  };

  const contextValue = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={isOpen}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export default SnackbarProvider;
