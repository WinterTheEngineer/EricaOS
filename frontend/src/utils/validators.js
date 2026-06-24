import api from "../api";

export const debounce = (fn, delay = 400) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

export const validateField = async (route, value) => {
    const res = await api.post(route, { value });
    return res.data.valid;
};