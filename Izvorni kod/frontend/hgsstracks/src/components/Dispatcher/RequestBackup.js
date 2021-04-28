import React, {Component} from 'react'
import axios from 'axios'
import {Button, Table, Form} from 'react-bootstrap'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

    var nacini = new Map();
    nacini.set("Pješke", 1);
    nacini.set("Bicikl", 2);
    nacini.set("Pas", 3);
    nacini.set("Dron", 4);
    nacini.set("Auto", 5);
    nacini.set("Brod", 6);
    nacini.set("Helikopter", 7);

export default class RequestBackup extends Component {
    
    constructor(props) {
        super()
        this.state = {
            stanice : {},
            sifakcija: props.match.params.actionId,
            nacin: "",
            sifnacin: 1
        }
        this.sendRequest = this.sendRequest.bind(this)
        this.showRequestForm = this.showRequestForm.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    
    componentDidMount() {
        axios.get(URL + "/countavailable")
            .then(res => {
                this.setState({
                    stanice: res.data
                })
            })
    }

    sendRequest(event) {
        event.preventDefault()
        let nazivstanica = this.state.requestedStanica
        let sifstanica;
        axios.get(URL + "/stanicalist")
            .then(res => {
                sifstanica = res.data.filter(s => s.nazivstanica === nazivstanica)[0].sifstanica
                //console.log(sifstanica)
                let request = {
                    sifakcija: this.state.sifakcija,
                    sifstanica: sifstanica,
                    sifnacin: this.state.sifnacin
                }
                //console.log(request)
                axios.post(URL + "/createzahtjev", request)
                .then(() => {
                    this.setState({
                        reload: true,
                        requestForm: false,
                        duplicate: false
                    })
                },
                () => {
                    this.setState({
                        duplicate: true,
                        reload: false
                    })
                })
            })
    }

    showRequestForm(event) {
        this.setState({
            requestForm: true,
            requestedStanica: event.target.getAttribute("stanicadata")
        })
    }

    handleChange(event) {
        console.log(event.target.name)
        this.setState({
            [event.target.name] : event.target.value,
            sifnacin: nacini.get(event.target.value)
        })
    }

    render() {
        let stanice = []
        for (var key in this.state.stanice) {
            let stanica = {}
            stanica.nazivstanica = key;
            stanica.count = this.state.stanice[key]
            stanice.push(stanica)
        }
        let i = 0;
        const cellStyle = {
            textAlign: 'center',
            verticalAlign: 'middle'
        }
        let listStanice = stanice.filter(s => s.count !== 0).map(stanica =>
            <tr key={i++}>
                <td style={cellStyle}>{stanica.nazivstanica}</td>
                <td style={cellStyle}>{stanica.count}</td>
                <td style={cellStyle}><Button variant="warning" stanicadata={stanica.nazivstanica} onClick={this.showRequestForm}>Pošalji zahtjev</Button></td>
            </tr>
        )
        //console.log(this.state)
        return (
            <div>
                <Table style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <thead>
                        <tr>
                            <th>Naziv stanice</th>
                            <th>Broj dostupnih spasioca</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listStanice}
                    </tbody>
                </Table>
                {this.state.requestForm === true ? 
                <Form onSubmit={this.sendRequest}>
                    <Form.Group controlId="nacin">
                        <Form.Label>Nacin spasavanja</Form.Label>
                        <Form.Control as="select"
                                    name="nacin"
                                    placeholder="Način sudjelovanja"
                                    value={this.state.nacin}
                                    onChange={this.handleChange}
                                    required>
                            <option>Pješke</option>
                            <option>Pas</option>
                            <option>Bicikl</option>
                            <option>Auto</option>
                            <option>Dron</option>
                            <option>Helikopter</option>
                            <option>Brod</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">Pošalji</Button>
                </Form> : null}
                {this.state.reload === true ?
                <div style={{color: "green"}}> Zahtjev uspješno poslan. </div>
                : null}
                {this.state.duplicate === true ?
                <div style={{color: "red"}}> Takav zahtjev ste već poslali. </div>
                : null}
            </div>
        )
    }
}