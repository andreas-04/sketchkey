import React from 'react';
import TextField from '@mui/material/TextField';

function Login () {

    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <>
        <div className='min-h-screen flex items-center justify-center flex flex-col'>
            <p className='text-2xl'>Login</p>
            <div className='flex-col flex gap-4'>
            <TextField variant="standard" label="Username" />
            <TextField variant="standard" label="Email" type="email" />
            <TextField variant="standard" label="Password" type="password" />
            </div>
        </div>
        </>
    )
}

export default Login;
