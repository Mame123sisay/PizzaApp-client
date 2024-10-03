// src/roles.js
export const roles = {
  RESTAURANTMANAGER: 'restaurantmanager',
  CASHIER: 'cashier',
  KICHINMANAGER: 'kichinmanager',
  // Add more roles as needed
};

export const permissions = {
  [roles.RESTAURANTMANAGER]: {
      canViewOrders: true,
      canUpdateOrders: true,
      canAddMenus: true,
      canAddToppings: true,
      canUpdatePizzas: true,
  },
  [roles.KICHINMANAGER]: {
      canViewOrders: false,
      canUpdateOrders: false,
      canAddMenus: false,
      canAddToppings: false,
      canUpdatePizzas: false,
  },
  [roles.CASHIER]: {
    canViewOrders:false,
    canUpdateOrders: false,
    canAddMenus: false,
    canAddToppings: false,
    canUpdatePizzas: false,
},
  // Add more roles and permissions as needed
};