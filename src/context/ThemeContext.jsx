import { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("app_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user.email) {
        user.preferredTheme = nextTheme;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const setSpecificTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark") {
      setTheme(newTheme);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user && user.email) {
          user.preferredTheme = newTheme;
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setSpecificTheme, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
