import React, { useState, useEffect } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// Define props interface
interface CreatableSelectProps {
    label: string;
    initialOptions?: string[];
    onChange?: (value: string | null) => void;
    value?: string | null;
}

const CreatableSelect: React.FC<CreatableSelectProps> = ({
    label,
    initialOptions = [],
    onChange,
    value,
}) => {
    const [options, setOptions] = useState<string[]>(initialOptions);
    const [selectedValue, setSelectedValue] = useState<string | null>(value || null);

    // Update options if initialOptions prop changes
    useEffect(() => {
        setOptions(initialOptions);
    }, [initialOptions]);

    // Update selectedValue if value prop changes
    useEffect(() => {
        setSelectedValue(value || null);
    }, [value]);

    // Handle input change (on every keystroke)
    const handleInputChange = (
        event: React.SyntheticEvent,
        newInputValue: string
    ) => {
        setSelectedValue(newInputValue || null);

        if (onChange) {
            onChange(newInputValue || null);
        }
    };

    // Handle selection or committed value
    const handleChange = (
        event: React.SyntheticEvent,
        newValue: string | null
    ) => {
        if (newValue && !options.includes(newValue)) {
            setOptions([...options, newValue]);
        }

        setSelectedValue(newValue);

        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <Autocomplete
            freeSolo
            options={options}
            value={selectedValue}
            onChange={handleChange}
            onInputChange={handleInputChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    placeholder="Type or select an option"
                />
            )}
        />
    );
};

export default CreatableSelect;
