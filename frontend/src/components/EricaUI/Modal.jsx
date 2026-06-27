import '../../styles/modal.css'
import '../../styles/Form.css'
import { IoMdClose } from "react-icons/io";
import sidebarLogo from "../../assets/sidebar-logo.png";

function Modal({body, footer, onClose, className}) {

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
                    <div className="modal-body">
                        {body}
                    </div>
                    <div className="modal-footer">
                        {footer}
                    </div>
                    <div className="modal-backdrop"></div>
                </div>
            </div>
                
        </>
    )
}

export default Modal;