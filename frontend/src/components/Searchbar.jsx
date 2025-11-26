import api from '../api';
import '../styles/Searchbar.css';
import { useState } from 'react';

import { IoSearch } from "react-icons/io5";

function Searchbar() {

    const [searchTerm, setSearchTerm] = useState("")
    
    const updateResults = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        api.get("/api/search", {
            params: {
                q: term,
                apps: ["notes"]
            }
        })
        .then(res => console.log(res.data))
        .catch(err => alert(err));
    };

    return (
        <div id="searchbar">
            <IoSearch />
            <input 
                type="search"
                name="search-input"
                className='search-input'
                onChange={updateResults}
                placeholder={`Search...`}
                value={searchTerm}
            />
        </div>
    )
}

export default Searchbar;