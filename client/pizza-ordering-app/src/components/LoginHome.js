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
import { useNavigate, useParams } from 'react-router-dom';
import logo from './pizza.png';
import mame from './mame.jpg';
import magherita from '../image/magherita.jpg';
import axios from 'axios';
import SlidingComponent from './SlidingComponent';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

 const LoginHome = () => {
  const {userName}=useParams();
  const apiUrl = process.env.REACT_APP_API_URL; // 
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

  const handleOrderDetail = () => {
    navigate('/customer/orderdetails ');
  };


  const handleLogout = () => {
    localStorage.removeItem('customerId');
    navigate(`/`);
  };
  const handleClick = (pizzaId) => {
    navigate(`/order/pizzadetail/${pizzaId}`);
  };

  const styleText = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'orange',
    textDecoration:'none',
  };

  return (
    <Box style={{ backgroundColor: 'rgb(245,222,179)' }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <Box style={{ display: 'flex' }}>
          <img src={logo} style={{ width: '50px', marginRight: '10px' }} alt='' />
          <Typography variant='h4' style={{ color: 'rgb(222, 120, 12)' }}>Pizza</Typography>
        </Box>
       
       
        <Typography style={styleText}>Cart</Typography>
        <Typography style={styleText}>{localStorage.getItem('userName')}</Typography>
      <a href='' onClick={handleOrderDetail}> <Typography variant='' style={styleText}> your Order Details</Typography></a> 
       <a href="#pizzas"> <Typography style={styleText}>Pizzas</Typography></a>
        <Button
          style={{ backgroundColor: 'orange', color: 'white', width: '100px' }}
          onClick={handleLogout}
        >
          logout
        </Button>
       
      </Box>
     {/* <Box style={{ height: '400px', display: 'flex' }}>
        <Box>
          <Typography variant='h1' style={{ color: 'orange', fontWeight: 'bold', marginLeft: '60px', marginTop: '80px' }}>Order us</Typography>
          <Typography style={{ marginLeft: '60px', fontSize: '30px', fontStyle: 'arial', fontWeight: '20px', width: '80%' }} variant='h6'>
            In publishing and graphic design, Loren ipsum is a placeholder text commonly used to demonstrate visual form of document or typeface without meaningful content.
          </Typography>
          <Button style={{ width: '60%', height: '100px', borderRadius: '50px', marginTop: '40px', marginLeft: '60px', backgroundColor: 'white' }}></Button>
        </Box>
        <img src={magherita} style={{ width: '300px', borderRadius: '100px' }} alt="logo" />
      </Box>

      */}
      <Box style={{ marginTop: '200px', marginLeft: '60px', marginBottom: '30px' }}>
        <Typography variant='h3'>Featured Pizza</Typography>
        <Box style={{ backgroundColor: 'rgb(72,61,139)', width: '90%', height: '300px', display: 'flex' }}>
          <Typography variant='h4' style={{ color: 'white', padding: '20px' }}>
            Make Your First Order and Get 50% Off
            <Button style={{ backgroundColor: 'orange', color: 'white', margin: '60px', width: '30%', height: '60px', fontWeight: 'bold' }}>Order Now</Button>
          </Typography>
          <img src={magherita} style={{ width: '485px' }} alt="" />
        </Box>
      </Box>
      <Box style={{ marginTop: '200px', marginLeft: '60px', marginBottom: '30px' }}>
        <Typography variant='h3'>Top Restaurants</Typography>
        <Button onClick={fetchPizza}>View</Button>
        <Box style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {restaurantName.map((restaurant, index) => (
            <Card key={index} style={{ height: '140px', width: '30%', borderRadius: '20px', margin: '10px' }}>
              <CardMedia style={{ display: 'flex' }}>
                <img src={mame} alt='restaurant' style={{ width: '70px', borderRadius: '20px', height: '40px', margin: '20px' }} />
                <CardHeader title={restaurant.name} />
              </CardMedia>
              <CardContent>
                The best Restaurant in Addis Ababa.
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
      <Box  style={{ marginTop: '200px', marginLeft: '60px', marginBottom: '30px' }}>
        <Typography variant='h3'>Popular Pizzas</Typography>
        <div id='pizzas'></div>
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
                  onClick={() => handleClick(pizza.id)} // Pass the pizza ID correctly
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
            <Link><Typography style={{ fontSize: '30px', fontWeight: 'bold', color: 'black'}}>About Us</Typography></Link>
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
            <Typography style={{ color: 'white' }} variant='h6'>@2024 Pizza All Rights Reserved. Terms and Conditions</Typography>
            <Box style={{ display: 'flex', gap: '15px' }}>
                <FacebookIcon style={{ color: 'white' }} />
                <LinkedInIcon style={{ color: 'white' }} />
                <TwitterIcon style={{ color: 'white' }} />
                <YouTubeIcon style={{ color: 'white' }} />
            </Box>
        </Box>
    </Box>
  );
};export default LoginHome;