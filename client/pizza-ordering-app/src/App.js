// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import RegisterRestaurantForm from './components/RegisterRestaurantForm';
import Dashboard from './components/Dashboard';
import { HomePage } from './components/HomePage';
import RegisterCustomerForm from './components/RegisterCustomerForm';
import CustomerLoginForm from './components/customerLoginform';
import PizzaDetailForm from './components/PizzaDetailForm';
import LoginHome from './components/LoginHome';
import CustomerOrderDetail from './components/CustomerOrderDetail';
import { defineAbilitiesFor } from './abilities';
import { AbilityProvider } from './AbilityContext';

function App() {
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

    const handleLogin = (role) => {
        // Update the user role and set it in local storage
        setUserRole(role);
        localStorage.setItem('userRole', role);
    };

    return (
        <Router>
            <Routes>
                <Route path='/login' element={<LoginForm onLogin={handleLogin} />} />
                <Route path='/signup' element={<RegisterRestaurantForm />} />
                <Route path='/' element={<HomePage />} />
                <Route path='/customer/signup' element={<RegisterCustomerForm />} />
                <Route path='/customer/login' element={<CustomerLoginForm onLogin={handleLogin} />} />
                <Route path='/order/pizzadetail/:id' element={<PizzaDetailForm />} />
                <Route path='/loginhome' element={<LoginHome />} />
                <Route path='/customer/orderdetails' element={<CustomerOrderDetail />} />
                
                {/* Wrap only the Dashboard in AbilityProvider */}
                <Route 
                    path='/dashboard' 
                    element={
                        <AbilityProvider userRole={userRole}>
                            <Dashboard />
                        </AbilityProvider>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;