import React, {Component} from 'react'
import {Form, Button} from 'react-bootstrap'
import axios from 'axios'
import {storage} from '../firebase'
import {Redirect} from 'react-router-dom'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class Register extends Component {
    constructor(props) {  
        super(props)
        this.state = {
            korisnickoime: "",
            email: "",
            lozinka: "",
            ime: "",
            prezime: "",
            brojmob: "",
            uloga: "Spasilac",
            status: "Zahtjev_poslan",
            urlslika: "",
            img: null,
            redirect: false
        }
        this.handleRegister = this.handleRegister.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handlePictureChange = this.handlePictureChange.bind(this)
    }

    handlePictureChange(event){
        this.setState({img: event.target.files[0]}, function(){
            //console.log('Dodan file')
            //console.log(this.state)
        })
    }

    async handleRegister(event) {
        event.preventDefault()
        axios.post(URL + "/checkkorisnik", {
            korisnickoime: this.state.korisnickoime
        }).then(res => {
            if (res.data === true) {
                this.setState({
                    exists: true
                })
            } else {
                let file = this.state.img
                const uploadTask = storage.ref(`images/${file.name}`).put(file)
                uploadTask.on(
                    "state_changed",
                    snapshot => {},
                    error => {
                        console.log(error)
                    },
                    () => {
                        storage
                        .ref("images")
                        .child(file.name)
                        .getDownloadURL()
                        .then(url => {
                            console.log("URL:" + url)
                            this.setState({urlslika: url})
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
                            //console.log(this.state)
                            axios.post(URL + `/createkorisnik`, user)
                            }).then(() => {
                                this.setState({
                                    redirect: true
                                })
                            })
                    })
            }
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/"/>
        }
        return (
            <Form onSubmit={this.handleRegister}>
            <Form.Group controlId="korisnickoime">
                <Form.Label>Korisničko ime</Form.Label>
                <Form.Control type="username"
                              name="korisnickoime"
                              placeholder="Unesite korisničko ime" 
                              value={this.state.korisnickoime}
                              onChange={this.handleChange}
                              required />
            </Form.Group>

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

            <Form.Group controlId="role">
                <Form.Label>Uloga</Form.Label>
                <Form.Control as="select"
                              name="uloga"
                              placeholder="Uloga"
                              value={this.state.uloga}
                              onChange={this.handleChange}
                              required>
                    <option>Spasilac</option>
                    <option>Dispecer</option>
                 </Form.Control>
            </Form.Group>

            <Form.Group controlId="img">
                <Form.Label>Slika profila</Form.Label>
                <Form.Control
                    type="file"
                    name="img"
                    onChange={this.handlePictureChange}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">Registriraj se</Button>
            {this.state.exists === true ? <div style={{color:"red"}}>Korisnik s tim korisničkim imenom već postoji.</div>: null}
        </Form>
        );
    }
}