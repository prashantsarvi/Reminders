import {Button} from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddReminder from './AddReminder';
import '../css/Notes.css';

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [showForm, showCreateForm] = useState(false);
    const [title, editTitle] = useState('Reminders');
    const [buttonText, editText] = useState('Add Reminder');
    const [editProps, sendProps] = useState({});
    
    useEffect(() => {
      axios.get('/reminders').then(response => {
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
        editTitle('Create Reminder');
        editText('Show List');
      } else {
        editTitle('Reminders');
        editText('Add Reminder');
      }
      showCreateForm(!showForm);
    }

    const deleteItem = (id) => {
      axios.delete(`/reminders/${id}`).then(response => {
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
        editTitle('Edit Reminder');
        editText('Show List');
      } else {
        editTitle('Reminders');
        editText('Add Reminder');
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

        <AddReminder data={editProps}/>

        :

        reminders.map((reminder, index) => (
        <div className="notes" key={index}>
          <Button className="btn-danger" style={{float:'right'}} onClick={() => deleteItem(reminder.reminderId)}>Delete</Button>
          <Button style={{float:'right', marginRight: "5px"}} onClick={() => editItem(index)}>Edit</Button>
          <h4>{reminder.title}</h4>{reminder.message}
        </div>
      ))
    }
  </Row>
        </>
    );

}

export default Reminders;
