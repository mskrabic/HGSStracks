import React, {Component} from 'react'
import axios from 'axios'
import {Form, Button} from 'react-bootstrap'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class NewRescuer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            korimenoviclan: "",
            spasioci: [],
            sifstanica: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.getRescuers = this.getRescuers.bind(this);
    }

    getRescuers(){
        axios.get(URL + "/spasilaclist")
        .then(res => {
            let arr = [];
            let i = 0;
            for (var k of res.data) {
                if(k.sifstanica === null){
                    arr[i++] = k;
                }
            }
            this.setState({
                spasioci: arr,
                korimenoviclan: arr[0] !== undefined ? arr[0].korisnickoime : ""
            })
        })
    }

    componentDidMount(){
        let username = localStorage.getItem("user")
        let spasilac = {
            korisnickoime: username
        }
        //console.log(spasilac.korisnickoime)
        axios.post(URL + "/spasilacdata", spasilac)
        .then(res => {
            //console.log(res.data)
            this.setState({
                sifstanica: res.data.sifstanica
            })
        })
        this.getRescuers();
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleEdit(event){
        event.preventDefault();
        let spasilac = {
            korisnickoime: this.state.korimenoviclan
        }
        if (spasilac.korisnickoime !== null && spasilac.korisnickoime !== undefined && spasilac.korisnickoime != "") {
            axios.post(URL + "/spasilacdata", spasilac)
            .then(res =>{
                let data = {
                    dostupan: res.data.dostupan,
                    korisnickoime: res.data.korisnickoime,  
                    lokacijaduzina: res.data.lokacijaduzina,
                    lokacijasirina: res.data.lokacijasirina,
                    sifstanica: this.state.sifstanica,
                    siftrenutneakcije: res.data.siftrenutneakcije
                }
                axios.post(URL + "/updatespasilac", data)
                .then(() => {
                    this.setState({
                        spasioci: this.state.spasioci.filter(s => s.korisnickoime !== this.state.korimenoviclan),
                        reload: true
                    })
                })
            })
        }
    }

    render(){
 
        let i = 0
        let listSpasioci;
        if (this.state.spasioci.length === 0) {
            listSpasioci = <option key = {i}>Nema spasilaca koji ne pripadaju nijednoj stanici.</option>
        } else {
            listSpasioci = this.state.spasioci.map(s => <option key={i++}>{s.korisnickoime}</option>)
        }
        //console.log(this.state.korimenoviclan)
        return(
            <div>
            <Form onSubmit={this.handleEdit}>
                <Form.Group controlId="korimenoviclan">
                    <Form.Label>Odaberite novog člana</Form.Label>
                    <Form.Control as="select"
                        name="korimenoviclan"
                        value={this.state.korimenoviclan}
                        onChange={this.handleChange}
                        required>
                            {listSpasioci}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">Prihvati promjene</Button>
            </Form>
            {this.state.reload ? <div style={{color: "green"}}> Uspješno ste dodali spasioca {this.state.korimenoviclan} u Vašu stanicu. </div> : null}
            </div>
        )
    }
}