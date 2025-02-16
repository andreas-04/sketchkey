import {createTheme} from '@mui/material/styles';


const themes = [
    createTheme({
      palette: {
        mode: 'dark', // Enables dark mode
        primary: {
          main: '#c45555', // MUI blue
        },
        secondary: {
          main: '#c45555', // MUI pink
        },
        button: {
          default: '#c45555',
        },
        background: {
          default: '#121212', // Dark gray (better than pure black for readability)
          paper: '#1E1E1E', // Slightly lighter for elevated surfaces
          border: '#F5F5F5',
        },
        text: {
          primary: '#E0E0E0', // Light gray for better contrast
          secondary: '#B0B0B0', // Softer gray for less important text
          buttons: '#f5f5f5',
        },
        navbar: {
          primary: '#E0E0E0', // Light gray for better contrast
          secondary: '#B0B0B0', // Softer gray for less important text
        },
      },
    }),
    
    createTheme({
      palette: {
        mode: 'light', // Enables light mode
        primary: {
          main: '#c45555', // MUI blue
        },
        secondary: {
          main: '#dc004e', // MUI pink
        },
        button: {
          default: '#c45555',
        },
        background: {
          default: '#F5F5F5', // Light gray background for a soft look
          paper: '#FFFFFF', // Pure white for elevated surfaces (e.g., cards)
          border: '#1E1E1E',

        },
        text: {
          primary: '#212121', // Dark gray for primary text
          secondary: '#616161', // Softer gray for less important text
          buttons: '#E0E0E0',
        },
        navbar: {
          primary: '#E0E0E0', // Light gray for better contrast
          secondary: '#B0B0B0', // Softer gray for less important text
        },
      },
    }),
  ];
  
  export default themes;
