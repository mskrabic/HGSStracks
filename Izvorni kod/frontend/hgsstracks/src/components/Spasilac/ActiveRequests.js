import React, {Component} from 'react'
import axios from 'axios'
import {Button, Table, Row, Col, Jumbotron} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class ActiveRequests extends Component {
    constructor() {
        super()
        this.state = {
            zahtjevi: undefined,
        }

        this.findActions = this.findActions.bind(this)
        this.joinAction = this.joinAction.bind(this)
    }

    componentDidMount() {
        axios.post(URL + "/spasilacdata", {
            korisnickoime: localStorage.getItem("user")
        }).then(res => {
            if (res.data.siftrenutneakcije === null) {
                let spasilac = {
                    korisnickoime: res.data.korisnickoime,
                    sifstanica: res.data.sifstanica
                }
                axios.post(URL + "/zahtjevispasioca", spasilac)
                    .then(res2 => {
                        this.setState({
                            zahtjevi: res2.data
                        })
                        this.findActions();
                    })       
            }
        })
    }

    findActions() {
        let mojiNacini = []
        axios.post(URL + "/spasilacnacinlist", {
            korisnickoime: localStorage.getItem("user")
        }).then(res => {
            mojiNacini = res.data.map(n => n.sifnacin)
            let zahtjevaneAkcije = this.state.zahtjevi.filter(z => mojiNacini.includes(z.sifnacin)).map(z => z.sifakcija)
            console.log(zahtjevaneAkcije)
            axios.get(URL + "/akcijalist")
            .then(res => {
                let akcije = res.data;
                akcije = akcije.filter(a => a.status==="U_tijeku" && zahtjevaneAkcije.includes(a.sifakcija))
                this.setState({
                    akcije: akcije
                })
            })
        })
    }

    joinAction(event){
        axios.post(URL + "/spasilacdata", {
            korisnickoime: event.target.getAttribute("datauser")
        }).then(res => {
            let updatedRescuer = {
                dostupan: res.data.dostupan,
                korisnickoime: res.data.korisnickoime,
                lokacijaduzina: res.data.lokacijaduzina,
                lokacijasirina: res.data.lokacijasirina,
                sifstanica: res.data.sifstanica,
                siftrenutneakcije: res.data.siftrenutneakcije,
            }
            updatedRescuer.siftrenutneakcije = event.target.getAttribute("dataakcija")
            axios.post(URL + "/updatespasilac", updatedRescuer)
                .then(this.setState({
                    reload: true,
                    joinedAction: updatedRescuer.siftrenutneakcije
                }))
        }
        )
    }

    render() {
        const cellStyle = {
            textAlign: 'center',
            verticalAlign: 'middle'
        }
        let i = 0;
        if (this.state.zahtjevi === undefined)
            return <div> Već sudjelujete u akciji</div>
        
        if (this.state.reload) {
            return <Redirect to="/" />
        }
        if (this.state.akcije !== undefined && this.state.akcije.length > 0 ) {
        let listAkcije = this.state.akcije.map(akcija => (
            <tr key={i++}>
                <td style={cellStyle}>{akcija.sifakcija}</td>
                <td style={cellStyle}>{akcija.nazivakcija}</td>
                <td style={cellStyle}>{akcija.korimedispecer}</td>
                <td style={cellStyle}>
                    <Button variant='success' 
                            dataakcija={akcija.sifakcija} 
                            datauser={localStorage.getItem('user')}
                            onClick={this.joinAction}>
                        Odazovi se na akciju!
                    </Button>
                </td>
            </tr>
        ))
        return (
            <Table style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <thead>
                        <tr>
                            <th>Šifra akcije</th>
                            <th>Naziv akcije</th>
                            <th>Zahtjev poslao</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listAkcije}
                    </tbody>
             </Table>
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
                            <h1>Nema aktivnih zahtjeva za Vas!</h1>
                        </Jumbotron>
                    </Col>
                </Row> 
            )
        }
    }
}