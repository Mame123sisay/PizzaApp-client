// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Typography,
    Button
} from '@mui/material';
import {
    List as OrdersIcon,
    AddBox as AddMenuIcon,
    People as UsersIcon,
    Security as RolesIcon
} from '@mui/icons-material';
import logo from './pizza.png';
import { useAbility } from '../AbilityContext';
import { useNavigate } from 'react-router-dom';
import OrdersForm from './OrdersForm';
import AddPizza from './AddPizza';
import RoleManagement from './RoleManagement';
import UserManagementForm from './UserManagementForm';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Dashboard = () => {
   
    const role=localStorage.getItem('userRole');

    const ability = useAbility();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Orders');

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleLogout = () => {
        localStorage.removeItem('restaurantId');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const getItemStyle = (section) => ({
        cursor: 'pointer',
        backgroundColor: activeSection === section ? 'orange' : 'transparent',
        '&:hover': {
            backgroundColor: '#f0f0f0',
        },
    });

    const checkAbilities = () => {
        // Log abilities in a more detailed way
        console.log('Can view Order:', ability.can('view', 'Order'));
        console.log('Can manage Pizza:', ability.can('manage', 'Pizza'));
        console.log('Can view Role:', ability.can('view', 'Role'));
        console.log('Can view User:', ability.can('view', 'User'));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
                    <img src={logo} alt="Logo" style={{ width: '50px' }} />
                    <Typography variant="h6" sx={{ marginLeft: 1 }}>Dashboard</Typography>
                </Box>
                <List>
                    {ability.can('view', 'Order') && (
                        <ListItem button onClick={() => handleSectionChange('Orders')} style={getItemStyle('Orders')}>
                            <ListItemIcon><OrdersIcon /></ListItemIcon>
                            <ListItemText primary="Orders" />
                        </ListItem>
                    )}
                    {ability.can('manage', 'Pizza') && (
                        <ListItem button onClick={() => handleSectionChange('Add Menu')} style={getItemStyle('Add Menu')}>
                            <ListItemIcon><AddMenuIcon /></ListItemIcon>
                            <ListItemText primary="Add Menu" />
                        </ListItem>
                    )}
                    {ability.can('view', 'Role') && (
                        <ListItem button onClick={() => handleSectionChange('Roles')} style={getItemStyle('Roles')}>
                            <ListItemIcon><RolesIcon /></ListItemIcon>
                            <ListItemText primary="Roles" />
                        </ListItem>
                    )}
                    {ability.can('view', 'User') && (
                        <ListItem button onClick={() => handleSectionChange('Users')} style={getItemStyle('Users')}>
                            <ListItemIcon><UsersIcon /></ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                    )}
                </List>
                <Button onClick={handleLogout} variant="" sx={{color:'red',fontWeight:'bold'}} fullWidth>
                <ExitToAppIcon /> Logout
                </Button>
              
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <AppBar position="static" sx={{ backgroundColor: "white" }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ color: 'black' }}>
                           
                            {activeSection}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box mt={2}>
                    {activeSection === 'Orders' && ability.can('view', 'Order') && <OrdersForm />}
                    {activeSection === 'Add Menu' && ability.can('manage', 'Pizza') && <AddPizza />}
                    {activeSection === 'Roles' && ability.can('view', 'Role') && <RoleManagement />}
                    {activeSection === 'Users' && ability.can('view', 'User') && <UserManagementForm />}
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;