import {Button} from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddNote from './AddNote';
import '../css/Notes.css';

const Notes = () => {
    const [reminders, setReminders] = useState([]);
    const [showForm, showCreateForm] = useState(false);
    const [title, editTitle] = useState('Notes');
    const [buttonText, editText] = useState('Add Note');
    const [editProps, sendProps] = useState({});
    
    useEffect(() => {
      axios.get('/notes').then(response => {
          const remindersList = response.data;
          console.log('list', remindersList);
          setReminders(remindersList);
      });
    }, []);

    const toggleView = () => {
      sendProps({
        method: 'post',
        item: {}
      });
      if (!showForm) {
        editTitle('Create Note');
        editText('Show List');
      } else {
        editTitle('Notes');
        editText('Add Note');
      }
      showCreateForm(!showForm);
    }

    const deleteItem = (id) => {
      axios.delete(`/notes/${id}`).then(response => {
        alert(response.data);
        window.location.reload();
    });
    }

    const editItem = (index) => {
      sendProps({
        method: 'patch',
        item: reminders && reminders.length && reminders[index]
      });
      if (!showForm) {
        editTitle('Edit Notes');
        editText('Show List');
      } else {
        editTitle('Notes');
        editText('Add Note');
      }
      showCreateForm(!showForm);
    }

    return(
  <>
  <Row style={{padding: '20px 0%', margin:"0px", display:"flex", justifyContent: "space-between"}}>
      <h1>{title}</h1>
      <Button className="btn-success" onClick={toggleView}>{buttonText}</Button>
  </Row>
  <Row>
    {
      
    }
    {
      showForm ?

        <AddNote data={editProps}/>

        :

        reminders.map((reminder, index) => (
        <div className="notes" key={index}>
          <Button className="btn-danger" style={{float:'right'}} onClick={() => deleteItem(reminder.noteId)}>Delete</Button>
          <Button style={{float:'right', marginRight: "5px"}} onClick={() => editItem(index)}>Edit</Button>
          <h4>{reminder.title}</h4>{reminder.message}
        </div>
      ))
    }
  </Row>
        </>
    );

}

export default Notes;
