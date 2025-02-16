import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navLinks = [
        { title: 'Canvas', path: '/canvas' },
        { title: 'Register', path: '/register' },
        { title: 'Login', path: '/' },
        { title: 'Gallery', path: '/gallery' },
    ];

    return (
        <>
            {/* Navbar for Desktop */}
            <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}> 
                <Toolbar>
                    {/* Mobile Menu Button */}
                    <IconButton 
                        color="inherit" 
                        edge="start" 
                        sx={{ display: { md: 'none' }, mr: 2 }} 
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo or Brand Name */}
                    <Typography 
                        variant="h6" 
                        sx={{ flexGrow: 1, fontWeight: 'bold' }}
                    >
                        MyApp
                    </Typography>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex">
                        {navLinks.map((item) => (
                            <Button 
                                key={item.title} 
                                component={Link} 
                                to={item.path} 
                                color="inherit" 
                                sx={{ mx: 1 }}
                            >
                                {item.title}
                            </Button>
                        ))}
                    </div>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer for Mobile */}
            <Drawer 
                anchor="left" 
                open={mobileOpen} 
                onClose={handleDrawerToggle}
                sx={{ '& .MuiDrawer-paper': { width: 250 } }}
            >
                <List>
                    {navLinks.map((item) => (
                        <ListItem key={item.title} disablePadding>
                            <ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle}>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;
