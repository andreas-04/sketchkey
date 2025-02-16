import React, { useState } from 'react'; // Add useState here
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Register ({themes, themeToggle}) {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirm_password, setPasswordConfirm] = React.useState('');

    const [error, setError] = useState('');
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        console.clear();
        try {
            const response = await fetch('http://localhost:8000/users/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    confirm_password,
                }),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                responseData.message ? setError(responseData.message): setError(responseData.error);
                responseData.message ? console.log(responseData.message) : console.log(responseData.error);
                
            } else {
                throw new Error('Registration failed.');
            }
        } catch (err) {
            setError('Registration failed.');
            console.error(err);
        }
    };



    return (
        <>
        <div className='min-h-screen flex items-center justify-center flex flex-col gap-4'>
            <p className='text-2xl'>Register</p>
            <div className='flex-col flex gap-4'>
            <TextField variant="standard" label="Username" 
                value={username} onChange={(e) => setUsername(e.target.value)}/>
            <TextField variant="standard" label="Email" type="email" 
                value={email} onChange={(e) => setEmail(e.target.value)}/>
            <TextField variant="standard" label="Password" type="password" 
                value={password} onChange={(e) => setPassword(e.target.value)} />
            <TextField variant="standard" label="Confirm Password" type="password" 
                value={confirm_password} onChange={(e) => setPasswordConfirm(e.target.value)} />
            </div>


            <Button sx={{paddingTop: ''}} variant="outlined" onClick={handleRegister}>Register</Button>
            <p>{error}</p>
        </div>
        </>
    )
}

export default Register;

