import React, { createContext, useContext } from 'react';
import { defineAbilitiesFor } from './abilities';

const AbilityContext = createContext();

export const AbilityProvider = ({ userRole, children }) => {
    console.log('User role:', userRole); // Log the user role
    const ability = defineAbilitiesFor(userRole);
    console.log('Defined abilities:', ability.rules); // Log defined abilities

    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    );
};

export const useAbility = () => {
    return useContext(AbilityContext);
};