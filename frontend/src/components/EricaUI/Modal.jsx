import '../../styles/modal.css'
import '../../styles/Form.css'
import { IoMdClose } from "react-icons/io";
import sidebarLogo from "../../assets/sidebar-logo.png";
import { useState } from 'react';

function Modal({body, footer, onClose, className, tabs, activeTab, onTabChange, choices, activeChoice, onChoiceChange}) {

    return (
        <>
            <div className={`erica-modal ${className}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <img src={sidebarLogo} alt="Erica Logo" className="logo" />
                        <div className="close-modal" onClick={onClose}>
                            <IoMdClose />
                        </div>
                    </div>
                    {tabs &&
                        <div className="modal-tabs">
                            {tabs.map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(tab.dataTitle)}
                                    className={`modal-tab ${activeTab === tab.dataTitle ? 'active' : ''}`}>
                                    {tab.dataTitle}
                                </button>
                            ))}
                        </div>
                    }
                    <div className="modal-body">
                        {body}
                    </div>
                    <div className="modal-footer">
                        {footer}
                        {choices &&
                            <select name="modal-choices" id="modal-choices" className="erica-select" onChange={(e) => onChoiceChange(e.target.value)}>
                                {choices.map((choice) => (
                                    <option value={choice.dataTitle}>
                                        {choice.displayTitle}
                                    </option>
                                ))}
                            </select>
                        }
                    </div>
                    <div className="modal-backdrop"></div>
                </div>
            </div>
                
        </>
    )
}

export default Modal;