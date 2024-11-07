import React, { createContext, useState } from 'react';

// Crear el contexto
export const MyContext = createContext(null);
//provider
export const MyProvider = ({ children }) => {
    const [state, setState] = useState('Valor inicial');

    return (
        <MyContext.Provider value={{ state, setState }}>
            {children}
        </MyContext.Provider>
    );
};