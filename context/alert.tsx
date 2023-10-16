import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

import {
  Alert,
  AlertDescription,
  AlertFooter,
  AlertFooterButton,
  AlertTitle,
} from "@/components/ui/alert";

type AlertType = {
  title: string;
  description?: string;
  button: { text: string; action: () => void }[];
};

interface AlertContextType {
  alert: AlertType | null;
  setAlert: Dispatch<SetStateAction<AlertType | null>>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertContextProvider");
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

export function AlertContextProvider({ children }: Props) {
  const [alert, setAlert] = useState<AlertType | null>(null);

  const alertContext: AlertContextType = {
    alert,
    setAlert,
  };

  return (
    <AlertContext.Provider value={alertContext}>
      {children}
      {alert && (
        <Alert visible={true}>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.description && (
            <AlertDescription>{alert.description}</AlertDescription>
          )}
          <AlertFooter>
            {alert.button.map((btn, i) => (
              <AlertFooterButton
                key={i}
                textStyle={{ fontWeight: "500", color: "#60a5fa" }}
                onPress={btn.action}
              >
                {btn.text}
              </AlertFooterButton>
            ))}
          </AlertFooter>
        </Alert>
      )}
    </AlertContext.Provider>
  );
}
