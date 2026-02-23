import React, { useState, useEffect } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface CreatableMultiSelectProps {
    label: string;
    initialOptions?: string[];
    onChange?: (value: string[]) => void;
    value?: string[];
}

const CreatableMultiSelect: React.FC<CreatableMultiSelectProps> = ({
    label,
    initialOptions = [],
    onChange,
    value = [],
}) => {
    // State for options and selected values
    const [options, setOptions] = useState<string[]>(initialOptions);
    const [selectedValues, setSelectedValues] = useState<string[]>(value);

    // Update options jab initialOptions change ho
    useEffect(() => {
        setOptions(initialOptions);
    }, [initialOptions]);

    // Update selectedValues jab value prop change ho
    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    // Handle selection ya naye value ke addition ka logic
    const handleChange = (event: React.SyntheticEvent, newValue: string[]) => {
        // Nay values jo options mein nahi hain, unko add karo
        const newOptions = [...options];

        newValue.forEach((val) => {
            if (!options.includes(val)) {
                newOptions.push(val);
            }
        });

        // Options aur selected values update karo
        setOptions(newOptions);
        setSelectedValues(newValue);

        // Parent ko updated values bhejo
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <Autocomplete
            multiple
            freeSolo
            options={options}
            value={selectedValues}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    placeholder="Type or select options"
                />
            )}
        />
    );
};

export default CreatableMultiSelect;
