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

  


  const handleLogout = () => {
    localStorage.removeItem('userId');
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
      <Box style={{ display: 'flex', justifyContent: 'space-between', padding: '20px',flexWrap:'wrap' }}>
        <Box style={{ display: 'flex' }}>
          <img src={logo} style={{ width: '50px', marginRight: '10px' }} alt='' />
          <Typography variant='h4' style={{ color: 'rgb(222, 120, 12)' }}>Pizza</Typography>
        </Box>
       
       
        <Typography style={styleText}>Cart</Typography>
        <Typography style={styleText}>{localStorage.getItem('userName')}</Typography>
      <a  onClick={()=>navigate('/customer/orderdetails')}> <Typography variant='' style={styleText}> your Order Details</Typography></a> 
       <a href="#pizzas"> <Typography style={styleText}>Pizzas</Typography></a>
        <Button
          style={{ backgroundColor: 'orange', color: 'white', width: '100px' }}
          onClick={handleLogout}
        >
          logout
        </Button>
       
      </Box>
      <Box style={{ height: '600px', display: 'flex',flexWrap:'wrap',position:'relative' }}>
        <Box sx={{display:'flex',maxWidth:'100%'}}>
        <Box sx={{marginLeft: '60px',maxWidth:'70%',maxHeight:'600px'}}>
        <Typography id="home" variant='h1' style={{ color: 'orange', fontWeight: 'bold',  marginTop: '80px' }}>Order Us</Typography>
<Typography style={{  fontSize: '30px', fontFamily: 'Arial', fontWeight: 'normal',flex:'1', // Prevents text from wrapping
    
     }} variant='h6'>
    Our aim is to provide a seamless online pizza ordering experience, allowing you to enjoy your favorite pizzas with just a few clicks. Browse our delicious menu, customize your order,Love our Products...
</Typography>
<Box sx={{ position: 'absolute' }}>
            <input
                style={{
                    width: '85%',
                    height: '100px',
                    borderRadius: '50px',
                    marginTop: '30px',
                  
                    
                    backgroundColor: 'white',
                    borderWidth: 'none',
                    paddingLeft: '60px', // Adjust padding to fit the icon
                    fontSize: '30px',
                    border:'none',
                    outline: 'none',
                    position: 'relative'
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
                    left: '325px', 
                    top: '30%', 
                        }}
            >
                <SearchIcon style={{ color: 'white', margin: '20px',fontSize:'60px' }} />
            </div>
        </Box>
          </Box>
          <img src={magherita} style={{ width: '300px', borderRadius: '100px',height:'200px',marginTop:'200px' }} alt="logo" />
    
        </Box>
      </Box>
      <Box style={{ marginTop: '400px', marginLeft: '60px', marginBottom: '50px' }}>
        <Typography sx={{color:'gray'}} variant='h3'>Featured Pizza</Typography>
       <SlidingComponent/>
      </Box>
      <Box style={{ marginTop: '200px', marginLeft: '60px', marginBottom: '30px' }}>
        <Typography sx={{color:'gray'}}  variant='h3'>Top Restaurants</Typography>
        
        <Box style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {restaurantName.map((restaurant, index) => (
            <Card key={index} style={{ height: '140px', width: '80%', borderRadius: '20px', margin: '10px',maxWidth:'400px' }}>
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
             <Card key={pizza.id} style={{ height: '600px', width: '80%',maxWidth:'400px', borderRadius: '20px', margin: '10px' }}>
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
      <Box sx={{ backgroundColor: 'rgb(222,184,135)', marginTop: '350px', maxHeight: '250px' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '40px',flexWrap:'wrap' }}>
        <Box sx={{ display: 'flex', paddingBottom: '40px' }}>
            <Link><Typography sx={{ fontSize: '30px', fontWeight: 'bold', color: 'black', marginRight: '20px' }}>Home</Typography></Link>
            <Link><Typography sx={{ fontSize: '30px', fontWeight: 'bold', color: 'black', marginRight: '20px' }}>Orders</Typography></Link>
            <Link><Typography sx={{ fontSize: '30px', fontWeight: 'bold', color: 'black'}}>About Us</Typography></Link>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '40px', marginLeft: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px',maxHeight:'200px' }}>
                <img src={logo} style={{ width: '80px', height: '50px', paddingLeft: '40px' }} alt='' />
                <Typography variant='h4' sx={{ color: 'rgb(222, 120, 12)', marginLeft: '30px' }}>Pizza</Typography>
            </Box>
            <input
                style={{
                    width: '120%',
                    height: '40px',
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
<Box style={{ backgroundColor: 'black', height:'200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px',flexWrap:'wrap' }}>
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