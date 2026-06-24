import { useState } from "react";
import api from "../api";
import '../styles/modal.css'
import { useNavigate } from "react-router-dom";
import sidebarLogo from "../assets/sidebar-logo.png";
import { IoMdClose } from "react-icons/io";

function CreateListModal({ onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ordered, setOrdered] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        setLoading(true);

        try {
            const res = await api.post("/lists/create/", {
                title,
                description,
                ordered,
            });

            onCreated?.(res.data);

            setTitle("");
            setDescription("");
            setOrdered(false);

            onClose?.();

        } catch (err) {
            console.error(err);
            alert("Failed to create list");
        } finally {
            setLoading(false);
            navigate('/dashboard/lists')
        }
    };

    return (
        <div className="erica-modal" id="create-list">
            <div className="modal-content">

                <div className="modal-header">
                    <img src={sidebarLogo} alt="Erica Logo" className="logo" />

                    <div className="close-modal" onClick={onClose}>
                        <IoMdClose />
                    </div>
                </div>

                <div className="modal-body">
                    <h4 className="site-heading">Make a List</h4>

                    <form onSubmit={handleSubmit} className="erica-form">
                        <div className="form-input">
                            <input
                                type="text"
                                placeholder="List title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-input">
                            <input
                                type="text"
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
                    </form>
                </div>

                <div className="modal-footer">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="erica-site-btn primary submit"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create List"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CreateListModal;