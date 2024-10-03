import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Box, Typography, Modal } from '@mui/material';
import axios from 'axios';
import logo from './pizza.png';
import { Link, useNavigate } from 'react-router-dom';

// Define Zod schema for login validation
const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
});

const CustomerLoginForm = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
    };

    const inputStyle = {
        marginBottom: '15px',
        padding: '10px',
        borderRadius: '4px',
    };

    const buttonStyle = {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: 'orange',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    };

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const handleLogin = async (data) => {
        try {
            const response = await axios.post(`${apiUrl}/api/customer/login`, data);
            const { userId,userName } = response.data;
            console.log(userName);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', userName);
            setModalMessage('Login successful');
            setModalTitle('Success');
            setModalOpen(true);
            setTimeout(() => {
             navigate(`/loginhome`)   ;
            }, 2000); // Delay of 2 seconds
        } catch (error) {
            setModalMessage('Login failed. Please check your credentials.');
            setModalTitle('Error');
            setModalOpen(true);
            console.error('Error:', error.response?.data || error.message);
        }
    };

    return (
        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '700px' }}>
            <Box style={{ backgroundColor: 'orange', width: '100%', flex: '1', padding: '20px', textAlign: 'center', minWidth: '200px', height: '700px' }}>
                <img src={logo} style={{ width: '100%', maxWidth: '300px', margin: '50px auto' }} alt='' />
            </Box>
            <form onSubmit={handleSubmit(handleLogin)} style={formStyle}>
                <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <img src={logo} style={{ width: '50px', marginRight: '10px' }} alt='' />
                    <Typography variant='h4' style={{ color: 'rgb(222, 120, 120)' }}>Pizza</Typography>
                </Box>
                <Typography style={{ margin: '20px', fontSize: '15px' }}>Login</Typography>
                
                <TextField
                    label="Email Address"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    style={inputStyle}
                    fullWidth
                />

                <TextField
                    label="Password"
                    type="password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    style={inputStyle}
                    fullWidth
                />

                <Typography>
                    <input type="checkbox" /> Remember Me
                </Typography>
                <Button type="submit" style={buttonStyle} fullWidth>Login</Button>
                <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
                    Don't have an account?
                    <Link to="/customer/signup"><Button style={{ color: 'orange' }}>Sign Up</Button></Link>
                </Typography>
            </form>

            {/* Modal for feedback */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: 300, 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4,
                    textAlign: 'center' // Center text in modal
                }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        {modalTitle}
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        {modalMessage}
                    </Typography>
                    <Button onClick={() => setModalOpen(false)} style={{ marginTop: '20px' }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default CustomerLoginForm;