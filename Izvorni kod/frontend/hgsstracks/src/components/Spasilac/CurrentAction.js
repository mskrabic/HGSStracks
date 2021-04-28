import React, {Component} from 'react'
import axios from 'axios'
import SpasilacMap from '../Maps/SpasilacMap'
import {Row, Col, Jumbotron, Card, Button, Form} from 'react-bootstrap'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class CurrentAction extends Component {

    constructor(props) {
        super(props)
        this.state= {
            akcija: undefined,
            komentar: "",
            postaja: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleComment = this.handleComment.bind(this)
        this.handleStation = this.handleStation.bind(this)
        this.handleFound = this.handleFound.bind(this)
        this.setClickLocation = this.setClickLocation.bind(this)
    }

    componentDidMount() {
        axios.post(URL + "/spasilacdata", {
            korisnickoime: this.props.match.params.username
        }).then(res => {
            if (res.data.siftrenutneakcije !== null){
                axios.post(URL + "/akcijadata", {
                    sifakcija: res.data.siftrenutneakcije
                }).then(res2 => {
                    this.setState({
                        akcija: res2.data
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

    handleComment(event){
        event.preventDefault()
        let komentar = {
            korimespasilac: this.props.match.params.username,
            sifakcija: this.state.akcija.sifakcija,
            komentar: this.state.komentar,
            lokacijaduzina: this.state.position.lng,
            lokacijasirina: this.state.position.lat
        }
        axios.post(URL + "/createkomentar", komentar)
        .then(res => {
            this.setState({
                redirect: true
            })
        })
    }

    handleStation(event){
        event.preventDefault()
        let station = {
            sifakcija: this.state.akcija.sifakcija,
            nazivpostaja: this.state.postaja,
            lokacijasirina: this.state.position.lat,
            lokacijaduzina: this.state.position.lng
        }
        axios.post(URL + "/createpostaja", station)
        .then(res => {
            this.setState({
                redirect: true
            })
        })
    }

    handleFound(){
        let akcija = this.state.akcija;
        akcija.osobapronadena = true;
        axios.put(URL + "/updateakcija", akcija)
            .then(() => {
                this.setState({
                    found: true
                })
            })
    }

    setClickLocation(position) {
        this.setState({
            position: position
        })
        
    }

    render() {
        if (this.state.redirect === true) {
               window.location.reload(true)  
        }
        if (this.state.akcija !== undefined) {
            return (
                <div>
                    <h1>Podatci o akciji:</h1>
                    <h2>{this.state.akcija.nazivakcija}</h2>
                    <p>{this.state.akcija.infnestalaosoba}</p>
                    <h1>Moji zadatci</h1>
                    <SpasilacMap akcija={this.state.akcija} func={this.setClickLocation}/>
                    <div id="map"></div>
                    <Card>
                        <Card.Header></Card.Header>
                        <Card.Body>
                            <Card.Title>Ostavljanje komentara</Card.Title>
                            <Card.Text>
                                Ostavite komentar na mapi za ostale spasioce.
                            </Card.Text>
                            <Form onSubmit={this.handleComment}>
                                <Form.Group controlId="formComment">
                                    <Form.Label>Komentar</Form.Label>
                                    <Form.Control type="text"
                                                name="komentar"
                                                placeholder="Unesite komentar" 
                                                value={this.state.komentar}
                                                onChange={this.handleChange}
                                                required />
                                </Form.Group>
                                <Button variant="primary" type="submit">Ostavi komentar</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header></Card.Header>
                        <Card.Body>
                            <Card.Title>Postavljanje privremene postaje</Card.Title>
                            <Card.Text>
                                Postavite privremenu postaju na mapi.
                            </Card.Text>
                            <Form onSubmit={this.handleStation}>
                                <Form.Group controlId="formStation">
                                    <Form.Label>Privremena postaja</Form.Label>
                                    <Form.Control type="text"
                                                name="postaja"
                                                placeholder="Unesite naziv postaje" 
                                                value={this.state.postaja}
                                                onChange={this.handleChange}
                                                required />
                                </Form.Group>
                                <Button variant="primary" type="submit">Postavi privremenu postaju</Button>
                            </Form>
                        </Card.Body>  
                    </Card>
                    {this.state.found ? <div style={{color: "green"}}>Uspješno ste dojavili dispečeru.</div> :<Card>
                        <Card.Header></Card.Header>
                        <Card.Body>
                            <Card.Title>Osoba pronađena</Card.Title>
                            <Card.Text>
                                Dojavite dispečeru da je osoba pronađena.
                            </Card.Text>
                                <Button variant="primary" type="submit" onClick={this.handleFound}>Dojavi</Button>
                        </Card.Body>  
                    </Card>}
                </div>
            )
        } else {
            const welcomeStyle = {
                textAlign: "center",
                marginTop: "20px"
              };
            return (
                <Row>
                    <Col lg={12} style={welcomeStyle}>
                        <Jumbotron className="bg-dark text-white">
                            <h1>Trenutno niste aktivni ni na jednoj akciji spašavanja.</h1>
                            <p>
                                Prijavite se na neku od akcija u tijeku ili se odazovite na poziv dispečera.
                            </p>
                        </Jumbotron>
                    </Col>
                </Row> 
            )
        }
        
        
    }
}