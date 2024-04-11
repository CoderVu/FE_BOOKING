import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import '../styles/index.css'
const Footer = () => {
    let today = new Date();
    return (
        <footer className="bg-dark text-light py-3 footer mt-lg-5"> {/* Change 'Footer' to 'footer' */}
            <Container>
                <Row>
                    <Col xs={12} md={12} className="text-center">
                        <p className="m-0"> &copy;{today.getFullYear()} Khach San ABC. All Rights Reserved | Terms Of Service | Privacy</p> {/* Correct the class name 'mp-0' to 'm-0' */}
                    </Col>
                </Row>
            </Container>
        </footer> 
    );
}

export default Footer;
