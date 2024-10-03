// src/RoleManagement.js
import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Box,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { MaterialReactTable as MRT } from 'material-react-table';
import axios from 'axios';
import { useAbility } from '../AbilityContext';
import { z } from 'zod';

const permissionsList = [
    { id: 1, label: 'Update Order Status' },
    { id: 2, label: 'See Orders' },
    { id: 3, label: 'See Customers' },
    { id: 4, label: 'Add User' },
    { id: 5, label: 'Create Roles' },
];

const RoleManagement = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [roles, setRoles] = useState([]);
    const [roleName, setRoleName] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState({});
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const restaurant_id = localStorage.getItem('restaurantId');
    const ability = useAbility();

    const roleSchema = z.object({
        roleName: z.string().min(1, 'Role Name is required'),
        permissions: z.array(z.string()).nonempty('At least one permission must be selected'),
    });

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/roles/restaurant/${restaurant_id}`);
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleOpen = (role) => {
        setOpen(true);
        if (role) {
            setEditingRoleId(role.id);
            setRoleName(role.role_name);

            const permissionsMap = {};
            permissionsList.forEach(permission => {
                const isChecked = role.permissions.includes(permission.label);
                permissionsMap[permission.label] = isChecked;
            });
            setSelectedPermissions(permissionsMap);
        } else {
            resetForm();
        }
    };

    const resetForm = () => {
        setRoleName('');
        setSelectedPermissions({});
        setEditingRoleId(null);
        setErrors({});
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const addRole = async () => {
        try {
            setLoading(true);
            if (ability.can('add', 'role')) {
                const permissions = Object.keys(selectedPermissions).filter(key => selectedPermissions[key]);
                roleSchema.parse({ roleName, permissions });

                const response = await axios.post(`${apiUrl}/api/roles`, {
                    role_name: roleName,
                    restaurant_id: parseInt(restaurant_id),
                    permissions: permissions.map(label => permissionsList.find(p => p.label === label).id),
                });

                setRoles([...roles, response.data]);
                handleClose();
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async () => {
        try {
            setLoading(true);
            const permissions = Object.keys(selectedPermissions).filter(key => selectedPermissions[key]);

            const response = await axios.put(`${apiUrl}/api/roles/${editingRoleId}`, {
                role_name: roleName,
                permissions: permissions.map(label => permissionsList.find(p => p.label === label).id), // Send IDs
            });

            setRoles(roles.map(role => (role.id === editingRoleId ? response.data : role)));
            handleClose();
        } catch (error) {
            console.error('Error updating role:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error) => {
        if (error instanceof z.ZodError) {
            const newErrors = {};
            error.errors.forEach(err => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);
        } else if (error.response) {
            setErrors({ server: error.response.data.message });
        } else {
            console.error('An unexpected error occurred:', error);
        }
    };

    const deleteRole = async (id) => {
        if (ability.can('delete', 'role')) {
            try {
                await axios.delete(`${apiUrl}/api/roles/${id}`);
                fetchRoles();
            } catch (error) {
                console.error('Error deleting role:', error);
            }
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <Box padding={2}>
            <Button
                style={{ marginLeft: '30px', color: 'white', backgroundColor: 'orange' }}
                onClick={() => handleOpen()} // Open dialog for adding new role
            >
                Add Role
            </Button>
            <MRT
                data={roles.map(role => ({
                    ...role,
                    permissions: role.permissions.join(', '), // Display permissions as a string
                }))}
                columns={[
                    { accessorKey: 'role_name', header: 'Role Name' },
                    { accessorKey: 'permissions', header: 'Permissions' },
                    { accessorKey: 'created_at', header: 'Created At', Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString() },
                    {
                        header: 'Actions',
                        Cell: ({ row }) => (
                            <div>
                                <Button onClick={() => handleOpen(row.original)}>Edit</Button>
                                <Button onClick={() => deleteRole(row.original.id)} color="error">Delete</Button>
                            </div>
                        ),
                    },
                ]}
            />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingRoleId ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Role Name"
                        fullWidth
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        error={!!errors.roleName}
                        helperText={errors.roleName}
                    />
                    <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
                        Select Permissions:
                    </Typography>
                    {permissionsList.map((permission) => (
                        <FormControlLabel
                            key={permission.id}
                            control={
                                <Checkbox
                                    checked={!!selectedPermissions[permission.label]}
                                    onChange={(e) =>
                                        setSelectedPermissions({
                                            ...selectedPermissions,
                                            [permission.label]: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label={permission.label}
                        />
                    ))}
                    {errors.server && (
                        <Typography color="error" variant="body2">
                            {errors.server}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={editingRoleId ? updateRole : addRole} color="primary" disabled={loading}>
                        {loading ? 'Loading...' : (editingRoleId ? 'Update Role' : 'Add Role')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RoleManagement;