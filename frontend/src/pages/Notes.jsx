import api from '../api'
import { useState, useEffect } from "react";

function Notes () {

    const [notes, setNotes] = useState([])
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    useEffect(() => {
        getNotes();
        document.title = "EricaOS - Your Notes"
    }, [])

    const getNotes = () => {
        api.get("/notes/")
        .then(res => res.data)
        .then((data) => { setNotes(data); console.log(data) })
        .catch((err) => alert(`Couldn't fetch notes: ${err}`))
    }

    const deleteNote = (id) => {
        api.delete(`/notes/delete/${id}/`)
        .then((res) => {
            if (res.status === 204) {
                deleted = notes.find(note => note.id === id);
                alert(`"${deleted.title}" has been deleted`)
            } else {
                alert("Couldn't delete note");
            }
            
            getNotes();
        })
        .catch((err) => {alert(err)});

    }

    const createNote = (e) => {
        e.preventDefault()
        api.post("/notes/create/", {content, title}).then((res) => {
            if (res.status === 201) {
                alert(`"${title}" has been created`)
            } else {
                alert("Failed to make note")
            }
            
            getNotes();
        }).catch((err) => alert(err));
    }

    return (<>
        <div className="notes-container">
            <h2>Notes</h2>
            {notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id} />)}
        </div>
        <div>
            <h2>Create a Note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title" 
                    name="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}/>

                <label htmlFor="content">Content:</label>
                <textarea
                    name="content"
                    id="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}/>

                <input type="submit" value="submit"/>
            </form>
        </div>
    </>)
}

export default Notes