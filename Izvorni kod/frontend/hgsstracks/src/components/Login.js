import React, {Component} from 'react'
import {Form, Button} from 'react-bootstrap'
import  {Redirect} from 'react-router-dom'
import axios from 'axios'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class Login extends Component {

    
    constructor(props) {
        super(props)
        this.state={
            korisnickoime: "",
            lozinka: "",
            loggedIn: undefined
        }
        this.handleLogin = this.handleLogin.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.updatePosition = this.updatePosition.bind(this)
    }

    getLocation() {
        if (navigator.geolocation) {
            let id = navigator.geolocation.watchPosition(this.updatePosition);
            //console.log("WATCHING " + id)
            localStorage.setItem("locationId", id)
          } else { 
            alert("Geolocation is disabled!")
          }
    }

    updatePosition(position) {
        if (!(localStorage.getItem("status") === 'Registriran'))
            return
        //console.log("UPDATING POSITION")
        axios.post(URL + "/spasilacdata", {
            korisnickoime: this.state.korisnickoime
        }).then(res => {
            //console.log(res.data)
            let user = {
                dostupan: res.data.dostupan,
                korisnickoime: res.data.korisnickoime,
                lokacijaduzina: position.coords.longitude,
                lokacijasirina: position.coords.latitude,
                sifstanica: res.data.sifstanica,
                siftrenutneakcije: res.data.siftrenutneakcije,
            }
            //console.log(user)
            axios.post(URL + "/updatespasilac", user)
        })
    }

    handleLogin(event) {
        event.preventDefault()
        axios.post(URL + `/check`, this.state)
        .then(res => {
            if (res.data === true) {
                axios.post(URL + "/userdata", {
                    korisnickoime: this.state.korisnickoime
            })
                    .then(res2 => {                 
                        localStorage.setItem("role", res2.data.uloga)
                        localStorage.setItem("status", res2.data.status)
                        localStorage.setItem("user", this.state.korisnickoime)
                        this.setState({
                            loggedIn: res.data,
                        })
                        if (res2.data.uloga === "Spasilac") {
                            this.getLocation()
                        }
                        this.props.setLoggedIn(true);
                    })
            } else {
                this.setState({
                    loggedIn: res.data
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
        if (this.state.loggedIn !== true) {
            return (
                <Form onSubmit={this.handleLogin}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Korisničko ime</Form.Label>
                        <Form.Control type="username"
                                    name="korisnickoime"
                                    placeholder="Unesite korisničko ime" 
                                    value={this.state.korisnickoime}
                                    onChange={this.handleChange}
                                    required />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Zaporka</Form.Label>
                        <Form.Control type="password" 
                                    name="lozinka"
                                    placeholder="Unesite Vašu lozinku"
                                    value={this.state.lozinka}
                                    onChange={this.handleChange}
                                    required />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>

                    <div style={{color:"red"}}>{this.state.loggedIn === undefined ? "" : "Neispravno korisničko ime ili lozinka."}</div>
                </Form>
            )
        } else {
            return <Redirect push to=
            {{pathname: `/user/${this.state.korisnickoime}`,
            state : this.state
            }}/>
        }
    }
}
