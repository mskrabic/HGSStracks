import React, {Component} from 'react'
import axios from 'axios'
import {Form, Button, Table} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class EditUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            brojmob: "",
            email: "",
            ime: "",
            korisnickoime: this.props.match.params.username,
            lozinka: "",
            prezime: "",
            status: "",
            uloga: "",
            urlslika: "",
            img: null
        }
        this.handleEdit = this.handleEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        axios.post(URL + "/userdata", 
            {korisnickoime: this.state.korisnickoime})
        .then(res => res.data)
        .then(data => this.setState(data))
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    async handleEdit(event) {
        event.preventDefault()
        let user = {
            korisnickoime: this.state.korisnickoime,
            email: this.state.email,
            lozinka: this.state.lozinka,
            ime: this.state.ime,
            prezime: this.state.prezime,
            brojmob: this.state.brojmob,
            uloga: this.state.uloga,
            status: this.state.status,
            urlslika: this.state.urlslika
        }
        axios.put(URL + "/updatekorisnik", user)
        .then(() => this.setState({
            redirect: true
        }))
    }
    render() {
        if (this.state.redirect) {
            return <Redirect push to=
            {{pathname: `/user/${this.state.korisnickoime}`,
            state : this.state
            }}/>
        }
        return (
            <div>
            <Table>
                <tbody>
                    <tr>
                        <td><b>Korisničko ime:</b> {this.state.korisnickoime}</td>
                    </tr>
                </tbody>
            </Table>
            <Form onSubmit={this.handleEdit}>
            <Form.Group controlId="lozinka">
                <Form.Label>Zaporka</Form.Label>
                <Form.Control type="password" 
                              name="lozinka"
                              placeholder="Unesite Vašu lozinku"
                              value={this.state.lozinka}
                              onChange={this.handleChange}
                              required />
            </Form.Group>

            <Form.Group controlId="ime">
                <Form.Label>Ime</Form.Label>
                <Form.Control type="input"
                              name="ime"
                              placeholder="Ime"
                              value={this.state.ime}
                              onChange={this.handleChange}
                              required/>
            </Form.Group>

            <Form.Group controlId="prezime">
                <Form.Label>Prezime</Form.Label>
                <Form.Control type="text"
                              name="prezime"
                              placeholder="Prezime"
                              value={this.state.prezime}
                              onChange={this.handleChange}
                              required/>
            </Form.Group>

            <Form.Group controlId="brojmob">
                <Form.Label>Broj telefona</Form.Label>
                <Form.Control type="number"
                              name="brojmob"
                              placeholder="Broj telefona"
                              value={this.state.brojmob}
                              onChange={this.handleChange}
                              required/>
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email"
                              name="email"
                              placeholder="E-mail adresa"
                              value={this.state.email}
                              onChange={this.handleChange}
                              required/>
            </Form.Group>
            <Button variant="primary" type="submit">Ažuriraj podatke</Button>
        </Form>
        </div>
        );
    }
}