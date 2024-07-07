import React from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from "@mui/material";

const ReusableRadioButton = ({ label, options, defaultValue, onChange }) => {
    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value);
        }
    };

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend" style={{ color: "black", fontSize: "12px" }}>{label}</FormLabel>
            <RadioGroup aria-label={label} name={label} defaultValue={defaultValue} onChange={handleChange} row>
                {options.map((option, index) => (
                    <FormControlLabel
                        key={index}
                        value={option.value}
                        control={<Radio />}
                        label={<Box style={{ fontSize: "12px" }}>{option.label}</Box>}
                        style={{ marginRight: '16px' }}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default ReusableRadioButton;
