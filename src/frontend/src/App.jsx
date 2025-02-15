import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import App2 from './pages/App2';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark', // Change to "dark" for dark mode
    primary: {
      main: '#1976d2', // MUI blue
    },
    secondary: {
      main: '#dc004e', // MUI pink
    },
    background: {
      default: '#000000',
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop /> {/* Always scroll to top on route change */}
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app2" element={<App2 />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </ThemeProvider>
  );
}

export default App;