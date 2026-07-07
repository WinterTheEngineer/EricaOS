import '../../styles/modal.css'

function Card({header, body, footer, actions, className}) {

    return (
        <>
            <div className={`erica-card ${className}`}>
                <div className="card-header">
                    {header}
                </div>
                <div className="card-body">
                    {body}
                </div>
                <div className="card-footer">
                    {footer}
                </div>

                <>
                    {actions}
                </>
            </div>
                
        </>
    )
}

export default Card;