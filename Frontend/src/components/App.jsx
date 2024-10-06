import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState([]);

  function addNote(note) {
        // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: note.title, content: note.content})
    };

    fetch('/addNote', requestOptions)
    .then(response => response.json())
    .then(data => {
      var newNote = note
      newNote.id = data.id;
      setNotes(prevNotes => [...prevNotes, newNote]);
    });
  }

  function deleteNote(id) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    };

    fetch('/deleteNote', requestOptions)
    .then(response => response.json())
    .then(() => {
      setNotes(prevNotes => {
        return prevNotes.filter((noteItem) => {
          return noteItem.id !== id;
        });
      });
    });
  }

  useEffect(() => {
    fetch('/getNotes')  // Call the backend API
      .then(response => response.json())
      .then(data => { setNotes(data.notes) });
  }, []);

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
