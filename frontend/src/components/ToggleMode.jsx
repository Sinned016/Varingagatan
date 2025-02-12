import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export default function ToggleMode() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="ghost"
      className="group px-3 py-2"
    >
      {theme === "dark" ? (
        <Moon className="  text-blue-400" size={28} />
      ) : (
        <Sun
          className="text-yellow-600 group-hover:rotate-180 duration-300 ease-in-out z-10"
          size={28}
        />
      )}
    </Button>
  );
}
