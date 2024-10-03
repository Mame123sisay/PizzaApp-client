// src/abilities.js
import { createMongoAbility } from '@casl/ability';

// Define abilities based on role
export const defineAbilitiesFor = (role) => {
    const rules = [];
    if(role==='SUPERADMIN') {
        rules.push({action:'add',subject:'User'});// super admin can add users
        rules.push({ action: 'manage', subject: 'Pizza' }); // Restaurant Managers can 
        rules.push({ action: 'view', subject: 'Role' }); // admin can view roles
       rules.push({ action: 'Edit', subject: 'UserStatus'}) // admin can edit users status
       rules.push({ action: 'Delete', subject: 'users'}) // admin can delete users 
       rules.push({ action: 'Update', subject: 'users'}) // admin can update users
        rules.push({ action: 'view', subject: 'User' }); // admin can view users
         rules.push({ action: 'add', subject: 'role' }); // admin can add roles
         rules.push({ action: 'Update', subject: 'role' }); // admin can edit add roles
         rules.push({ action: 'delete', subject: 'role' }); // admin can delete role
         rules.push({ action: 'manage', subject: 'Toppings' }); //  admin can manage toppings 
         rules.push({ action: 'view', subject: 'Order' });
         rules.push({ action: 'view', subject: 'CustomerDetails' });
         rules.push({action:'delete',subject:'Order'});
         rules.push({ action: 'update', subject: 'OrderStatus' }); // Restaurant Managers 
        }

    if (role === 'CUSTOMER') {
        rules.push({ action: 'browse', subject: 'Pizza' }); // Customers can browse pizzas
        rules.push({ action: 'order', subject: 'Pizza' }); // Customers can order pizzas
        rules.push({ action: 'view', subject: 'OrderHistory' }); // Customers can view their order history
    }

    if (role === 'RESTAURANTMANAGER') {
        rules.push({ action: 'manage', subject: 'Pizza' }); // Restaurant Managers can add/manage pizzas
        rules.push({ action: 'view', subject: 'Order' }); // Restaurant Managers can view all orders
        rules.push({ action: 'update', subject: 'OrderStatus' }); // Restaurant Managers can update order status
       rules.push({ action: 'manage', subject: 'Toppings' });
       rules.push({ action: 'view', subject: 'CustomerDetails' });
    }
    if(role==='KITCHINMANAGER'){
        rules.push({ action: 'view', subject: 'Order' }); // kitchn Managers can view all orders
        rules.push({ action: 'update', subject: 'OrderStatus' }); // Kitchn Managers see status of order 
    }

    return createMongoAbility(rules);
};