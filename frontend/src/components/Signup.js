import React from 'react';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import '../css/Login.css';

class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            name: null,
        }
    }

    updateUserId = e => {
        this.setState({ email: e.target.value });
    }

    updatePassword = e => {
        this.setState({ password: e.target.value });
    }

    updateName = e => {
        this.setState({ name: e.target.value });
    }

    signup = e => {
        e.preventDefault();
        e.stopPropagation();
        const email = this.state.email;
        const password = this.state.password;
        const name = this.state.name;
        axios.post('/signup', { email, password, name })
          .then(res => {
              if (res && res.data === "LOGIN_SUCCESS") {
                alert(res.data);
                  this.props.history.push('/');
              } else {
                alert(res.data);
                this.props.history.push('/login');
              }
          })
          .catch(err => alert(err));
    }

    render() {
        return (
            <>
            <div className="app-login">
            <Row style={{width:"100%"}}>
                <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 4}} className="app-form">
                    <h1>SIGNUP</h1>
                <hr className="login-divider"/>
                <Form onSubmit={this.signup} autoComplete="off">
                    <Form.Group controlId="name">
                        <Form.Control type="text"
                            placeholder='John Williams' onChange={this.updateName} />
                    </Form.Group>

                    <Form.Group controlId="userId">
                        <Form.Control type="text"
                            placeholder='user@abc.com' onChange={this.updateUserId} />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Control type="password"
                            placeholder='pass@123' onChange={this.updatePassword} />
                        </Form.Group>

                    <Button type="submit" size="sm" className="login-submit">
                        SIGNUP
                    </Button>
                </Form>
                </Col>
            </Row>
            </div>
            </>
        );
    }
}
export default withRouter(Signup);