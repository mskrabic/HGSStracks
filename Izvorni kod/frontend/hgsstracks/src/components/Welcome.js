import React, {Component} from 'react'
import {Jumbotron, Row, Col} from 'react-bootstrap'

export default class Welcome extends Component {
    render() {
        const welcomeStyle = {
            textAlign: "center",
            marginTop: "20px"
          };
        return (
            <Row>
                <Col lg={12} style={welcomeStyle}>
                    <Jumbotron className="bg-dark text-white">
                        <h1>Dobrodošli na stranicu HGSStracks!</h1>
                        <p>
                            Aplikacija koja olakšava koordinaciju rada svih ljudi aktivnih na akciji spašavanja.
                        </p>
                    </Jumbotron>
                </Col>
            </Row>       
        );
    }
}