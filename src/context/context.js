/* eslint-disable react/prop-types */
import React, { useReducer, createContext } from "react";

const initialState = [];

export const ExpenseTrackerContext = createContext(initialState);

export const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ExpenseTrackerContext.Provider value={{ appName: "Expense Tracker" }}>
            {children}
        </ExpenseTrackerContext.Provider>
    );
};
