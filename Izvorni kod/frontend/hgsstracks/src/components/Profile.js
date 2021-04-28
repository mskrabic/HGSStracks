import React, {Component} from 'react'
import {Button, Image, Table, Row, Col} from 'react-bootstrap'
import axios from 'axios'
import {Redirect} from 'react-router-dom'


const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            brojmob: "",
            email: "",
            ime: "",
            korisnickoime: "",
            lozinka: "",
            prezime: "",
            status: "",
            uloga: "",
            urlslika: "",
            spasilac: {}
        }
        this.getProfile = this.getProfile.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.editUser = this.editUser.bind(this);
        this.getSpasilac = this.getSpasilac.bind(this);
        this.changeAvailability = this.changeAvailability.bind(this);
    }

    getProfile() {
        //console.log(this.props.match.params.username)
        let username= {
            korisnickoime: this.props.match.params.username
        }
        axios.post(URL + "/userdata", username)
        .then(res => res.data)
        .then(data => this.setState(data))
    }
    
    getSpasilac() {
        axios.post(URL + "/spasilacdata", {
            korisnickoime: this.props.match.params.username
        })
        .then(res => {
           this.setState({
               spasilac: res.data
           })
        })
    }

    componentDidMount() {
        this.getProfile();
        if (localStorage.getItem("role") === 'Spasilac' && localStorage.getItem("status") === 'Registriran')
            this.getSpasilac();
    }


    changeAvailability() {
        let spasilac = {
            korisnickoime: this.state.spasilac.korisnickoime,
            sifstanica: this.state.spasilac.sifstanica,
            dostupan: !this.state.spasilac.dostupan,
            siftrenutneakcije: this.state.spasilac.siftrenutneakcije,
            lokacijasirina: this.state.spasilac.lokacijasirina,
            lokacijaduzina: this.state.spasilac.lokacijaduzina
        }
        if (spasilac.siftrenutneakcije !== null && spasilac.dostupan === true) {
            this.setState({
                forbidden: true
            })
        } else {
            axios.post(URL + "/updatespasilac", spasilac)
            .then(this.setState({
                spasilac: spasilac
            }))
        }
    }
    editUser(event) {
        event.preventDefault()
        this.setState({toEdit: true})
    }

    deleteUser() {
		let username= {
            korisnickoime: this.props.match.params.username
        }
        axios.post(URL + "/deletekorisnik", username)
        .then(() => {
            if (localStorage.getItem("role") === "Admin") {
                this.setState({redirectAdmin: true})
            } else {
                this.setState({redirect: true})
            }
        })
    }
        
    render() {
        let button = localStorage.getItem("role") === 'Spasilac' ? 
            (this.state.spasilac.dostupan === true ? 
                <Button variant ="danger" onClick={this.changeAvailability}>Nisam dostupan za spašavanje!</Button>
                : <Button variant ="success" onClick={this.changeAvailability}>Dostupan sam za spašavanje!</Button>
            )
        :
            null
        if (this.state.toEdit) {
            return <Redirect push to=
            {{pathname: `/editUser/${this.state.korisnickoime}`,
            state : this.state
            }}/>
        }
        const imageStyle = {
            width: '300px',
            height: '300px',
            objectFit: 'cover'
        };
        const cellStyle = {
            textAlign: 'center',
            verticalAlign: 'middle'
        }
        if (this.state.redirect === true) {
            return <Redirect to="/logout"/>
        } else if (this.state.redirectAdmin === true) {
            return <Redirect to="/adminPage" />
        } else {
        if (this.state.uloga === "Admin") {
            return <Redirect to="/adminPage" />
        }
        if (this.state.status==='Zahtjev_poslan') {
            return (
                <Row>
                    <Col lg={12} style={
                        {textAlign: "center",
                        marginTop: "20px",
                        marginLeft: "30%"}}>
                        <div className="card flex-left" style={{width: "20rem"}}>
                            <div className="card-header text-white text-center bg-dark mb-3">
                                Pozdrav, {this.state.korisnickoime}!
                            </div>
                            <div className="card-body">
                                <p className="card-text">Vaš zahtjev čeka potvrdu administratora.</p>
                            </div>
                        </div>
                    </Col>
                </Row>   
                )
        }
        else {
            return(
                <div>
                    <Table>
                        <tbody>
                        <tr>
                            <td>
                                <Table>
                                    <tbody>
                                    <tr>
                                        <td><b>Ime:</b> {this.state.ime}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Prezime:</b> {this.state.prezime}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Korisničko ime:</b> {this.state.korisnickoime}</td>
                                    </tr>
                                    <tr>
                                        <td><b>E-mail:</b> {this.state.email}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Mobitel:</b> {this.state.brojmob}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Uloga:</b> {this.state.uloga}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </td>
                            <td style={cellStyle}>
                                <Image src={this.state.urlslika} style={imageStyle} rounded/>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                    <Button variant ="warning" onClick={this.editUser}>Uredi podatke</Button>{' '}
                    <Button variant ="danger" onClick={this.deleteUser}>Obriši račun</Button>{' '}
                    {button}
                    {this.state.forbidden ? <div style={{color:"red"}}> Već ste aktivni na nekoj akciji i ne možete se označiti dostupnim </div>: null}
                </div>
            )  
        }
    }
    }

}