import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const useDarkMode = () => {
  const [theme, setTheme] = useState<Theme>("light");

  const switchTheme = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    document.documentElement.setAttribute("class", selectedTheme);
  };

  const toggleTheme = () => {
    const selectedTheme = theme === "light" ? "dark" : "light";    
    switchTheme(selectedTheme);
    console.log("MODE " + selectedTheme.toLocaleUpperCase());
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") as Theme;
    if (localTheme) {
      switchTheme(localTheme);
    } 
  }, []);

  return [theme, toggleTheme] as const;
};

export default useDarkMode;
