import React from 'react';
import TextField from '@mui/material/TextField';

function Login () {
    return (
        <>
        <div className='min-h-screen flex items-center justify-center flex flex-col'>
            <p>Login</p>
            <div className='flex-col flex gap-4'>
            <TextField variant="standard" label="Username" />
            <TextField variant="outlined" label="Email" type="email" />
            <TextField variant="filled" label="Password" type="password" />
            </div>
        </div>
        </>
    )
}

export default Login;
