import React, { useEffect, useState } from 'react';
import {
    Checkbox,
    FormControlLabel,
    Button,
    TextField,
    Grid,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box
} from '@mui/material';
import { MaterialReactTable as MRT } from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAbility } from '../AbilityContext';

const AddPizza = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const restaurant_id = localStorage.getItem('restaurantId');
    const [pizzaName, setPizzaName] = useState('');
    const [price, setPrice] = useState('');
    const [availableToppings, setAvailableToppings] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newToppingName, setNewToppingName] = useState('');
    const [pizzaData, setPizzaData] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentPizza, setCurrentPizza] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const ability = useAbility();
   
    const fetchPizza = async () => {
        const response = await axios.get(`${apiUrl}/api/pizzas/${restaurant_id}`);
        setPizzaData(response.data);
        console.log(response.data);
    };

    const fetchToppings = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/toppings/${restaurant_id}`);
            setAvailableToppings(response.data);
        } catch (error) {
            console.error('Error fetching toppings:', error);
        }
    };

    useEffect(() => {
        fetchToppings();
        fetchPizza();
    }, []);

    const handleToppingChange = (toppingId) => {
        setSelectedToppings((prev) => {
            if (prev.includes(toppingId)) {
                return prev.filter((id) => id !== toppingId);
            } else {
                return [...prev, toppingId];
            }
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file); // Store the selected file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('pizzaName', pizzaName);
        formData.append('price', price);
        formData.append('toppings', JSON.stringify(selectedToppings));

        try {
            const response = await axios.post(`${apiUrl}/api/menu/addpizza/${restaurant_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Pizza added:', response.data);

            const newPizza = {
                id: response.data.id,
                name: pizzaName,
                price: price,
                image_path: response.data.imagePath,
                toppings: selectedToppings.map(toppingId =>
                    availableToppings.find(topping => topping.id === toppingId)?.name
                ).filter(Boolean),
                is_available: true,
            };

            setPizzaData((prev) => [...prev, newPizza]);
            setPizzaName('');
            setPrice('');
            setSelectedToppings([]);
            setImageFile(null);
        } catch (error) {
            console.log('Error adding pizza:', error);
        }
    };

    const handleEditPizza = async () => {
        try {
            const response = await axios.put(`${apiUrl}/api/menu/updatepizza/${currentPizza.id}`, {
                pizzaName,
                price,
                toppings: selectedToppings.filter(Boolean)
            });
            console.log('Pizza updated:', response.data);
            fetchPizza(); // Refresh pizza list
            setEditDialogOpen(false);
            setCurrentPizza(null);
            setPizzaName('');
            setPrice('');
            setSelectedToppings([]);
        } catch (error) {
            console.log('Error updating pizza:', error);
        }
    };

    const handleOpenEditDialog = (pizza) => {
        setCurrentPizza(pizza);
        setPizzaName(pizza.name);
        setPrice(pizza.price);
        setSelectedToppings(pizza.toppings.map(t => t.id));
        setEditDialogOpen(true);
    };

    const handleAddTopping = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/toppings`, {
                newToppingName,
                restaurant_id,
            });
            setAvailableToppings((prev) => [...prev, response.data]);
            setNewToppingName('');
            setDialogOpen(false);
        } catch (error) {
            console.error('Error adding topping:', error);
        }
    };

    const deletePizza = async (pizzaId) => {
        try {
            await axios.delete(`${apiUrl}/api/menu/deletepizza/${pizzaId}`);
            setPizzaData((prev) => prev.filter((pizza) => pizza.id !== pizzaId));
        } catch (error) {
            console.error('Error deleting pizza:', error);
        }
    };

    const columns = [
        {
            accessorKey: 'name',
            header: 'Pizza Name',
            enableSorting: true,
            enableFiltering: false,
            Cell: ({ row }) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row.original.image_path && (
                        <img
                            src={`${apiUrl}${row.original.image_path}`}
                            alt={row.original.name}
                            style={{ width: '40px', height: '40px', borderRadius: '4px', marginRight: '10px' }}
                        />
                    )}
                    <span>{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: 'toppings',
            header: 'Toppings',
            Cell: ({ row }) => row.original.toppings.join(', '),
        },
        {
            accessorKey: 'price',
            header: 'Price',
        },
        {
            accessorKey: 'is_available',
            header: 'Status',
            Cell: ({ row }) => (
                <Button
                    variant="outlined"
                    style={{
                        borderRadius: '20px',
                        color: row.original.is_available ? 'green' : 'red',
                    }}
                >
                    {row.original.is_available ? 'Available' : 'Unavailable'}
                </Button>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {ability.can('update', 'Pizza') && (
                        <Button
                            onClick={() => handleOpenEditDialog(row.original)}
                            startIcon={<EditIcon />}
                            style={{ marginRight: '5px' }}
                        >
                            Edit
                        </Button>
                    )}
                    {ability.can('delete', 'Pizza') && (
                        <Button
                            onClick={() => deletePizza(row.original.id)}
                            startIcon={<DeleteIcon />}
                            color="secondary"
                        >
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', margin: '60px' }}>
            <Box>
                {ability.can('create', 'Pizza') && (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            style={{ width: '400px' }}
                            label="Pizza Name"
                            value={pizzaName}
                            onChange={(e) => setPizzaName(e.target.value)}
                            required
                        />
                        <Typography variant='h6'>Toppings</Typography>
                        <Grid container spacing={0}>
                            {availableToppings.map((topping) => (
                                <Grid item xs={3} key={topping.id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedToppings.includes(topping.id)}
                                                onChange={() => handleToppingChange(topping.id)}
                                            />
                                        }
                                        label={topping.name}
                                    />
                                </Grid>
                            ))}
                            <Button
                                style={{ backgroundColor: 'orange', color: 'white' }}
                                onClick={() => setDialogOpen(true)}
                            >
                                Add Topping
                            </Button>
                        </Grid>
                        <TextField
                            style={{ width: '400px', marginTop: '20px' }}
                            label="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
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
                            border: '2px solid black',
                        }}>
                            Upload Pizza Photo
                        </label>
                        {imageFile && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Image Preview"
                                    style={{ width: '10%', height: 'auto', marginTop: '10px' }}
                                />
                                <Typography variant="body2" style={{ marginTop: '5px' }}>
                                    {imageFile.name}
                                </Typography>
                            </div>
                        )}
                        <Button
                            style={{ backgroundColor: 'orange', color: 'white', width: '200px', marginTop: '30px', height: '50px', borderRadius: '4px' }}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </form>
                )}
                
                {/* Dialog for Adding Topping */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Add New Topping</DialogTitle>
                    <DialogContent>
                        
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Topping Name"
                            fullWidth
                            value={newToppingName}
                            onChange={(e) => setNewToppingName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddTopping}>Add Topping</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog for Editing Pizza */}
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                    <DialogTitle>Edit Pizza</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Pizza Name"
                            fullWidth
                            value={pizzaName}
                            onChange={(e) => setPizzaName(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Price"
                            fullWidth
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <Typography variant='h6'>Toppings</Typography>
                        <Grid container spacing={0}>
                            {availableToppings.map((topping) => (
                                <Grid item xs={3} key={topping.id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedToppings.includes(topping.id)}
                                                onChange={() => handleToppingChange(topping.id)}
                                            />
                                        }
                                        label={topping.name}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditPizza}>Save Changes</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box style={{ marginTop: '50px', width: '100%' }}>
                <Typography variant='h4'>Pizzas Detail</Typography>
                <MRT
                    data={pizzaData}
                    columns={columns}
                    style={{ marginTop: '20px' }}
                />
            </Box>
        </Box>
    );
};

export default AddPizza;