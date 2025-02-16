import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch, AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Avatar, Popover, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Cookies from 'js-cookie';
// import jwtDecode from 'jwt-decode';
import theme from '../themes/themes'; 

const Navbar = ({ themes, themeToggle, navLinks }) => {
    const [mobile, setMobile] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleDrawer = () => {
        setMobile(!mobile);
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const onSignOutClick = () => {
        Cookies.remove('auth');
        setUser(null);
        navigate("/");
        location.replace(location.href)
    };

    const onGallaryClick = () => {
        navigate("/gallary")
    }

    const onRankClick = () => {
        navigate("/rank")
    }


    useEffect(() => {
        const authCookie = Cookies.get('auth');
        if (authCookie) {
                setUser(authCookie);
        }
    }, []);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onLogoClick = () => {
        navigate('/canvas')
    }

    return (
        <>
        {/* Navbar for Desktop */}
        <AppBar position="static" sx={{ backgroundColor: '#c45555', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Toolbar sx={{  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton>
                    <MenuIcon onClick={handleDrawer} />
                </IconButton>
                <Box sx={{ width: '10%', display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Button 
                onClick={onLogoClick} 
                >
                <img src="../../public/sk_light.png" alt="Register" style={{ maxWidth: '80%', height: 'auto' }} />
                </Button>
                   
                </Box>
                <div className="hidden md:flex">
                    {navLinks.map((item) => (
                        <Button key={item.title} component={Link} to={item.path} color="inherit" sx={{ mx: 1 }}>
                            {item.title}
                        </Button>
                    ))}
                </div>
               
                <div>

                    <>
                        <IconButton onClick={handleAvatarClick}>
                            <Avatar />
                        </IconButton>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                         <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                    <Switch checked={themes} onChange={themeToggle} sx={{
                        '& .MuiSwitch-thumb': { backgroundColor: themes ? theme[0].palette.text.primary : theme[1].palette.text.primary },
                        '& .MuiSwitch-track': { backgroundColor: themes ? theme[0].palette.text.primary : theme[1].palette.text.primary },
                    }} />
                </div>
                          <Button onClick={onGallaryClick}>Gallary</Button>
                            <Button onClick={onRankClick}>Rank</Button>
                            <Button onClick={onSignOutClick}>Sign Out</Button>
                        </Popover>
                            </>
                       
                </div>  
            </Toolbar>
        </AppBar>

        {/* Navbar for Mobile */}
        <Drawer anchor="left" open={mobile} onClose={handleDrawer} sx={{ '& .MuiDrawer-paper': { width: 250 } }}>
            <List>
                {navLinks.map((item) => (
                    <ListItem key={item.title} disablePadding>
                        <ListItemButton component={Link} to={item.path} onClick={handleDrawer}>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
        </>
    );
}

export default Navbar;