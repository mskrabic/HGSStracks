import React, {Component} from 'react'
import {Card, Button, ButtonGroup, ListGroup} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import DispatcherMap from '../Maps/DispatcherMap'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class ActionManagement extends Component {
    constructor(props) {
        super(props)
        this.state= {
            rescuers: null,
            sifakcija: this.props.match.params.actionId
        }
        this.listRescuers = this.listRescuers.bind(this)
        this.removeRescuer = this.removeRescuer.bind(this)
        this.addTask = this.addTask.bind(this)
        this.closeAction = this.closeAction.bind(this)
        this.requestBackup = this.requestBackup.bind(this)
    }

    componentDidMount() {
        axios.post(URL + "/akcijadata", {
            sifakcija: this.state.sifakcija
        }).then(res => {
            this.setState({
                akcija: res.data
            })
            //console.log(this.state.akcija)
        })
    }

    listRescuers() {
        axios.post(URL + "/currentaction", {
            sifakcija: this.state.sifakcija
        }).then(res => {
            this.setState({
                rescuers: res.data
            })
            //console.log(this.state.rescuers)
        })
    }


    closeAction() {
        let akcija = this.state.akcija
        akcija.status = "Zavrsena"
        axios.put(URL + "/updateakcija", akcija)
            .then(()  => {
                this.setState({
                    redirect:true
                })
            }) 
    }


    removeRescuer(event) {
        let rescuerData = this.state.rescuers.filter((r) => r.korisnickoime === event.target.getAttribute("rescuerdata"))[0]
        let rescuer = {
            korisnickoime: rescuerData.korisnickoime,
            sifstanica: rescuerData.sifstanica,
            dostupan: rescuerData.dosutpan,
            siftrenutneakcije: null,
            lokacijasirina: rescuerData.lokacijasirina,
            lokacijaduzina: rescuerData.lokacijaduzina
        }
        axios.post(URL + "/updatespasilac", rescuer)
        .then(() => {
            this.setState({
                rescuers: this.state.rescuers.filter((r) => r.korisnickoime !== rescuer.korisnickoime),
                updateMap: true
            })
        })
    }

    addTask(event) {
        let rescuer = this.state.rescuers.filter((r) => r.korisnickoime === event.target.getAttribute("rescuerdata"))[0]
        this.setState({
            addTask: true,
            targetRescuer: rescuer
        })
    }

    requestBackup() {
        this.setState({
            requestBackup: true
        })
    }
    render() {
        if (this.state.requestBackup === true) {
            //console.log(this.state.sifakcija)
            return <Redirect to={{
                pathname: `/requestbackup/${this.state.sifakcija}`
            }}/>
        }
        if (this.state.addTask === true) {
            return <Redirect to={{
                pathname: `/newtask/${this.state.targetRescuer.korisnickoime}/${this.state.sifakcija}`
            }} />
        }
        if (this.state.redirect === true) {
            return <Redirect to={{
                pathname: '/dispatch'
            }} />
        }
        let i = 0;
        let activeRescuers = this.state.rescuers === null ? null : <ListGroup.Item key={i}>Na ovoj akciji nema aktivnih spasioca.</ListGroup.Item>;     
        if (this.state.rescuers !== null && this.state.rescuers.length > 0) {
 
            activeRescuers = this.state.rescuers.map((r) => 
                <ListGroup.Item key = {i++}>
                    {r.korisnickoime}
                    <ButtonGroup style={{float: "right"}}>
                        <Button variant="warning" rescuerdata={r.korisnickoime} onClick={this.addTask}>Zadaj zadatak spasiocu</Button>
                        <Button variant="danger" rescuerdata={r.korisnickoime} onClick={this.removeRescuer}>Ukloni spasioca s akcije</Button>
                    </ButtonGroup>
                </ListGroup.Item>)
        }
        return (
            <div>
                {this.state.akcija !== undefined ?
                <div>
                    <h1>{this.state.akcija.nazivakcija}</h1>
                    <p>{this.state.akcija.infnestalaosoba}</p>
                    <DispatcherMap akcija={this.state.akcija} functional={false} updateMap={this.state.updateMap}/> 
                </div>        
                : null }
                {this.state.akcija !== undefined && this.state.akcija.osobapronadena ? 
                <Card>
                    <Card.Header></Card.Header>
                    <Card.Body>
                        <Card.Title>Osoba pronađena!</Card.Title>
                        <Card.Text>
                            Spasioci su Vam dojavili da je osoba pronađena. Želite li zatvoriti akciju?
                        </Card.Text>
                        <Button onClick={this.closeAction}>Zatvori akciju</Button>
                    </Card.Body>
                </Card> : null}
            <Card>
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Title>Potrebno još spasioca?</Card.Title>
                    <Card.Text>
                        Dojavite slobodnim spasiocima da su potrebni.
                    </Card.Text>
                    <Button onClick={this.requestBackup}>Pošalji zahtjev za još spasioca</Button>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header></Card.Header>
                <Card.Body>
                    <Card.Title>Trenutno aktivni spasioci</Card.Title>
                    <Card.Text>
                        Pregledajte spasioce koji sudjeluju na ovoj akciji.
                    </Card.Text>
                    <Button onClick={this.listRescuers}>Prikaži popis spasioca na ovoj akciji</Button>
                    <ListGroup>
                        {activeRescuers}
                    </ListGroup>
                </Card.Body>  
            </Card>                     
            </div>
        )
    }
}