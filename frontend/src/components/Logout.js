import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import '../css/Logout.css'

class Logout extends React.Component {

    constructor(props) {
        super(props);
    }


    logout = e => {
        axios.get('/logout')
            .then(() => {
                Cookies.remove("auth_token");
                this.props.history.push('/login');
            });
    }

    render() {
        return (
            <>
                <Button className="app-logout" onClick={this.logout}>
                    <i className="bi bi-power"></i>
                </Button>
            </>
        );
    }
}

export default withRouter(Logout);