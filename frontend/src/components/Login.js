import React from 'react';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import '../css/Login.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null
        }
    }


    updateUserId = e => {
        this.setState({ email: e.target.value });
    }

    updatePassword = e => {
        this.setState({ password: e.target.value });
    }

    login = e => {
        e.preventDefault();
        e.stopPropagation();
        const email = this.state.email;
        const password = this.state.password;
    
        axios.post('/login', { email, password })
          .then(res => {
            console.log(res.data);
              if (res && res.data === "LOGIN_SUCCESS") {
                  this.props.history.push('/');
              } else  {
                  alert(res.data);
                this.props.history.push('/login');
              }
          });
    }

    render() {
        return (
            <>
            <div className="app-login">
            <Row style={{width:"100%"}}>
                <Col xs={{span: 10, offset: 1}} md={{span: 4, offset: 4}} className="app-form">
                    <h1>LOGIN</h1>
                <hr className="login-divider"/>
                <Form onSubmit={this.login} autoComplete="off">
                    <Form.Group controlId="email">
                        <Form.Control type="text"
                            placeholder='user@abc.com' onChange={this.updateUserId} />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Control type="password"
                            placeholder='pass@123' onChange={this.updatePassword} />
                        </Form.Group>

                    <Button type="submit" size="sm" className="login-submit">
                        Login
                    </Button>
                    <h6 style={{color: 'white', marginTop: '10px'}}>Don't have an account? <Link to='/signup'>SIGNUP</Link></h6>
                </Form>
                </Col>
            </Row>
            </div>
            </>
        );
    }
}
export default withRouter(Login);