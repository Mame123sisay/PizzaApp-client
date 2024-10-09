import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    FormControl,
    TextField,CircularProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import Close from '@mui/icons-material/Close';
import { MaterialReactTable as MRT } from 'material-react-table';
import axios from 'axios';
import { useAbility } from '../AbilityContext';

const OrdersForm = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);
    const restaurant_id = localStorage.getItem('restaurantId');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedToppings, setSelectedToppings] = useState('');
    const [pizzaName, setPizzaName] = useState('');
    const[loading,setLoading]=useState(true);


    const ability = useAbility();
    const MaybeLoading=({loading})=>{
        return loading ? (<CircularProgress/>): null;

    }


    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/order/${restaurant_id}`, {
                params: {
                    customer_phone: customerPhone,
                    toppings: selectedToppings,
                    pizza_name: pizzaName,
                },
            });
            console.log('Fetched orders:', response.data);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateOrderStatus = async (id, newStatus) => {
        if (ability.can('update', 'OrderStatus')) {
            try {
                await axios.put(`${apiUrl}/api/order/${id}`, { status: newStatus });
                fetchOrders();
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        } else {
            alert('You do not have permission to update this order.');
        }
    };

    const deleteOrder = async (id) => {
        if (ability.can('delete', 'Order')) {
            await axios.delete(`${apiUrl}/api/order/${id}`);
            fetchOrders();
        } else {
            alert('You do not have permission to delete this order.');
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setOrderDetail(null);
    };

    const handleToppingClick = (order) => {
        setOrderDetail(order);
        handleOpen();
    };

    useEffect(() => {
        fetchOrders();
    }, [customerPhone, selectedToppings, pizzaName]);

    const handleFilterChange = () => {
        fetchOrders(); // Fetch orders whenever filters change
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
                    <Visibility /> Toppings
                </Button>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'quantity',
            header: 'Quantity',
            enableSorting: true,
        },
        // Conditional rendering based on ability
        ...(ability.can('view', 'CustomerDetails') ? [{
            accessorKey: 'customer_phone',
            header: 'Customer Phone',
            enableSorting: true,
        }] : []),
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
                        value={row.original.status || ''} // Ensure a default value if status is null
                        onChange={(e) => updateOrderStatus(row.original.id, e.target.value)}
                        disabled={!ability.can('update', 'OrderStatus')} // Disable if no permission
                    >
                        <MenuItem value="prepared" sx={{ color: 'orange' }}>Prepared</MenuItem>
                        <MenuItem value="ready" sx={{ backgroundColor: 'green', color: 'black' }}>Ready</MenuItem>
                        <MenuItem value="delivered" sx={{ color: 'green' }}>Delivered</MenuItem>
                    </Select>
                </FormControl>
            ),
        },
        {
            accessorKey: 'total_price',
            header: 'Total Price',
            enableSorting: true,
            Cell: ({ cell }) => `$${parseFloat(cell.getValue()).toFixed(2)}`,
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <>
                    {ability.can('delete', 'Order') && (
                        <Button 
                            onClick={() => deleteOrder(row.original.id)} 
                            color="secondary" 
                            startIcon
                        >
                            Delete
                        </Button>
                    )}
                    
                </>
            ),
        },
    ];

    return (
        <Box padding={2}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <TextField
                    label="Customer Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    label="Pizza Name"
                    value={pizzaName}
                    onChange={(e) => setPizzaName(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    label="Toppings (comma-separated)"
                    value={selectedToppings}
                    onChange={(e) => setSelectedToppings(e.target.value)} // Enable input for toppings
                    variant="outlined"
                />
                <Button variant="contained" color="primary" onClick={handleFilterChange}>
                    Filter
                </Button>
            </Box>
            <MRT
                data={orders}
                columns={columns}
                style={{ marginTop: '20px' }}
                
            />
             <MaybeLoading loading={loading}/>
            


            {/* Modal for Order Details */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Order Details
                    <Button onClick={handleClose} color="primary" style={{ marginLeft: '200px',border:'2px solid black',borderRadius:'120%' }}>
                        <Close />
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
                <DialogActions />
            </Dialog> 
        </Box>
    );
};

export default OrdersForm;