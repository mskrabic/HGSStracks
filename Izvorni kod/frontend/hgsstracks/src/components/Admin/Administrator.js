import React from 'react';
import {Button, Card} from 'react-bootstrap'
import Requests from './Requests'
import StanicaList from '../Stanica/StanicaList'
import UserList from './UserList';

export default class Administrator extends React.Component {

    constructor(props){
        super(props);
        this.getRequests = this.getRequests.bind(this);
        this.getStanice = this.getStanice.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.state = {
            getRequest: false,
            getStanices: false,
            getUsers: false
        }
    }

    getRequests(){
        this.setState({getRequest: true});
    }

    getStanice(){
        this.setState({getStanices: true});
    }
    
    getUsers(){
        this.setState({getUsers: true})
    }

    render(){
        if(this.state.getRequest){
            return(
                <Requests />
            )
        }
        if(this.state.getStanices){
            return(
                <StanicaList />
            )
        }
        if(this.state.getUsers){
            return(
                <UserList />
            )
        }
        return(
            <div>
            <Card>
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Title>Zahtjevi za registraciju</Card.Title>
                    <Card.Text>
                        Upravljajte zahtjevima za registraciju.
                    </Card.Text>
                    <Button onClick={this.getRequests}>Prikaži zahtjeve za registraciju</Button>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Title>Stanice</Card.Title>
                    <Card.Text>
                        Pregledajte stanice HGSS-a.
                    </Card.Text>
                    <Button onClick={this.getStanice}>Prikaži popis stanica</Button>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Title>Registrirani korisnici</Card.Title>
                    <Card.Text>
                        Pregledajte registrirane korisnike.
                    </Card.Text>
                    <Button onClick={this.getUsers}>Prikaži popis registriranih korisnika</Button>
                </Card.Body>
            </Card>          
            </div>
        );
    }
}