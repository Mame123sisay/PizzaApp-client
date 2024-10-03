import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Checkbox, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const PizzaDetailForm = ({ customer_id }) => { // Pass customerId as a prop
  const apiUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams(); // Get pizza ID from URL
  const [pizza, setPizza] = useState(null);
  const [toppings, setToppings] = useState({}); // To store quantity for each topping
  const [quantity, setQuantity] = useState(1); // Default pizza quantity
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [orderConfirmed, setOrderConfirmed] = useState(false); // State to check if order is confirmed
const navigate=useNavigate();
  useEffect(() => {
    const fetchPizzaDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pizza/${id}`);
        setPizza(response.data);

        // Initialize toppings state if topping_ids exists
        if (response.data.topping_ids) {
          const initialToppings = {};
          response.data.topping_ids.forEach((toppingId) => {
            initialToppings[toppingId] = 1; // Default quantity is 1 (checked)
          });
          setToppings(initialToppings);
        }
      } catch (error) {
        console.error('Error fetching pizza details:', error);
      }
    };

    fetchPizzaDetails();
  }, [id]); // Run when ID changes

  if (!pizza) return <Typography variant="h6">Loading...</Typography>;

  // Calculate total price based on pizza price and quantity
  const totalPrice = parseInt(pizza.price, 10) * quantity;

  const handleOrder = async () => {
    const selectedToppings = Object.keys(toppings).filter((toppingId) => toppings[toppingId] > 0);
  const customerId=localStorage.getItem('userId');
    // Create order object
    const orderData = {
      customerId,
      toppings: selectedToppings,
      totalPrice,
      status: 'prepared', // Initial status
      quantity,
      pizzaName: pizza.pizza_name,
      restaurant_id:pizza.restaurant_id,
    };

    try {
      await axios.post('http://localhost:5000/api/order', orderData);
      setOrderConfirmed(true); // Set order confirmed
    } catch (error) {
      console.error('Error placing order:', error);
    }

    setOpenModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  return (
    <Box sx={{ backgroundColor: 'white', padding: 2, height: '1000px' }}>
      <Box sx={{ display: 'flex', paddingTop: '60px' }}>
        <Box
          component="img"
          src={`http://localhost:5000${pizza.image_path}`}
          alt={pizza.pizza_name}
          sx={{ width: '100%', maxWidth: 400, mb: 2, ml: 3, borderRadius: '20px' }}
        />
       
        <Box sx={{ marginLeft: '200px', flexGrow: 1 }}>
          <Typography variant='h2'>{pizza.pizza_name}</Typography>
          <Typography>{pizza.restaurant_id}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <IconButton 
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              aria-label="decrease quantity"
              sx={{ backgroundColor: 'white', width: '70px', borderRadius: '10px', height: '60px', border: '2px solid orange' }} 
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="h5" sx={{ mx: 2 }}>{quantity}</Typography>
            <IconButton 
              sx={{ backgroundColor: 'white', width: '70px', borderRadius: '10px', height: '60px', border: '2px solid orange', mr: 2 }} 
              onClick={() => setQuantity(quantity + 1)} 
              aria-label="increase quantity"
            >
              <AddIcon />
            </IconButton>
            <Typography sx={{ color: 'rgb(50,205,50)', fontWeight: 'green', fontSize: '40px' }} variant="h6">{totalPrice} Birr</Typography>
            <Button
            sx={{ backgroundColor: 'blue', color: 'white', width: '200px',marginLeft:'20px', height: '70px', fontSize: '20px', fontWeight: 'bold', }}
            onClick={()=>navigate('/loginhome ')}
          >
            Continue to Ordering 
          </Button>
          <Button
            sx={{ backgroundColor: 'orange', color: 'white', width: '200px',marginLeft:'20px', height: '70px', fontSize: '20px', fontWeight: 'bold', }}
            onClick={()=>navigate('/customer/orderdetails ')}
          >
            Go to Order Details 
          </Button>
          </Box>

          {pizza.topping_ids.map((toppingId, index) => (
            <Box key={toppingId} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Checkbox
                checked={toppings[toppingId] > 0}
                onChange={(e) => {
                  const newQuantity = e.target.checked ? 1 : 0;
                  setToppings((prev) => ({
                    ...prev,
                    [toppingId]: newQuantity,
                  }));
                }}
                sx={{ color: 'orange', '&.Mui-checked': { color: 'orange' } }} // Change checkbox color to orange
              />
              <Typography>
                {pizza.toppings[index]} 
              </Typography>
            </Box>
          ))}
  <Box>
          <Button
            sx={{ backgroundColor: 'orange', color: 'white', width: '300px', height: '70px', fontSize: '20px', fontWeight: 'bold' }}
            onClick={handleOrder}
          >
            Order 
          </Button></Box>
         
          

          {/* Modal for order confirmation */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Order Confirmation</DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '30px', color: 'green' }}>
                {orderConfirmed 
                  ? 'Your order has been successfully completed!' 
                  : 'Placing your order...'
                }
              </Typography>
              <CheckCircleIcon sx={{ color: 'green', fontSize: '40px', marginTop: 2 }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default PizzaDetailForm;