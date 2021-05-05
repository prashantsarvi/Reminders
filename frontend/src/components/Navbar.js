import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter, useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Navbar.css';

const Navbar = () => {
    let history = useHistory();

    const logout = () => {
        axios.get('/logout')
            .then(() => {
                Cookies.remove("auth_token");
                history.push('/logout');
            });
    }
    return (
        <Row className="nav">
             <Col sm={2}> LOGO </Col>
             <Col md="auto" className="d-none d-md-block">
            <Link to='/reminders'>
                <div><i className="bi bi-alarm"></i> Reminders </div>
            </Link>
            </Col>
            <Col md="auto" className="d-none d-md-block">
                <Link to='/notes'>
                <div><i className="bi bi-book"></i> Notes </div>
                </Link>
            </Col>
            <Col md="auto" className="d-none d-md-block">
                <Link to='/friends'>
                    <div><i className="bi bi-people-fill"></i> Friends </div>
                </Link>
            </Col>
            
            <Col sm="auto" className="d-md-none d-sm-block">
                <Link to='/reminders'>
                    <div><i className="bi bi-alarm"></i></div>
                </Link>
            </Col>
            <Col sm="auto" className="d-md-none d-sm-block">
                <Link to='/notes'>
                    <div><i className="bi bi-book"></i></div>
                </Link>
            </Col>
            <Col sm="auto" className="d-md-none d-sm-block">
                <Link to='/friends'>
                    <div><i className="bi bi-people-fill"></i></div>
                </Link>
            </Col>
             <Col sm={1}>
                    <div><i className="bi bi-power" onClick={logout}></i></div>
            </Col>
        </Row>
    )
};

export default Navbar;