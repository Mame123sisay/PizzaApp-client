import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import logo from './pizza.png';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
   
const LoginForm = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setErrors({}); // Clear errors when modal closes
    };

    const loginSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(3, 'Password must be at least 3 characters long'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate input
            loginSchema.parse({ email, password });

            const response = await axios.post(`${apiUrl}/api/login`, { email, password });
            const { restaurant_id, role_name, role_id } = response.data;
            console.log(response.data);
            if (role_id === 0 && role_name ===null) {
                localStorage.setItem('restaurantId', restaurant_id);
                localStorage.setItem('userRole', 'SUPERADMIN');
                setSuccess(true);
                setMessage('Successfully logged in as SUPERADMIN');
                setTimeout(() => {

                    navigate('/Dashboard');
                }, 2000);
               
            } else if (role_id > 0 && role_id !=null) {
                const roleName = role_name.replace(/\s+/g, '').toUpperCase();
                localStorage.setItem('restaurantId', restaurant_id);
                localStorage.setItem('userRole', roleName);
                setSuccess(true);
                setMessage('Successfully logged in');
                setTimeout(() => {
                    navigate('/Dashboard');
                }, 2000);
              
            } else {
                throw new Error('Invalid credentials '); // Explicit error for unexpected role IDs
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach(err => {
                    newErrors[err.path[0]] = err.message; // Map errors to input fields
                });
                setErrors(newErrors);
                setMessage('Please correct the highlighted errors.');
            } else if (error.response) {
                setMessage('Login failed: ' + error.response.data.message);
            } else {
                setMessage('An unexpected error occurred. Please try again later.');
            }
            setSuccess(false);
            handleClickOpen();
        }
    };

    return (
        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '700px' }}>
            <Box style={{ backgroundColor: 'orange', width: '100%', flex: '1', padding: '20px', textAlign: 'center', minWidth: '200px', height: '700px' }}>
                <img src={logo} style={{ width: '100%', maxWidth: '300px', margin: '50px auto' }} alt='' />
            </Box>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <img src={logo} style={{ width: '50px', marginRight: '10px' }} alt='' />
                    <Typography variant='h4' style={{ color: 'rgb(222, 120, 120)' }}>Pizza</Typography>
                </Box>
                <Typography style={{ margin: '20px', fontSize: '15px' }}>Login</Typography>
                <TextField
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '15px' }}
                    fullWidth
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: '15px' }}
                    fullWidth
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                />
                <Typography>
                    <TextField type="checkbox" /> Remember Me
                </Typography>
                <Button type="submit" style={{ marginTop: '20px', padding: '10px', backgroundColor: 'orange', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }} fullWidth>Login</Button>
                <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
                    Don't have an account?
                    <Link to="/signup"><Button style={{ color: 'orange' }}>Sign Up</Button></Link>
                </Typography>
            </form>

            {/* Modal for success/failure messages */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{success ? 'Success' : 'Error'}</DialogTitle>
                <DialogContent>
                    <Typography>{message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LoginForm;