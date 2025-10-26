import { toastEmitter } from '@/functions/toastEmitter';
import axios from 'axios';

const axiosInterceptorInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SAFEBOX_API_V1, // Replace with your API base URL
});

// Response interceptor
let isRedirecting = false;

axiosInterceptorInstance.interceptors.response.use(response => {
  if (response !== undefined && response?.data.status === 200 && response?.data.success === false) {
    const originalReq = response.config;
    localStorage.setItem('token', response?.data.token);
    originalReq.headers["Authorization"] = `Bearer ${response?.data.token}`;
    return axiosInterceptorInstance(originalReq);
  }
  console.log("Response Intercept:", response);    
  return response
}, err => {
  console.log(err);
  if (!err.response) {
    toastEmitter("Não foi possível se conectar ao servidor. Verifique sua conexão com a internet ou tente novamente mais tarde.", "error");
    return Promise.reject(err);
  }

  const status = err.response.status;
  const message = err.response.data?.message || "Erro desconhecido";

  // Retorna o erro original se for status 300
  if (status === 300) {
    return Promise.reject(err);
  }

  //  tratando erro
  if (!isRedirecting) {
    if (status === 401 || status === 498 || message === "The token has been blacklisted") {
      isRedirecting = true;
      if(message !== "The token has been blacklisted") {
        toastEmitter("Sua sessão expirou. Faça o seu login novamente.", "warning");
        setTimeout(() => {          
          window.location.href = "/";
        }, 1500);
      } else {
        toastEmitter("Sua sessão expirou, vamos recarregar a página para ativar novamente.", "warning");
        setTimeout(() => window.location.reload(), 1500);
      }
      return;
    }

    if (status === 403) {
      // toastEmitter(`Acesso negado: ${message}`, "error");
      setTimeout(() => (window.location.href = "/403"), 1000);
      return;
    }

    toastEmitter(`Erro: ${message}`, "error");
    //return Promise.reject(err);
  }

  return;
});
// End of Response interceptor

export default axiosInterceptorInstance;