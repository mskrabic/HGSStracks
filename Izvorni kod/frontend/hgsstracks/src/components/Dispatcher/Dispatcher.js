import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Button, Card} from 'react-bootstrap'

class Dispatcher extends Component {
    constructor() {
        super()
        this.state = {
            newAction: false,
            ongoingActions: false,
            finishedActions: false
        }
        this.openAction = this.openAction.bind(this)
        this.ongoingActions = this.ongoingActions.bind(this)
        this.finishedActions = this.finishedActions.bind(this)
    }

    openAction() {
        this.setState({
            newAction: true
        })
    }
    
    ongoingActions() {
        this.setState({
            ongoingActions: true
        })
    }
    
    finishedActions() {
        this.setState({
            finishedActions: true
        })
    }
    
    render() {
        if (this.state.newAction) {
            return <Redirect push to=
            {{pathname: `/newAction`,
            state : this.state
            }}/> 
        }

        if (this.state.ongoingActions) {
            return <Redirect push to=
            {{pathname: '/ongoingActions',
            state : this.state
            }}/> 
        }

        if (this.state.finishedActions) {
            return <Redirect push to=
            {{pathname: '/finishedActions',
            state : this.state
            }}/> 
        }             
        return (
            <div>
                <Card>
                    <Card.Header></Card.Header>
                    <Card.Body>
                        <Card.Title>Otvaranje nove akcije</Card.Title>
                        <Button variant="success" onClick={() => this.openAction()}>
                            Otvori novu akciju
                        </Button>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header></Card.Header>
                    <Card.Body>
                        <Card.Title>Pregled aktivnih akcija</Card.Title>
                        <Button variant="success" onClick = {() => this.ongoingActions()}>
                            Akcije u tijeku
                        </Button>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header></Card.Header>
                    <Card.Body>
                        <Card.Title>Pregled završenih akcija</Card.Title>
                        <Button variant="success" onClick = {() => this.finishedActions()}>
                            Završene akcije
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
export default Dispatcher