import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Link,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from './pizza.png';
import mame from './mame.jpg';
import magherita from '../image/magherita.jpg';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import SlidingComponent from './SlidingComponent';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';




export const HomePage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
 
  const [pizzaData, setPizzaData] = useState([]);
  const [restaurantName, setRestaurantName] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const fetchRestaurantName = async () => {
    const response = await axios.get(`${apiUrl}/api/restaurants/`);
    console.log(response.data);
    setRestaurantName(response.data);
  };

  const fetchPizza = async () => {
    const response = await axios.get(`${apiUrl}/api/allpizzas/`);
    setPizzaData(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    fetchRestaurantName();
    fetchPizza(); // Fetch pizzas when the component mounts
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    navigate(`/customer/login`);
  };

  const styleText = {
    fontSize: '30px',
    fontWeight: 'bold',
    color:'black'
  };

  return (
    <Box style={{ backgroundColor: 'rgb(245,222,179)' }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <Box style={{ display: 'flex' }}>
          <img src={logo} style={{ width: '50px', marginRight: '10px' }} alt='' />
          <Typography variant='h4' style={{ color: 'rgb(222, 120, 12)' }}>Pizza</Typography>
        </Box>
        <Typography style={styleText}>Home</Typography>
        <Typography style={styleText}>Orders</Typography>
        <Typography style={styleText}>Who We are</Typography>
        <Button
          style={{ backgroundColor: 'orange', color: 'white', width: '100px' }}
          onClick={handleMenuClick}
        >
          Register
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => navigate('/customer/signup')}>Customer</MenuItem>
          <MenuItem onClick={() => navigate('/signup')}>Restaurant</MenuItem>
        </Menu>
      </Box>
      <Box style={{ height: '400px', display: 'flex' }}>
        <Box>
        <Typography id="home" variant='h1' style={{ color: 'orange', fontWeight: 'bold', marginLeft: '60px', marginTop: '80px' }}>Order Us</Typography>
<Typography style={{ marginLeft: '60px', fontSize: '30px', fontFamily: 'Arial', fontWeight: 'normal', width: '80%' }} variant='h6'>
    Our aim is to provide a seamless online pizza ordering experience, allowing you to enjoy your favorite pizzas with just a few clicks. Browse our delicious menu, customize your order,Love our Products...
</Typography><Box sx={{ position: 'relative' }}>
            <input
                style={{
                    width: '60%',
                    height: '100px',
                    borderRadius: '50px',
                    marginTop: '40px',
                    marginLeft: '60px',
                    backgroundColor: 'white',
                    borderWidth: 'none',
                    paddingLeft: '60px', // Adjust padding to fit the icon
                    fontSize: '30px',
                    border:'none',
                    outline: 'none',
                }}
                placeholder='Search'
            />
            <div
                style={{
                    backgroundColor: 'rgb(255,140,0)',
                    height: '90px',
                    borderRadius: '45px',
                    width: '90px',
                    textAlign: 'center',
                    position: 'absolute',
                    left: '680px', 
                    top: '32%', 
                        }}
            >
                <SearchIcon style={{ color: 'white', margin: '20px',fontSize:'60px' }} />
            </div>
        </Box>
          
        </Box>
        <img src={magherita} style={{ width: '300px', borderRadius: '100px' }} alt="logo" />
      </Box>
      <Box style={{ marginTop: '200px', marginLeft: '60px', marginBottom: '50px' }}>
        <Typography style={{color:'gray'}} variant='h3'>Featured Pizza</Typography>
       <SlidingComponent/>
       
      </Box>
      <Box style={{ marginTop: '200px', marginLeft: '60px', marginBottom: '30px' }}>
        <Typography variant='h3' style={{color:'gray'}}>Top Restaurants</Typography>
        
        <Box style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {restaurantName.map((restaurant, index) => (
            <Card key={index} style={{ height: '140px', width: '30%', borderRadius: '20px', margin: '10px' }}>
              <CardMedia style={{ display: 'flex' }}>
                <img src={mame} alt='restaurant' style={{ width: '70px', borderRadius: '20px', height: '40px', margin: '20px' }} />
                <CardHeader title={restaurant.name} />
              </CardMedia>
              <CardContent sx={{fontSize:'18px'}}>
                The best Restaurant in<span style={{color:'orange',fontWeight:'bold',marginLeft:'10px'}} >{restaurant.location}</span>.
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
      <Box style={{ marginTop: '200px', marginLeft: '60px', marginBottom: '30px' }}>
        <Typography sx={{color:'gray'}}variant='h3'>Popular Pizzas</Typography>
        <Box style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {pizzaData.map((pizza) => (
            <Card key={pizza.id} style={{ height: '600px', width: '30%', borderRadius: '20px', margin: '10px' }}>
              <CardMedia>
                <img 
                  src={`${apiUrl}${pizza.image_path}`} // Prepend base URL to image path
                  alt={pizza.name} 
                  style={{ width: '60%', borderRadius: '90px', height: '180px', margin: '20px auto', display: 'block' }} 
                />
                <CardHeader title={pizza.name} />
              </CardMedia>
              <CardContent>
                {pizza.toppings.join(', ')} {/* Display toppings */}
              </CardContent>
              <Box style={{ display: 'flex', justifyContent: 'space-around', paddingRight: '20px', marginBottom: '20px' }}>
                <Typography style={{ color: 'rgb(0,255,0)', fontWeight: 'bold' }} variant='h3'>
                  {pizza.price} Birr
                </Typography>
                <Button 
                  style={{ backgroundColor: 'orange', color: 'white', width: '150px', height: '60px', borderRadius: '10px', fontWeight: 'bold', fontSize: '30px' }} 
                  onClick={() => handleClick()} // Pass the pizza ID correctly
                >
                  Order
                </Button>
              </Box>
              <Divider />
              <CardMedia style={{ display: 'flex' }}>
                <img src={mame} alt='' style={{ width: '70px', borderRadius: '20px', height: '40px', margin: '20px' }} />
                <CardHeader title={pizza.restaurant_name} /> {/* Display the restaurant name */}
              </CardMedia>
            </Card>
          ))}
        </Box>
      </Box>
      <Box style={{ backgroundColor: 'rgb(222,184,135)', marginTop: '350px', height: '250px' }}>
    <Box style={{ display: 'flex', justifyContent: 'space-between', padding: '40px' }}>
        <Box style={{ display: 'flex', padding: '40px', margin: '30px' }}>
            <Link><Typography style={{ fontSize: '30px', fontWeight: 'bold', color: 'black', marginRight: '20px' }}>Home</Typography></Link>
            <Link><Typography style={{ fontSize: '30px', fontWeight: 'bold', color: 'black', marginRight: '20px' }}>Orders</Typography></Link>
            <Link><Typography style={styleText}>About Us</Typography></Link>
        </Box>
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '40px', marginLeft: 'auto' }}>
            <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={logo} style={{ width: '80px', height: '50px', paddingLeft: '40px' }} alt='' />
                <Typography variant='h4' style={{ color: 'rgb(222, 120, 12)', marginLeft: '30px' }}>Pizza</Typography>
            </Box>
            <input
                style={{
                    width: '120%',
                    height: '50px',
                    borderRadius: '10px',
                    marginTop: '20px',
                    backgroundColor: 'white',
                    borderWidth: 'none',
                    paddingLeft: '20px',
                    fontSize: '20px',
                    border: 'none',
                    outline: 'none',
                }}
                placeholder='Your feedback'
            />
        </Box>
    </Box>
</Box>
<Box style={{ backgroundColor: 'black', height: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px' }}>
            <Typography style={{ color: 'white' }} variant='h6'>@2024 Pizza All Rights Reserved.Developed by Mohammed Sisay  Terms and Conditions</Typography>
            <Box style={{ display: 'flex', gap: '15px' }}>
             <FacebookIcon style={{ color: 'white' }} /> 
              <a href='https://www.linkedin.com/in/mohammed-sisay-698259296/'><LinkedInIcon style={{ color: 'white' }} /></a>  
                <TwitterIcon style={{ color: 'white' }} />
                <YouTubeIcon style={{ color: 'white' }} />
            </Box>
        </Box>
        </Box>
 )};