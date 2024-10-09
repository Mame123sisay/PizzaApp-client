import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
} from '@mui/material';
import { MaterialReactTable as MRT } from 'material-react-table';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { z } from 'zod';
import { useAbility } from '../AbilityContext';

const UserManagementForm = () => {
        const apiUrl = process.env.REACT_APP_API_URL;
    const [users, setUsers] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [editingUserId, setEditingUserId] = useState(null);
    const ability = useAbility();

    const restaurant_id = localStorage.getItem('restaurantId');

    const fetchUsers = async () => {
        const response = await axios.get(`${apiUrl}/api/users/${restaurant_id}`);
        setUsers(response.data);
    };

    const fetchRoles = async () => {
        const response = await axios.get(`${apiUrl}/api/roles/restaurant/${restaurant_id}`);
        setRoles(response.data);
    };

    const userSchema = z.object({
        fullName: z.string().min(1, 'Full Name is required'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(4, 'Password must be at least 4 characters long'),
        location: z.string().min(1, 'Location is required'),
        phoneNumber: z.string().min(10, 'Phone Number must be at least 10 digits long'),
        // Uncomment this line if roleId is required
        // roleId: z.string().nonempty('Role is required'),
    });

    const addUser = async () => {
        console.log('Attempting to add user...');
        const userData = {
            fullName,
            email,
            password,
           location,
            phoneNumber,
            restaurant_id,
            roleId,
        };
        console.log('User Data:', userData); // Log the user data
    
        try {
           // userSchema.parse(userData); // Validate before sending
    
            const response = await axios.post(`${apiUrl}/api/users`, userData);
            console.log('Response Data:', response.data); // Log the response data
    
            setUsers((prevUsers) => [...prevUsers, response.data]);
            handleClose();
            resetForm();
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response); // Log the full error response
                console.error('Error data:', error.response.data); // Log the specific error data
                console.error('Error status:', error.response.status); // Log the status code
    
                // Handle validation errors returned from the server
                const serverErrors = error.response.data.error || 'An error occurred';
                setErrors({ server: serverErrors });
            } else if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach(err => {
                    newErrors[err.path[0]] = err.message; // Map error paths to messages
                });
                setErrors(newErrors);
            } else {
                console.error('Unexpected error:', error);
                setErrors({ server: 'An unexpected error occurred' });
            }
        }
    };

    const updateUser = async () => {
        console.log('Attempting to update user...');
        try {
            userSchema.parse({ fullName, email, phoneNumber, location,password, roleId });
            
            await axios.put(`${apiUrl}/api/user/edituser/${editingUserId}`, {
                fullName,
                email,
                phoneNumber,
                location,
                password,
                roleId,
            });
    
            fetchUsers();
            handleClose(); // Close dialog here
            resetForm();
            setErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach(err => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
            } else {
                console.error('Error updating user:', error);
            }
        }
    };

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setPassword('');
        setLocation('');
        setPhoneNumber('');
        setRoleId('');
        setEditingUserId(null);
    };

    const toggleUserStatus = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        await axios.put(`${apiUrl}/api/user/editstatus/${id}`, { is_active: newStatus });
        fetchUsers();
    };

    const deleteUser = async (id) => {
        await axios.delete(`${apiUrl}/api/user/delete/${id}`);
        fetchUsers();
    };

    const handleOpen = (user = null) => {
        setOpen(true);
        if (user) {
            setEditingUserId(user.id);
            setPassword(user.password);
            setFullName(user.full_name);
            setEmail(user.email);
            setPhoneNumber(user.phone_number);
            setLocation(user.location || ''); // Ensure location is set correctly
            setRoleId(user.role_id || ''); // Ensure roleId is set correctly
        } else {
            resetForm();
        }
        setErrors({});
    };
    

    const handleClose = () => {
        setOpen(false);
        resetForm(); // Ensure this is called
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const columns = [
        {
            accessorKey: 'full_name',
            header: 'Name',
            enableSorting: true,
        },
        {
            accessorKey: 'phone_number',
            header: 'Phone No',
            enableSorting: true,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            enableSorting: true,
        },
        {
            accessorKey: 'role_name',
            header: 'Role',
            enableSorting: true,
        },
        {
            accessorKey: 'is_active',
            header: 'Actions',
            Cell: ({ row }) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {ability.can('Edit', 'UserStatus') && (
                        <Button
                            variant="outlined"
                            onClick={() => toggleUserStatus(row.original.id, row.original.is_active)}
                            style={{
                                marginRight: '5px',
                                width: '100px',
                                borderRadius: '20px',
                                border: row.original.is_active ? '1px solid green' : '2px solid red',
                                color: row.original.is_active ? 'green' : 'red',
                            }}
                        >
                            {row.original.is_active ? (
                                <>
                                    <CheckIcon style={{ marginRight: '5px' }} />
                                    Active
                                </>
                            ) : (
                                <>
                                    <CheckIcon style={{ marginRight: '5px' }} />
                                    Inactive
                                </>
                            )}
                        </Button>
                    )}
                    {ability.can('Update', 'users') && (
                        <Button
                            onClick={() => handleOpen(row.original)}
                            startIcon={<EditIcon />}
                            style={{ marginRight: '5px' }}
                        >
                            Edit
                        </Button>
                    )}
                    {ability.can('Delete', 'users') && (
                        <Button
                            onClick={() => deleteUser(row.original.id)}
                            color="error"
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Box padding={2}>
            {ability.can('add', 'User') && (
                <Button
                    style={{ marginLeft: '30px', color: 'white', backgroundColor: 'orange' }}
                    onClick={() => handleOpen()}
                >
                    Add User
                </Button>
            )}
            <MRT
                data={users}
                columns={columns}
                style={{ marginTop: '20px' }}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingUserId ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={(e) => {
                        e.preventDefault(); // Prevent page refresh
                        editingUserId ? updateUser() : addUser(); // Call appropriate function
                    }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Full Name"
                            fullWidth
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                        />
                        <TextField
                            margin="dense"
                            label="Email Address"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            margin="dense"
                            label="Phone Number"
                            fullWidth
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber}
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="role-select-label">Select Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                                error={!!errors.roleId}
                            >
                                {roles.map(role => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.role_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.roleId && <Typography color="error">{errors.roleId}</Typography>}
                        </FormControl>
                        <TextField
                            margin="dense"
                            label="Location"
                            fullWidth
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            error={!!errors.location}
                            helperText={errors.location}
                        />
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                {editingUserId ? 'Update User' : 'Add User'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default UserManagementForm;
