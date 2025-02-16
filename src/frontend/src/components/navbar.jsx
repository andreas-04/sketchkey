import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch, AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Avatar, Popover, Typography } from '@mui/material';
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

    const onSignInClick = () => {
        navigate("/");
    };

    const onSignUpClick = () => {
        navigate("/register");
    };

    const onSignOutClick = () => {
        Cookies.remove('auth');
        setUser(null);
        navigate("/");
    };

    useEffect(() => {
        const authCookie = Cookies.get('auth');
        if (authCookie) {
                setUser(authCookie);
        }
    }, []);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
        {/* Navbar for Desktop */}
        <AppBar position ="static" color='primary' sx={{ backgroundColor: '', 
            display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Toolbar>
                <IconButton>
                    <MenuIcon onClick={handleDrawer} />
                </IconButton>
                {/* Logo */}
                {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }}>sketchkey</Typography> */}

                {/* nav */}
                <div className="hidden md:flex">
                    {navLinks.map((item) => (
                        <Button key={item.title} component={Link} to={item.path} color="inherit" sx={{ mx: 1 }}>
                            {item.title}
                        </Button>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                    <Switch checked={themes} onChange={themeToggle} sx={{
                        '& .MuiSwitch-thumb': 
                        { backgroundColor: themes ? theme[0].palette.background.default : theme[1].palette.background.default, },
                        '& .MuiSwitch-track': {
                        backgroundColor: themes ? theme[0].palette.background.default: theme[1].palette.background.default,},
                        }} />
                </div>
                <div>
                {user ? (
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
                            <Typography sx={{ p: 2 }}>Hi!</Typography>
                            <Button onClick={onSignOutClick}>Sign Out</Button>
                        </Popover>
                            </>
                        ) : (
                            <>
                                <Button color='' onClick={onSignInClick}>Sign In</Button>
                                <Button color='' onClick={onSignUpClick}>Sign Up</Button>
                         </>
                )}
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