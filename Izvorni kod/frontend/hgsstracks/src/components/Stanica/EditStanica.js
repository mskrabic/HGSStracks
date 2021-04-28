import React from 'react'
import { Button, Form } from 'react-bootstrap';
import axios from 'axios'
import Administrator from '../Admin/Administrator'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class EditStanica extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            sifstanica: props.sifstanica,
            nazivstanica: "",
            korimevoditelj: "",
            voditelji: [],
            redirect: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.redirect = this.redirect.bind(this)
    }

    componentDidMount() {
        let stanica = {
            sifstanica: this.state.sifstanica,
        }
        axios.post(URL + "/stanicadata", stanica)
            .then(res => {
                console.log(res.data)
                this.setState({
                    sifstanica: res.data.sifstanica,
                    nazivstanica: res.data.nazivstanica,
                    korimevoditelj: res.data.korimevoditelj === null ? "" : res.data.korimevoditelj,
                    lokacijasirina: res.data.lokacijasirina,
                    lokacijaduzina: res.data.lokacijaduzina
                })
            });
        axios.post(URL + "/availableleaders", {
            sifstanica: this.state.sifstanica
        })
        .then(res => {
            this.setState({
               voditelji: res.data
            })
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    async handleEdit(event) {
        event.preventDefault();
        let stanica = {
            sifstanica: this.state.sifstanica,
            nazivstanica: this.state.nazivstanica,
            korimevoditelj: this.state.korimevoditelj,
            lokacijaduzina: this.state.lokacijaduzina,
            lokacijasirina: this.state.lokacijasirina
        }
        let voditelj = {
            korisnickoime: this.state.korimevoditelj 
        }
        if (this.state.korimevoditelj === "") {
            if (this.state.voditelji.length > 0) {
                stanica.korimevoditelj = this.state.voditelji[0].korisnickoime
                voditelj.korisnickoime = this.state.voditelji[0].korisnickoime
            } else {
                stanica.korimevoditelj = null
                voditelj.korisnickoime = null
            }
        }

        console.log("STANICA")
        console.log(stanica) 
        axios.put(URL + "/updatestanica", stanica)
            .then(() => {
                this.redirect()
            })
            .then(() => {
                if (voditelj.korisnickoime !== null) {
                    axios.post(URL + "/spasilacdata", voditelj)
                        .then(res => res.data)
                        .then(data =>{
                            data.sifstanica = stanica.sifstanica
                            delete data.korisnik["authorities"]
                            //console.log(data)
                            axios.post(URL + "/updatespasilac", data)
                            })
                }
            }
            )
        }

    redirect() {
        this.setState({
            redirect: true
        })
    }

    render(){
        let i = 0
        let listVoditelji = this.state.voditelji.map(v => <option key={i++}>{v.korisnickoime}</option>)
        if (listVoditelji.length === 0 && this.state.korimevoditelj === "") {
            listVoditelji = <option>Nema dostupnih spasilaca.</option>
        }

        if(this.state.redirect){
            return(
                <Administrator />
            )
        }

        return(
            <div>
                <Form onSubmit={this.handleEdit}>
                    <Form.Group controlId="sifstanica">
                        <Form.Label>Šifra stanice</Form.Label>
                        <Form.Control
                            type="id"
                            name="sifstanica"
                            value={this.state.sifstanica}
                            onChange={this.handleChange}
                            required
                            />
                    </Form.Group>

                    <Form.Group controlId="nazivstanica">
                        <Form.Label>Naziv stanice</Form.Label>
                        <Form.Control
                            type="name"
                            name="nazivstanica"
                            value={this.state.nazivstanica}
                            onChange={this.handleChange}
                            required
                            />
                    </Form.Group>

                    <Form.Group controlId="korimevoditelj">
                        <Form.Label>Voditelj stanice</Form.Label>
                        <Form.Control as="select"
                            name="korimevoditelj"
                            value={this.state.korimevoditelj}
                            onChange={this.handleChange}
                            required>
                                {this.state.korimevoditelj === "" ? listVoditelji : <option>{this.state.korimevoditelj}</option>}
                                {this.state.korimevoditelj === "" ? null : listVoditelji}
                        </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit">Prihvati promjene</Button>
                </Form>
                <hr></hr>
                <Button onClick={this.redirect}>Vrati se natrag na pregled stanica</Button>
            </div>
        )
    }
}