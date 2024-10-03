import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography,Button,FormControl,Select,MenuItem,DialogContent,DialogTitle,DialogActions,Dialog } from '@mui/material';
import { MaterialReactTable as MRT } from 'material-react-table';
import Visibility from '@mui/icons-material/Visibility';
import Close from '@mui/icons-material/Close';
import { useNavigate} from 'react-router-dom';
const CustomerOrderDetail = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [customerOrderDetail, setCustomerOrderDetail] = useState([]);
    const [open, setOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);
  
    const customer_id = localStorage.getItem('userId');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/orderdetail/${customer_id}`);
                setCustomerOrderDetail(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [customer_id]);

    const handleOpen = () => {
      setOpen(true);
  };
const navigate=useNavigate();
  const handleClose = () => {
      setOpen(false);
      setOrderDetail(null);
  };
  const updateOrderStatus=()=>{

  }

  const handleToppingClick = (order) => {
      setOrderDetail(order);
      handleOpen();
  };



  const columns = [
      {
          accessorKey: 'pizza_name',
          header: 'Pizza Name',
          enableSorting: true,
      },
      {
          accessorKey: 'toppings',
          header: 'Toppings',
          Cell: ({ cell }) => (
              <Button 
                  onClick={() => handleToppingClick(cell.row.original)} 
                  style={{ textDecoration: 'underline', color: 'orange' }}
              >
                  <Visibility sx={{}}/>Toppings
                  
              </Button>
          ),
          enableSorting: true,
      },
      {
          accessorKey: 'quantity',
          header: 'Quantity',
          enableSorting: true,
      },
      {
        accessorKey: 'total_price',
        header: 'Total Price',
        enableSorting: true,
        Cell: ({ cell }) => `$${parseFloat(cell.getValue()).toFixed(2)}`,
    },
     
      {
          accessorKey: 'created_at',
          header: 'Created At',
          enableSorting: true,
          Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
      },
      {
          accessorKey: 'status',
          header: 'Status',
          Cell: ({ row }) => (
              <FormControl variant="outlined" style={{ minWidth: 120 }}>
                  <Select
                      value={row.original.status || ''  } // Ensure a default value if status is null
                      onChange={(e) => updateOrderStatus(row.original.id, e.target.value)}
                  >
                      <MenuItem value="prepared" sx={{ color:'orange' }}>Prepared</MenuItem>
                     
                  </Select>
              </FormControl>
          ),
      },
    
     
  ];

  return (
    <Box sx={{backgroundColor:'gray',padding: 2, height: '1000px'}}>
      <Box>
        <Typography  sx={{textAlign:'center',mt:6}} variant='h3'>All Order Details</Typography>
       
      </Box>
      <Button onClick={()=>navigate('/loginhome')} sx={{backgroundColor:'orange',color:'white',fontSize:'20px'}}>Continue Ordering</Button>
        <Box padding={2} sx={{mt:5}}>
          <MRT
              data={customerOrderDetail}
              columns={columns}
              style={{ marginTop: '20px' }}
          />

          {/* Modal for Order Details */}
          <Dialog open={open} onClose={handleClose} sx={{ borderRadius:'10px'}}>
              <DialogTitle sx={{fontSize:'20px',fontWeight:'bold',marginLeft:'70px'}}> Your Order Details
              <Button style={{paddingLeft:'150px'}} onClick={handleClose} color="primary">
                      <Close sx={{border:'2px solid black',color:'black',borderRadius:'30px'}}/>
                  </Button>
              
              </DialogTitle> 
              <DialogContent>
                  {orderDetail && (
                      <>
                          <Typography style={{color:'gray',fontSize:'18px'}} variant="h6">Pizza Name:   <Typography style={{color:'black',fontWeight:'bold',display:'inline-block',fontSize:'20px'}}> {orderDetail.pizza_name}</Typography> </Typography>
                        
                          <Typography variant="subtitle1">Toppings:
                            <Typography style={{color:'black',fontWeight:'bold',display:'inline-block',fontSize:'20px',backgroundColor:'orange',color:'red',borderRadius:'5px'}}> {orderDetail.toppings.join(', ')}</Typography>
                          </Typography>
                        
                          <Typography variant="subtitle1">Quantity:   <Typography style={{color:'green',fontWeight:'bold',display:'inline-block',fontSize:'20px'}}>{orderDetail.quantity}</Typography> </Typography>

                          <Typography variant="subtitle1">Customer Phone:<Typography style={{color:'black',fontWeight:'bold',display:'inline-block',fontSize:'20px'}}>{orderDetail.customer_phone}</Typography> </Typography>
                          <Typography variant="subtitle1">Created At: {new Date(orderDetail.created_at).toLocaleString()}</Typography>
                          <Typography variant="subtitle1">Total Price: <Typography style={{color:'green',fontWeight:'bold',display:'inline-block',fontSize:'20px'}}>${parseFloat(orderDetail.total_price).toFixed(2)}</Typography> </Typography>
                      </>
                  )}
              </DialogContent>
              <DialogActions>
                 
              </DialogActions>
          </Dialog>
      </Box>
      
    </Box>
    
  );
};

export default CustomerOrderDetail;