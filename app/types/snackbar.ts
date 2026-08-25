export type SnackbarSeverity = "success" | "error";

export type SnackbarContextValue = {
  showSnackbar: (message: string, severity: SnackbarSeverity) => void;
};
