import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Box, Typography, Modal } from '@mui/material';
import axios from 'axios';
import logo from './pizza.png';
import { Link, useNavigate } from 'react-router-dom';

// Define Zod schema for validation
const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string().min(4, 'Confirm password is required'),
    location: z.string().min(1, 'Location is required'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const RegisterCustomerForm = () => {
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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${apiUrl}/api/customer/signup`, data);
            if (response.status === 200) {
                const userId = response.data.userId; // Get userId from response
                localStorage.setItem('userId', userId); // Store userId in local storage
           console.log(localStorage.getItem('userId'));    
                setModalMessage('Sign up successfully');
                setModalTitle('Success');
                setModalOpen(true);
                // Delay navigation to allow modal to show
                setTimeout(() => {
                navigate('/customer/login');
                }, 2000); // Delay of 2 seconds
            }
            console.log(response.data);
        } catch (error) {
            setModalMessage('Sign up failed');
            setModalTitle('Error');
            setModalOpen(true);
            console.error('Error:', error.response?.data || error.message);
        }
    };

    return (
        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100vh' }}>
            <Box style={{ backgroundColor: 'orange', width: '100%', flex: '1', padding: '20px', textAlign: 'center', minWidth: '200px' }}>
                <img src={logo} style={{ width: '100%', maxWidth: '300px', margin: '50px auto' }} alt='' />
            </Box>
            <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
                <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <img src={logo} style={{ width: '50px', marginRight: '10px' }} alt='' />
                    <Typography variant='h4' style={{ color: 'rgb(222, 120, 120)' }}>Pizza</Typography>
                </Box>
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
                <TextField
                    label="Confirm Password"
                    type="password"
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    style={inputStyle}
                    fullWidth
                />
                <TextField
                    label="Location"
                    {...register('location')}
                    error={!!errors.location}
                    helperText={errors.location?.message}
                    style={inputStyle}
                    fullWidth
                />
                <TextField
                    label="Phone Number"
                    {...register('phoneNumber')}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    style={inputStyle}
                    fullWidth
                />
                <Typography>
                    <input type="checkbox" /> I accept Terms and Conditions
                </Typography>
                <Button type="submit" style={buttonStyle} fullWidth>Sign up</Button>
                <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
                    Already have an account?
                    <Link to="/customer/login"><Button style={{ color: 'orange' }}>Login</Button></Link>
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

export default RegisterCustomerForm;