import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/navbar';
import Gallery from './pages/Gallery';
import Rank from './pages/Rank'

import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './themes/themes';

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
    { title: 'Rank', path: '/rank', element: <Rank /> },
];

  return (
    <ThemeProvider theme={themes ? theme[0] : theme[1]}>
      <CssBaseline />
      <Router>
        <Navbar theme = {themes ? theme[0] : theme[1] } themeToggle={handleThemeChange} navLinks={navLinks}/>
        <ScrollToTop /> 
        <Routes>
          {navLinks.map((link) => (
            <Route theme = {themes ? theme[0] : theme[1] } themeToggle={handleThemeChange} key={link.title} path={link.path} element={link.element} />
          ))}
          
        </Routes>
        {/* <Footer /> */}
      </Router>
    </ThemeProvider>
  );
}

export default App;