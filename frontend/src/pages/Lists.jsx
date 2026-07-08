import '../styles/Lists.css'
import api from '../api';
import { useRef, useEffect, useState } from "react";

import { RiH1, RiCloseCircleFill } from 'react-icons/ri';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { TbPlaylistX } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import sidebarLogo from '../assets/sidebar-logo.png';
import Modal from '../components/EricaUI/Modal';
import { formToJSON } from 'axios';
import { toast } from 'react-toastify';

import { SlOptionsVertical } from "react-icons/sl";
import { BiSolidTrashAlt } from "react-icons/bi";

function Lists () {

    const mainRef = useRef();
    const date = new Date();
    
    const [lists, setLists] = useState([])
    const { setActiveScene } = useOutletContext();

    const [openMenuId, setOpenMenuId] = useState(null);
    const [newListItems, setNewListItems] = useState([])
    const [newListItem, setNewListItem] = useState('')
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ordered, setOrdered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [createListModalOpen, setCreateListModalOpen] = useState(false)
    
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "EricaOS - Your Lists";
        const parentElement = mainRef.current?.parentElement;

        if (parentElement) {
            parentElement.classList = ''
            parentElement.id = 'lists';
        }

        setActiveScene('lists')
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLists([])
            const res = await api.get("/lists/");
            setLists(res.data);
            console.log(lists)
        };

        fetchData();
    }, []);

    const submitList = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        setLoading(true);

        try {
            const res = await api.post("/lists/create/", {
                title,
                description,
                ordered,
                items_input: newListItems
            });
            
            setLists(prev => [res.data, ...prev]);
            toast.success("List created!")
            
            clearListModal();
            navigate('/dashboard/lists')

        } catch (err) {
            console.error(err);
            alert("Failed to create list");
        } finally {
            setLoading(false);
        }
    };

    const addListItem = () => {
        const value = newListItem.trim();
        if (!value) return;

        setNewListItems(prev => [
            ...prev,
            { name: value }
        ]);

        setNewListItem("");
    };

    const clearListModal = () => {
        setTitle("");
        setDescription("");
        setOrdered(false);
        setNewListItems([])
        setCreateListModalOpen(prev => !prev)
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/lists/${id}/`);
            setLists(prev => prev.filter(l => l.id !== id));
            toast.success("List Deleted")
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete List")
        }
    };

    const toggleListOptions = (id) => {
        setOpenMenuId(prev => (prev === id ? null : id));
    };

    return (<>
        <header ref={mainRef}>
            <h3 className="site-header">Lists</h3>
            <div className="action-bar">
                <button
                    onClick={() => setCreateListModalOpen(prev => !prev)}
                    className='erica-site-btn primary'>
                    <FaPlus />
                </button>
            </div>
        </header>
        <div className={`main-content ${lists.length > 0 ? '' : 'empty'}`}>
            {lists.length > 0 ? (
                <>
                    {lists.map((listObj, index) => (
                        <Card
                            className={'erica-card'}
                            key={listObj.id}
                            header={
                                <>
                                    <div className="details">
                                        <Link className="site-heading">
                                            {listObj.title}
                                        </Link>
                                        <p className="erica-subtext">
                                            {listObj.description}
                                        </p>
                                    </div>
                                    <button
                                        className="card-options-toggle"
                                        onClick={() => toggleListOptions(listObj.id)}
                                    >
                                        <SlOptionsVertical />
                                    </button>
                                    <ul className={`list-options card-options ${openMenuId === listObj.id ? "open" : ""}`}>
                                        <li
                                            className="card-option"
                                            onClick={() => handleDelete(listObj.id)}
                                        >
                                            <BiSolidTrashAlt />
                                            Delete
                                        </li>
                                    </ul>
                                </>
                            }

                            body={
                                <ul className={`list-items ${listObj.ordered ? 'ordered' : ''}`}>
                                    {listObj.items.map((listItem) => (
                                        <li
                                            className="list-item" key={listItem.id}
                                            onClick={() => handleListItem(listItem)}
                                        >
                                            {listObj.ordered && 
                                                <span>{`${listItem.order}.`}</span>
                                            }
                                            {listItem.name}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </>
            ) : (
                <div className="empty-container">
                    <TbPlaylistX />
                    <h1 className='site-heading'>The Secret Ingredient is... You</h1>
                    <p className="site-p erica-subtext">
                        Once you get to making one, it'll show up here.
                    </p>
                    <button
                        onClick={() => setCreateListModalOpen(prev => !prev)}
                        className='erica-site-btn primary'>
                        Make a List
                    </button>
                </div>
            )}
        </div>
        {createListModalOpen &&
            <Modal 
                body={
                    <form className="erica-form">
                        <div className="form-input">
                            <input
                                type="text"
                                placeholder="List title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                />
                        </div>

                        <div className="form-input">
                            <textarea
                                placeholder="Description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <label className="erica-checkbox">
                            <input
                                type="checkbox"
                                checked={ordered}
                                onChange={(e) => setOrdered(e.target.checked)}
                            />
                            Ordered list
                        </label>

                        <div className="add-list-items">
                            <h3 className="site-heading">List Items</h3>
                            <div className="form-input">
                                <input
                                    type="text"
                                    placeholder="Item title"
                                    value={newListItem}
                                    onChange={(e) => setNewListItem(e.target.value)}
                                    onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addListItem()
                                    }
                                }}
                                />
                                <button
                                    type="button"
                                    onClick={addListItem}
                                    className="erica-site-btn primary list-item-inline"
                                >
                                    <IoMdAdd />
                                </button>
                            </div>
                            <ul className={`list-items ${ordered ? 'ordered' : ''}`}>
                                {newListItems.map((item, index) => (
                                    <li key={index} className="modal-list-item">
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </form>
                }
                footer={
                    <button
                        type="submit"
                        onClick={submitList}
                        className="erica-site-btn primary submit"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                }
                onClose={clearListModal}
            />
        }
    </>)
}

export default Lists