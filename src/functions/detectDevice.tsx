export function detectDevice(): string {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return "Servidor (Node.js)";
    }
  
    const userAgent = navigator.userAgent.toLowerCase();
  
    if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
      return "Smartphone";
    }
  
    if (/tablet|ipad/.test(userAgent)) {
      return "Tablet";
    }
  
    return "Desktop";
  }