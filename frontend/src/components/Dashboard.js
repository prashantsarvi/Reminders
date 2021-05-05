import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { Route, Switch, Redirect, Link } from "react-router-dom";
import Navbar from './Navbar';
import Reminders from './Reminders';
import Notes from './Notes';
import Friends from './Friends';
import '../css/Dashboard.css';

function Dashboard() {
    return (

     <Container fluid="true" style={{height: "100vh"}}>
        <Navbar/>
        <Row style={{display:"flex", justifyContent: "center"}}>
          <Col sm={9}>
            <Switch>
              <Route exact path='/' >
                  <Redirect to="/reminders" />
              </Route>
              <Route exact path="/reminders"><Reminders/></Route>
              <Route exact path="/notes"><Notes/></Route>
              <Route exact path="/friends"><Friends/></Route>
              <Route>
                not found baby
              </Route>
            </Switch>
          </Col>
        </Row>
     </Container>

    );
  }
  
  export default Dashboard;