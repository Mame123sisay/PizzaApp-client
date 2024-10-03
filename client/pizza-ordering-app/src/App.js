// src/App.js
import React,{useState,useEffect} from 'react';
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
 
    const userRole =localStorage.getItem('userRole');
    console.log(userRole);
   // const abilities = defineAbilitiesFor(userRole); // Define abilities
  console.log(userRole);
    return (
        <AbilityProvider userRole={userRole}> {/* Wrap your app */}
            <Router>
                <Routes>
                    <Route path='/login' element={<LoginForm />} />
                    <Route path='/signup' element={<RegisterRestaurantForm />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/' element={<HomePage />} />
                    <Route path='/customer/signup' element={<RegisterCustomerForm />} />
                    <Route path='/customer/login' element={<CustomerLoginForm />} />
                    <Route path='/order/pizzadetail/:id' element={<PizzaDetailForm />} />
                    <Route path='/loginhome' element={<LoginHome />} />
                    <Route path='/customer/orderdetails' element={<CustomerOrderDetail />} />
                </Routes>
            </Router>
        </AbilityProvider>
    );
}

export default App;