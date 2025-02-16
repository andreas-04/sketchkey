import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch, AppBar, Toolbar, Button, IconButton, Avatar, Popover, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Cookies from 'js-cookie';
import theme from '../themes/themes'; 

const Navbar = ({ themes, themeToggle}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    var currentTheme = useTheme();

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const onSignOutClick = () => {
        Cookies.remove('auth');
        navigate("/");
        location.replace(location.href)
    };

    const onGallaryClick = () => {
        navigate("/gallery")
    }

    const onRankClick = () => {
        navigate("/rank")
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onLogoClick = () => {
        navigate('/canvas')
    }

    return (
        <AppBar position ="static" color='' sx={{ color: currentTheme.palette.text.buttons, backgroundColor: currentTheme.palette.button.default, 
            display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Toolbar sx={{  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className='hidden md:flex'>
                <Button sx={{ width: '10%', display: 'flex', justifyContent: '', mb: 1 }} onClick={onLogoClick}>    <Box sx={{ width: '100%', display: 'flex', justifyContent: '', mb: 1 }}>
                   <img src="../../public/sk_light.png" alt="Register" style={{ maxWidth: '80%', height: 'auto' }} />
                </Box></Button>
                </div>

                <div>
                    

                    <>
                        <IconButton sx={{

                        }}
                        color='' onClick={handleAvatarClick}>
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
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                                <Switch checked={themes} onChange={themeToggle} sx={{
                                    '& .MuiSwitch-thumb': { backgroundColor: themes ? theme[0].palette.text.primary : theme[1].palette.text.primary },
                                    '& .MuiSwitch-track': { backgroundColor: themes ? theme[0].palette.text.primary : theme[1].palette.text.primary },
                                }} />
                                <Button onClick={onGallaryClick}>Gallery</Button>
                                <Button onClick={onRankClick}>Rank</Button>
                                <Button onClick={onSignOutClick}>Sign Out</Button>
                            </Box>
                        </Popover>
                            </>
                       
                </div>  
                <IconButton color="inherit" edge="right" sx={{ display: { md: 'none' }, mr: 2 }} onClick={handleDrawer}>
                <MenuIcon />
            </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;