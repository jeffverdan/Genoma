// src/utils/toastEmitter.ts
type ToastType = "success" | "error" | "warning" | "info";
type Handler = ((msg: string, type?: ToastType) => void) | undefined;

let handler: Handler;
const queue: Array<{ msg: string; type?: ToastType }> = [];

export const setToastHandler = (fn?: (msg: string, type?: ToastType) => void) => {
  handler = fn;
  console.debug("[toastEmitter] setToastHandler called. handler set?:", !!handler);
  if (handler && queue.length) {
    console.debug("[toastEmitter] flushing queue:", queue);
    queue.forEach((item) => handler!(item.msg, item.type));
    queue.length = 0;
  }
};

export const toastEmitter = (msg: string, type: ToastType = "info") => {
  if (typeof window === "undefined") {
    // chamado no servidor — ignore
    console.warn("[toastEmitter] chamado no servidor — ignorando:", msg);
    return;
  }

  if (handler) {
    handler(msg, type);
  } else {
    console.warn("[toastEmitter] Toaster ainda não inicializado — guardando na fila:", msg);
    queue.push({ msg, type });
  }
};
