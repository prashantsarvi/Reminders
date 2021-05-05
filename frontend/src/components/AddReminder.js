import React, { useState, useEffect } from 'react';
import {Button} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import moment from 'moment';
import Datetime from "react-datetime";
import axios from 'axios';
import '../css/AddNote.css';

const AddReminder = (props) => {

  const showDate = (props.data && props.data.item && props.data.item.reminderDate && moment(props.data.item.reminderDate)) || moment();
  const [date, setDate] = useState(showDate);
  const [title, setTitle] = useState(props.data && props.data.item && props.data.item.title);
  const [message, setMessage] = useState(props.data && props.data.item && props.data.item.message);
  const reminderId = props.data && props.data.item && props.data.item.reminderId;

  const valid = (current) => {
    return current.isAfter(moment().subtract(1, "day"));
  }

  const updateTitle = e => {
    setTitle(e.target.value);
  }

  const updateMessage = e => {
      setMessage(e.target.value);
  }

  const createReminder = e => {
    e.preventDefault();
    e.stopPropagation();
    const sendReq = (props.data.method === 'post') ? axios.post : axios.patch
    sendReq('/reminders/', { title, message, date: date.toString(), reminderId })
      .then(res => {
        alert(res.data);
        window.location.reload();
      })
      .catch(err => console.log(err));
  }
    
    return(
  <>
       <div style={{marginLeft: '10px', width: '90%'}}>
         <Form onSubmit={createReminder} autoComplete="off">
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Control size='lg' onChange={updateTitle} value={title}
              style={{marginTop: "10px"}}type="title" placeholder="Reminder Title" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Control size='lg' onChange={updateMessage} value={message}
              style={{marginTop: "10px", height: "100px"}}type="title" placeholder="Reminder Description" />
            </Form.Group>
            <b><i>Set Reminder</i></b>
            <Form.Group controlId="dateTime">
                <Datetime isValidDate={valid} value={date} placeholder="select date..." onChange={setDate}/>
            </Form.Group>
            <Button type="submit" size="sm">
                SUBMIT
            </Button>
        </Form></div>
        
        </>

    );

}

export default AddReminder;
