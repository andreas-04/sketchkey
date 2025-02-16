import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { Switch, AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { CenterFocusStrong } from '@mui/icons-material';
import theme from '../themes/themes'; 

const Navbar = ({themes, themeToggle, navLinks}) => {
    // const [nav, setNav] = useState(false);

    const [mobile, setMobile] = useState(false);

    const handleDrawer = () => {
        setMobile(!mobile);
    };

    return (
        <>
        {/* Navbar for Desktop */}
        <AppBar position ="static" sx={{ backgroundColor: '#c45555', 
            display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Toolbar>
                <IconButton>
                    <MenuIcon onClick={handleDrawer} />
                </IconButton>
                {/* Logo */}
                {/* <Typography 
                    variant="h6" 
                    sx={{fontWeight: 'bold' }}
                >
                    sketchkey
                </Typography> */}

                {/* nav */}
                <div className="hidden md:flex ">
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                    <Switch checked={themes} onChange={themeToggle} sx={{
                        '& .MuiSwitch-thumb': 
                        { backgroundColor: themes ? theme[0].palette.text.primary : theme[1].palette.text.primary, },
                        '& .MuiSwitch-track': {
                        backgroundColor: themes ? theme[0].palette.text.primary : theme[1].palette.text.primary,},
                        }} />
                </div>
            </Toolbar>
            </AppBar>
            {/* Navbar for Mobile */}
                <Drawer 
                    anchor="left" 
                    open={mobile} 
                    onClose={handleDrawer}
                    sx={{ '& .MuiDrawer-paper': { width: 250 } }}
                >
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

export default Navbar