/* eslint-disable no-undef */
import React, { useState, useContext, useEffect } from "react";
import {
    TextField,
    Typography,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@material-ui/core";
import { ExpenseTrackerContext } from "../../../context/context";
import { v4 as uuidv4 } from "uuid";
import { incomeCategories, expenseCategories } from "../../../constants/categories";
import { useSpeechContext } from "@speechly/react-client";
import formatDate from "../../../utils/formatDate";
import useStyles from "./styles";

const initialState = {
    amount: "",
    category: "",
    type: "Income",
    date: formatDate(new Date())
};

const Form = () => {
    const classes = useStyles();
    const [formData, setFOrmData] = useState(initialState);
    const { addTransaction } = useContext(ExpenseTrackerContext);
    const { segment } = useSpeechContext();

    const createTransaction = () => {
        const transaction = { ...formData, amount: Number(formData.amount), id: uuidv4() };

        addTransaction(transaction);
        setFOrmData(initialState);
    };

    useEffect(() => {
        if (segment) {
            if (segment.intent.intent === "add_expense") {
                setFormData({ ...formData, type: "Expense" });
            } else if (segment.intent.intent === "add_income") {
                setFormData({ ...formData, type: "Income" });
        } else if (segment.isFinal && segment.intent.intent === "create_transaction") {
            return createTransaction();
        } else if (segment.isFinal && segment.intent.intent === "cancel_transaction") {
            return setFormData(initialState);
        }

segment.entities.forEach((e)=> {
    
})

    }, [segment]);

    const selectedCategories = formData.type === "Income" ? incomeCategories : expenseCategories;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography align="center" variant="subtitle2" gutterBottom>
                    {segment && segment.words.map((w) => w.value).join(" ")}
                </Typography>
            </Grid>
            <Grid item cs={6}>
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={formData.type}
                        onChange={(e) => setFOrmData({ ...formData, type: e.target.value })}>
                        <MenuItem value="Income">Income</MenuItem>
                        <MenuItem value="Expense">Expense</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={formData.category}
                        onChange={(e) => setFOrmData({ ...formData, category: e.target.value })}>
                        {selectedCategories.map((c) => (
                            <MenuItem key={c.type} value={c.type}>
                                {c.type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    type="number"
                    label="Amount"
                    fullWidth
                    value={formData.amount}
                    onChange={(e) =>
                        setFOrmData({ ...formData, amount: e.target.value })
                    }></TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    type="date"
                    label="Date"
                    fullWidth
                    value={formData.date}
                    onChange={(e) =>
                        setFOrmData({ ...formData, date: formatDate(e.target.value) })
                    }></TextField>
            </Grid>
            <Button
                className={classes.button}
                variant="outlined"
                color="primary"
                fullWidth
                onClick={createTransaction}>
                Create
            </Button>
        </Grid>
    );
};

export default Form;
