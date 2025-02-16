import React, { useState } from 'react'; // Add useState here
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const setCock = (response) => {
    document.cookie = `auth=${response.token}; path=/; Secure; SameSite=Lax`;
    document.cookie = `uid=${response.user_id}; path=/; Secure; SameSite=Lax`;
}
function Login () {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate("/register")
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        console.clear();
        try {
            const response = await fetch('http://localhost:8000/users/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                responseData.message ? setError(responseData.message): setError(responseData.error);
                responseData.message ? setCock(responseData) : console.log(responseData.error);
                navigate('/canvas');
                location.replace(location.href)
            } else {
                throw new Error('Login failed.');
            }
        } catch (err) {
            setError('Login failed.');
            console.error(err);
        }
    };

    return (
        <>
        <div className='min-h-screen flex items-center justify-center flex flex-col gap-4'>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4 }}>
            <img src="../../public/sk.png" alt="Register" style={{ maxWidth: '40%', height: 'auto' }} />
        </Box>
            {/* <p className='text-2xl'>Login</p> */}
            <div className='flex-col flex gap-4'>
            <TextField variant="standard" label="Username" placeholder='admin'
                value={username} onChange={(e) => setUsername(e.target.value)}/>
            <TextField variant="standard" label="Password" type="password" placeholder='password123'
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button sx={{paddingTop: ''}} variant="outlined" onClick={handleLogin}>Login</Button>
            <Button sx={{paddingTop: ''}} variant="outlined" onClick={handleSignUp}>Sign Up</Button>
            <p className=''>{error}</p>
        </div>
        </>
    )
}

export default Login;
