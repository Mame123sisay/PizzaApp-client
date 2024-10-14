// SlidingComponent.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import magherita from '../image/magherita.jpg'; 

const SlidingComponent = () => {
    return (
        <Box 
            style={{
                display: 'flex',
                overflow: 'hidden',
                width: '95%',
                backgroundColor: 'rgb(72,61,139)',
                position: 'relative',
                borderRadius: '10px',
                marginTop: '40px',
            }}
        >
            <Box 
                style={{
                    display: 'flex',
                    animation: 'slide 12s linear infinite',
                    whiteSpace: 'nowrap',
                }}
            >
               
                {[...Array(3)].map((_, index) => (
                    <Box key={index} style={{ display: 'flex', height: '300px', minWidth: '100%' }}>
                        <Box ><Typography variant='h4' style={{ color: 'white', padding: '20px' }}>
                            Make Your First Order and Get 50% Off
                            <Box style={{margin:'30px'}}>
                                <Button style={{ backgroundColor: 'orange', color: 'white', width: '30%', height: '60px', fontWeight: 'bold' }}>
                                Order Now
                            </Button></Box> 
                        </Typography></Box>
                       
                        <img src={magherita} style={{ width: '485px' }} alt="" />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SlidingComponent;