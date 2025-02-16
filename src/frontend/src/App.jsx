import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/navbar';
import Gallery from './pages/Gallery';
import Rank from './pages/Rank';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './themes/themes';
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
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  const handleThemeChange = () => {
    setThemes(!themes);
  };

  const navLinks = [
    { title: 'Canvas', path: '/canvas', element: <Home /> },
    // { title: 'Register', path: '/register', element: <Register /> },
    // { title: 'Login', path: '/', element: <Login /> },
    { title: 'Gallery', path: '/gallery', element: <Gallery /> },
    { title: 'Rank', path: '/rank', element: <Rank /> },
  ];

  const appBarHeader = [
    // { title: 'Canvas', path: '/canvas', element: <Home /> },
    // { title: 'Gallery', path: '/gallery', element: <Gallery /> },
    // { title: 'Rank', path: '/rank', element: <Rank /> },
  ];

  useEffect(() => {
    const authCookie = Cookies.get('auth');
    if (authCookie) {
      setUser(authCookie);
    }
  }, []);

  return (
    <ThemeProvider theme={themes ? theme[0] : theme[1]}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        {user ? (
          <>
            <Navbar theme={themes ? theme[0] : theme[1]} themeToggle={handleThemeChange} navLinks={appBarHeader} />
            <Routes>
              {navLinks.map((link) => (
                <Route key={link.title} path={link.path} element={link.element} />
              ))}
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;