import { createTheme } from "@mui/material/styles";
import { colors } from "@mui/material";

export const themeModes = {
  dark: "dark",
  light: "light"
};

const themeConfigs = {
  custom: ({ mode }) => {
    const customPalette = mode === themeModes.dark ? {
      primary: {
        main: "#006aff",
        contrastText: "#ffffff"
      },
      secondary: {
        main: "#f44336",
        contrastText: "#ffffff"
      },
      background: {
        default: "#000000",
        paper: "#131313"
      }
    } : {
      primary: {
        main: "#007AFF",
        contrastText: "#ffffff"
      },
      secondary: {
        main: "#EBF5FF",
        contrastText: "#007AFF"
      },
      background: {
        default:"#E0EEFF",
      },
      pagination: {
        main: "#EBF5FF",
        contrastText: "#337AF6"
      }
    };

    return createTheme({
      palette: {
        mode,
        ...customPalette
      },
    });
  }
};

export default themeConfigs;