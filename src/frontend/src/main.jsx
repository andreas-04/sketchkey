import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light", // Change to "dark" for dark mode
    primary: {
      main: "#1976d2", // MUI blue
    },
    secondary: {
      main: "#dc004e", // MUI pink
    },
    background: {
      default: "#f5f5f5",
    }
  },
});

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
      <CssBaseline />
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeProvider>
)
