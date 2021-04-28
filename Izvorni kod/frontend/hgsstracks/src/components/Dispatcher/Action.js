import React, {Component} from 'react'
import {Form, Button} from 'react-bootstrap'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class Action extends Component {            
    constructor(props) {
        super(props)
        this.state={
            sifakcija: "",
            nazivakcija: "",
            infnestalaosoba: "",
            lokacija: "",
            komentar: "",
            redirect: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault()
        let akcija = {
            sifakcija: this.state.sifakcija,
            nazivakcija: this.state.nazivakcija,
            infnestalaosoba: this.state.infnestalaosoba,
            lokacija: this.state.lokacija,
            korimedispecer: localStorage.getItem("user"),
            status: "U_tijeku",
            komentar: this.state.komentar   
        }
        axios.post(URL + "/checkakcija", akcija)
        .then(res => {
            if (res.data === true) {
                this.setState({
                    exists: true
                })
            } else {
                axios.post(URL + `/createakcija`, akcija)
                    .then(this.setState({
                        redirect: true
                    }))
            }
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    redirect(){
        this.setState({
            redirect: true
        })
    }

    render() {
        if(this.state.redirect){
            return(
                <Redirect to="/dispatch"/>
            )
        }
        return (
            <div>
                <h1>Nova akcija</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formActionId">
                        <Form.Label>Šifra akcije</Form.Label>
                        <Form.Control type="input"
                                    name="sifakcija"
                                    placeholder="Unesite sifru akcije" 
                                    value={this.state.sifakcija}
                                    maxLength = "5"
                                    onChange={this.handleChange}
                                    required />
                    </Form.Group>
                    <Form.Group controlId="formActionName">
                        <Form.Label>Naziv akcije</Form.Label>
                        <Form.Control type="input"
                                    name="nazivakcija"
                                    placeholder="Unesite naziv akcije" 
                                    value={this.state.nazivakcija}
                                    onChange={this.handleChange}
                                    required />
                    </Form.Group>
                    <Form.Group controlId="formPersonInfo">
                        <Form.Label>Informacije o nestaloj osobi</Form.Label>
                        <Form.Control as="textarea"
                                    rows={3}
                                    name="infnestalaosoba"
                                    placeholder="Informacije..."
                                    value={this.state.infnestalaosoba}
                                    onChange={this.handleChange}
                                    required />
                    </Form.Group>
                    <Form.Group controlId="formLocation">
                        <Form.Label>Lokacija</Form.Label>
                        <Form.Control type="input"
                                    name="lokacija"
                                    placeholder="Unesite lokaciju" 
                                    value={this.state.lokacija}
                                    onChange={this.handleChange}
                                    required />
                    </Form.Group>
                    <Form.Group controlId="formActionName">
                        <Form.Label>Dodatni komentar</Form.Label>
                        <Form.Control as="textarea"
                                    rows={3}
                                    name="komentar"
                                    value={this.state.komentar}
                                    onChange={this.handleChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.handleSubmit}>Submit</Button>
                    {this.state.exists === true ? <div style={{color:"red"}}>AKcija s tom šifrom već postoji.</div>: null}
                </Form>
            </div>
            )
        }
}