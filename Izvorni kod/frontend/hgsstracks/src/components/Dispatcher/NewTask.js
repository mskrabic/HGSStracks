import React, {Component} from 'react'
import DispatcherMap from '../Maps/DispatcherMap'
import {Form, Button} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'
import axios from 'axios'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class NewTask extends Component {
    constructor(props) {
        super(props)
        //console.log(props)
        this.state={
            korimespasilac: this.props.match.params.rescuerId,
            sifakcija: this.props.match.params.actionId,
            nazivzadatak: "Dođi do lokacije",
            komentar: "",
            akcija: undefined
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleTask = this.handleTask.bind(this)
        this.setClickLocation = this.setClickLocation.bind(this)
        this.setStart = this.setStart.bind(this)
        this.setDest = this.setDest.bind(this)
    }

    componentDidMount() {
        axios.post(URL + "/akcijadata", {
            sifakcija: this.state.sifakcija
        }).then(res => {
            this.setState({
                akcija: res.data
            })
        })
    }

    handleChange(event){
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    setClickLocation(position) {
        this.setState({
            position: position
        })
    }

    setStart(position) {
        this.setState({
            start: position
        })
    }

    setDest(position) {
        this.setState({
            dest: position
        })
    }


    handleTask(event){
        event.preventDefault()
        let korimedispecer = localStorage.getItem("user")
        let zadatak = this.state.nazivzadatak !== "Prođi rutom" ? {
            nazivzadatak: this.state.nazivzadatak,
            korimedispecer: korimedispecer,
            korimespasilac: this.state.korimespasilac,
            sifakcija: this.state.sifakcija,
            komentar: this.state.komentar,
            lokacijasirina: this.state.position.lat,
            lokacijaduzina: this.state.position.lng,
            pocetnalokacijasirina: null,
            pocetnalokacijaduzina: null,
        } :
        {
            nazivzadatak: this.state.nazivzadatak,
            korimedispecer: korimedispecer,
            korimespasilac: this.state.korimespasilac,
            sifakcija: this.state.sifakcija,
            komentar: this.state.komentar,
            lokacijasirina: this.state.dest.lat,
            lokacijaduzina: this.state.dest.lng,
            pocetnalokacijasirina: this.state.start.lat,
            pocetnalokacijaduzina: this.state.start.lng
        }
        //console.log(zadatak)
        axios.post(URL + `/createzadatak`, zadatak)
            .then(() => {
                this.setState({
                    redirect: true
                })
            })
    }

    render() {
        if (this.state.redirect) {
            return (<Redirect to={{pathname:`/action/${this.state.akcija.sifakcija}`}} />)
        }
        return (
            <div>
                {this.state.akcija !== undefined ? <DispatcherMap functional={true} akcija={this.state.akcija} setPosition={this.setClickLocation} setStart={this.setStart} setDest={this.setDest}/> : null}
                <Form onSubmit={this.handleTask}>
                    <Form.Group controlId="nazivzadatak">
                        <Form.Label>Zadatak</Form.Label>
                        <Form.Control as="select"
                                    name="nazivzadatak"
                                    placeholder="Naziv zadatka"
                                    value={this.state.nazivzadatak}
                                    onChange={this.handleChange}
                                    required>
                            <option>Dođi do lokacije</option>
                            <option>Prođi rutom</option>
                            <option>Postavi privremenu postaju</option>
                            <option>Osvježi zalihe u privremenoj postaji</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="komentar">
                        <Form.Label>Komentar</Form.Label>
                        <Form.Control type="text"
                                    name="komentar"
                                    placeholder="Komentar"
                                    value={this.state.komentar}
                                    onChange={this.handleChange}
                                    required/>
                    </Form.Group>

                    <Button variant="primary" type="submit">Unesi zadatak</Button>
                </Form>
                <div>Zadatcima osim "Prođi rutom" dovoljno je postaviti početnu lokaciju. Završna se ignorira.</div>
            </div>
        )
    }
}