import { useState } from "react";

function FormInput({ route, debouncer, validator }) {

    const [fieldInput, setFieldInput] = useState('')

    const handleChange = debouncer(async (e) => {
        const value = e.target.value;

        await validator(route, value);
    }, 400);

    return (
        <input
            type="text"
            value={fieldInput}
            className="erica-form-input"
            onChange={handleChange}
        />
    );
}