import React from 'react'
import {Form, Button} from 'react-bootstrap'
import axios from 'axios'
import Administrator from '../Admin/Administrator'
import { OpenStreetMapProvider } from 'leaflet-geosearch';
const provider = new OpenStreetMapProvider();

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class NewStanica extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            sifstanica: "",
            nazivstanica: "",
            korimevoditelj: "",
            adresastanica: "",
            voditelji: [],
            redirect: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleNewStanica = this.handleNewStanica.bind(this)
    }

    componentDidMount() {
        const form = document.querySelector('form');
        const input = form.querySelector('input[name="adresastanica"]');

        form.addEventListener('submit', (event) => this.handleNewStanica(event, input.value))

        axios.get(URL + "/availableleadersall")
            .then(res => {
                this.setState({
                    voditelji: res.data,
                    korimevoditelj: res.data[0] !== undefined ? res.data[0].korisnickoime : ""
                })
            })          
    }

    async handleNewStanica(event, value) {
        event.preventDefault()
        if (value !== undefined) {
            const results = await provider.search({ query: value })
            let stanica = {
                sifstanica: this.state.sifstanica,
                nazivstanica: this.state.nazivstanica,
                korimevoditelj: this.state.korimevoditelj,
                lokacijasirina: results[0].y,
                lokacijaduzina: results[0].x
            }
           // console.log(stanica);
           axios.post(URL + "/checkstanica", stanica)
           .then(res => {
               if (res.data === true) {
                   this.setState({
                       exists: true
                   })
               } else {
                   axios.post(URL + "/createstanica", stanica)
                       .then(() => {
                           let voditelj = {
                               korisnickoime: this.state.korimevoditelj
                           }
                           axios.post(URL + "/spasilacdata", voditelj)
                           .then(res => res.data)
                           .then(data =>{
                               data.sifstanica = stanica.sifstanica
                               delete data.korisnik["authorities"]
                               //console.log(data)
                               axios.post(URL + "/updatespasilac", data)
                               .then(() => {
                                   this.setState({redirect: true})
                               })
                           })
                       })
                    }
                })
            }
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    render(){

        let i = 0
        let listVoditelji
        if (this.state.voditelji.length === 0) {
            listVoditelji = "Nema spasioca koje možete postaviti za voditelja nove stanice."
        } else {
            listVoditelji = this.state.voditelji.map(v => <option key={i++}>{v.korisnickoime}</option>)
        }
        if(this.state.redirect){
            return(
                <Administrator />
            )
        }

        return(
            <Form id="form" onSubmit={this.handleNewStanica}>
                <Form.Group controlId="sifstanica">
                    <Form.Label>Šifra stanice</Form.Label>
                    <Form.Control
                        type="id"
                        name="sifstanica"
                        maxLength="5"
                        placeholder="Unesite šifru stanice"
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
                        placeholder="Unesite naziv stanice"
                        value={this.state.nazivstanica}
                        onChange={this.handleChange}
                        required
                        />
                </Form.Group>
                
                <Form.Group controlId="adresastanica">
                    <Form.Label>Adresa stanice</Form.Label>
                    <Form.Control
                        type="input"
                        name="adresastanica"
                        placeholder="Unesite adresu stanice"
                        value={this.state.adresastanica}
                        onChange={this.handleChange}
                        required
                        />
                </Form.Group>
                {this.state.voditelji.length > 0 ?
                    <Form.Group controlId="korimevoditelj">
                        <Form.Label>Voditelj stanice</Form.Label>
                        <Form.Control as="select"
                            name="korimevoditelj"
                            placeholder="Voditelj stanice"
                            defaultValue={this.state.korimevoditelj}
                            onClick={this.handleChange}
                            required>
                            {listVoditelji}
                        </Form.Control>
                    </Form.Group>
                 :
                 <div style={{color: "red"}}>{listVoditelji}</div>}
                <Button variant="primary" type="submit" onClick={this.redirect} >Dodaj novu stanicu</Button>
                {this.state.exists === true ? <div style={{color: "red"}}>Stanica s tom šifrom već postoji.</div> : null}
            </Form>
        )
    }
}