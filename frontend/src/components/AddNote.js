import React, { useState, useEffect } from 'react';
import {Button} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import axios from 'axios';
import '../css/AddNote.css';




const AddNote = (props) => {
 
  const [title, setTitle] = useState(props.data && props.data.item && props.data.item.title);
  const [message, setMessage] = useState(props.data && props.data.item && props.data.item.message);
  const noteId = props.data && props.data.item && props.data.item.noteId;

  const updateTitle = e => {
    setTitle(e.target.value);
  }

  const updateMessage = e => {
      setMessage(e.target.value);
  }

  const createNote = e => {
    e.preventDefault();
    e.stopPropagation();
    const sendReq = (props.data.method === 'post') ? axios.post : axios.patch
    sendReq('/notes/', { title, message, noteId})
      .then(res => {
        alert(res.data);
        window.location.reload();
      })
      .catch(err => console.log(err));
  }
    
    return(
  <>
       <div style={{marginLeft: '10px', width: '90%'}}>
         <Form onSubmit={createNote} autoComplete="off">
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Control size='lg' onChange={updateTitle} value={title}
              style={{marginTop: "10px"}}type="title" placeholder="Note Title" />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Control size='lg' onChange={updateMessage} value={message}
              style={{marginTop: "10px", height: "100px"}}type="title" placeholder="Note Description" />
            </Form.Group>
            
            <Button type="submit" size="sm">
                SUBMIT
            </Button>
        </Form></div>
        
        </>

    );

}

export default AddNote;
