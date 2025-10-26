// src/context/ToasterContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { setToastHandler } from "@/functions/toastEmitter";
import { FaExclamationCircle } from "react-icons/fa";

type ToastType = "success" | "error" | "warning" | "info";
interface ToasterContextType {
    showToast: (msg: string, type?: ToastType) => void;
}

const ToasterContext = createContext<ToasterContextType>({ showToast: () => { } });
export const useToaster = () => useContext(ToasterContext);

export const ToasterProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<ToastType>("info");

    useEffect(() => {
        // registra o handler global (mesma instância do módulo toastEmitter)
        setToastHandler((msg: string, type: ToastType = "info") => {
            setMessage(msg);
            setSeverity(type);
            setOpen(true);
        });

        console.debug("[ToasterProvider] handler registrado");
        // opcional: limpar handler quando desmontar
        return () => setToastHandler(undefined);
    }, []);

    const showToast = (msg: string, type: ToastType = "info") => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    return (
        <ToasterContext.Provider value={{ showToast }}>
            {children}
            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={() => setMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    className={`alert ${severity}`}
                    icon={<FaExclamationCircle size={20} />}
                    severity={severity}
                    variant="filled"
                    onClose={() => setMessage('')}
                >
                    {message}
                </Alert>
            </Snackbar>
        </ToasterContext.Provider>
    );
};
