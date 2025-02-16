import React, { useState } from 'react'; // Add useState here
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function Login () {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
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
                responseData.message ? document.cookie = `auth=${responseData.token}; path=/; Secure; SameSite=Lax` : console.log(responseData.error);
                location.replace(location.href)
                navigate('/canvas');
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
            <p className='text-2xl'>Login</p>
            <div className='flex-col flex gap-4'>
            <TextField variant="standard" label="Username" 
                value={username} onChange={(e) => setUsername(e.target.value)}/>
            <TextField variant="standard" label="Password" type="password" 
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button sx={{paddingTop: ''}} variant="outlined" onClick={handleLogin}>Login</Button>
            <p className=''>{error}</p>
        </div>
        </>
    )
}

export default Login;
