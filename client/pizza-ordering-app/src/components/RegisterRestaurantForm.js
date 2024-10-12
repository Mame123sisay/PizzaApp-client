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
    adminName: z.string().min(1, 'Admin name is required'),
    superAdminEmail: z.string().email('Invalid email address'),
    superAdminPassword: z.string().min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string().min(4, 'Confirm password is required'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    restaurantName: z.string().min(1, 'Restaurant name is required'),
    location: z.string().min(1, 'Location is required'),
}).refine(data => data.superAdminPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

const RegisterRestaurantForm = (onRegister) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // State for image preview

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Create a preview URL
        }
    };

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

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const handleSubmitForm = async (data) => {
        const formData = new FormData();
        
        // Append form fields to FormData
        formData.append('adminName', data.adminName);
        formData.append('superAdminEmail', data.superAdminEmail);
        formData.append('superAdminPassword', data.superAdminPassword);
        formData.append('confirmPassword', data.confirmPassword);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('restaurantName', data.restaurantName);
        formData.append('location', data.location);
        if (imageFile) {
            formData.append('logo', imageFile); // Append the logo file
        }

        try {
            const response = await axios.post(`${apiUrl}/api/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { restaurantId, logo } = response.data; //
            localStorage.setItem('restaurantId', restaurantId);
            onRegister('SUPERADMIN');
            setModalMessage('Registration successful');
            setModalTitle('Success');
            setModalOpen(true);
            setImagePreview(logo || null); 

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000); // Delay navigation by 2 seconds
        } catch (error) {
            setModalMessage('Registration failed. Please try again.');
            setModalTitle('Error');
            setModalOpen(true);
            console.error('Error:', error.response?.data || error.message);
        }
    };

    return (
        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '10px' }}>
            <Box style={{ backgroundColor: 'orange', width: '100%', flex: '1', padding: '20px', textAlign: 'center', minWidth: '200px', height: '950px' }}>
                <img src={logo} style={{ width: '100%', maxWidth: '300px', margin: '20px auto' }} alt='' />
            </Box>
            <form onSubmit={handleSubmit(handleSubmitForm)} style={formStyle}>
                <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <img src={logo} style={{ width: '50px', marginRight: '10px' }} alt='' />
                    <Typography variant='h4' style={{ color: 'rgb(222, 120, 120)' }}>Pizza</Typography>
                </Box>
                <TextField 
                    label="Admin Name" 
                    {...register('adminName')} 
                    error={!!errors.adminName} 
                    helperText={errors.adminName?.message} 
                    fullWidth 
                />
                <TextField 
                    label="Email Address" 
                    {...register('superAdminEmail')} 
                    error={!!errors.superAdminEmail} 
                    helperText={errors.superAdminEmail?.message} 
                    fullWidth 
                />
                <TextField 
                    label="Password" 
                    type="password" 
                    {...register('superAdminPassword')} 
                    error={!!errors.superAdminPassword} 
                    helperText={errors.superAdminPassword?.message} 
                    fullWidth 
                />
                <TextField 
                    label="Confirm Password" 
                    type="password" 
                    {...register('confirmPassword')} 
                    error={!!errors.confirmPassword} 
                    helperText={errors.confirmPassword?.message} 
                    fullWidth 
                />
                <TextField 
                    label="Phone Number" 
                    {...register('phoneNumber')} 
                    error={!!errors.phoneNumber} 
                    helperText={errors.phoneNumber?.message} 
                    fullWidth 
                />
                <TextField 
                    label="Restaurant Name" 
                    {...register('restaurantName')} 
                    error={!!errors.restaurantName} 
                    helperText={errors.restaurantName?.message} 
                    fullWidth 
                />
                <TextField 
                    label="Location" 
                    {...register('location')} 
                    error={!!errors.location} 
                    helperText={errors.location?.message} 
                    fullWidth 
                />
                
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="pizzaPhotoInput"
                />
                <label htmlFor="pizzaPhotoInput" style={{
                    display: 'block',
                    width: '300px',
                    backgroundColor: 'white',
                    color: 'orange',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginTop: '20px',
                    border: '2px dotted black',
                    marginBottom: '6px',
                }}>
                    Upload logo 
                </label>
                {imagePreview && (
                    <div style={{ marginTop: '10px' }}>
                        <img
                            src={imagePreview}
                            alt="Image Preview"
                            style={{ width: '10%', height: 'auto', marginTop: '10px' }}
                        />
                        <Typography variant="body2" style={{ marginTop: '5px' }}>
                            {imageFile.name}
                        </Typography>
                    </div>
                )}
                
                <Typography>
                    <input type="checkbox" /> I accept the Terms and Conditions
                </Typography>
                
                <Button type="submit" style={{ marginTop: '20px', padding: '10px', backgroundColor: 'orange', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }} fullWidth>Register</Button>
                <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
                    Already have an account? 
                    <Link to="/login"><Button style={{ color: 'orange' }}>Login</Button></Link>
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
                    textAlign: 'center' 
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

export default RegisterRestaurantForm;