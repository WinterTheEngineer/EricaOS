import api from '../api'
import '../styles/reminders.css'
import { Link, useOutletContext } from 'react-router-dom';
import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { FaPlus } from "react-icons/fa6";
import { TbPlaylistX } from "react-icons/tb";


function Reminders () {

    const mainRef = useRef()
    const [reminders, setReminders] = useState([])
    const { setActiveScene } = useOutletContext();

    useEffect(() => {
        document.title = "EricaOS - Your Reminders";

        const parentElement = mainRef.current?.parentElement;

        if (parentElement) {
            parentElement.classList = ''
            parentElement.id = 'reminders';
        }

        setActiveScene('reminders')
    })

    useEffect(() => {
        const fetchReminders = async () => {
            
            try {
                setReminders([])
                const res = await api.get('/clock/reminders/');
                setReminders(res.data)
            }

            catch (err) {
                console.log(err)
            }
            
        }

        fetchReminders()
    }, [])

    return (
        <>
            <header ref={mainRef}>
                <h3 className="site-heading">Reminders</h3>
                <div className="action-bar">
                    <button
                        className='erica-site-btn primary'>
                        <FaPlus />
                    </button>
                </div>
            </header>
            <div className={`main-content ${reminders.length > 0 ? '' : 'empty'}`}>
                {reminders.length > 0 ? 
                    (<>
                        {
                            reminders.map((reminder, index) => (
                                <div className="card reminder">
                                    <div className="header">
                                        <Link className='site-heading'>
                                            {reminder.title}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </>)
                    :
                    <div className="empty-container">
                        <TbPlaylistX />
                        <h1 className='site-heading'>Maybe you just have a great memory?</h1>
                        <p className="site-p erica-subtext">
                            Once you get to making one, it'll show up here.
                        </p>
                        <button
                            className='erica-site-btn primary'>
                            Create a Reminder
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default Reminders