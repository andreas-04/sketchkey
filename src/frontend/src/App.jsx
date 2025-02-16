import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

import Home from './pages/Home';
import App2 from './pages/App2';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/navbar';
import Gallery from './pages/Gallery';

import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';

const dark_theme = createTheme({
  palette: {
    mode: 'dark', // Enables dark mode
    primary: {
      main: '#1976d2', // MUI blue
    },
    secondary: {
      main: '#dc004e', // MUI pink
    },
    background: {
      default: '#121212', // Dark gray (better than pure black for readability)
      paper: '#1E1E1E', // Slightly lighter for elevated surfaces
    },
    text: {
      primary: '#E0E0E0', // Light gray for better contrast
      secondary: '#B0B0B0', // Softer gray for less important text
    },
  },
});

const light_theme = createTheme({
  palette: {
    mode: 'light', // Enables light mode
    primary: {
      main: '#1976d2', // MUI blue
    },
    secondary: {
      main: '#dc004e', // MUI pink
    },
    background: {
      default: '#F5F5F5', // Light gray background for a soft look
      paper: '#FFFFFF', // Pure white for elevated surfaces (e.g., cards)
    },
    text: {
      primary: '#212121', // Dark gray for primary text
      secondary: '#616161', // Softer gray for less important text
    },
  },
});


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Runs every time the route changes

  return null;
};

function App() {
  const [themes, setThemes] = useState(false);

  const handleThemeChange = () => {
    setThemes(!themes);
  };

  const navLinks = [
    { title: 'Canvas', path: '/canvas', element: <Home /> },
    { title: 'Register', path: '/register', element: <Register /> },
    { title: 'Login', path: '/', element: <Login /> },
    { title: 'Gallery', path: '/gallery', element: <Gallery /> },
];

  return (
    <ThemeProvider theme={themes ? dark_theme : light_theme}>
      <CssBaseline />
      <Router>
        <Navbar theme = {themes ? dark_theme : light_theme } themeToggle={handleThemeChange} navLinks={navLinks}/>
        <ScrollToTop /> 
        <Routes>
          {navLinks.map((link) => (
            <Route key={link.title} path={link.path} element={link.element} />
          ))}
          
        </Routes>
        {/* <Footer /> */}
      </Router>
    </ThemeProvider>
  );
}

export default App;