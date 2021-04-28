import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';
import {Table, Button} from 'react-bootstrap'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class OngoingActions extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            akcije: [],
            redirect: false,
            editAction: false
        }
        this.redirect = this.redirect.bind(this)
        this.getActions = this.getActions.bind(this)
        this.closeAction = this.closeAction.bind(this)
        this.actionDetails = this.actionDetails.bind(this)
        this.joinAction = this.joinAction.bind(this)
    }

    componentDidMount() {
        this.getActions()
    }

    redirect(){
        this.setState({
            redirect: true
        })
    }

    getActions(){
        axios.get(URL + "/akcijalist")
            .then(res => {
                this.setState({
                    akcije: res.data
                })
            })
    }

    closeAction(event) {
        let akcija;
        axios.post(URL + "/akcijadata", {
            sifakcija: event.target.getAttribute("dataakcija")
        }).then(res => {
            akcija = res.data
            akcija.status = "Zavrsena"
            axios.put(URL + "/updateakcija", akcija)
            .then(()  => this.redirect())
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

    actionDetails(event) {
        this.setState({
            actionToEdit: event.target.getAttribute("dataakcija"),
            editAction: true
        })
    }

    render() {
        if (this.state.editAction) {
            return <Redirect to={{
                pathname: `/action/${this.state.actionToEdit}`
            }} />
        }
        let role = localStorage.getItem('role')
        if(role === 'Admin' && this.state.redirect){
            return(
                <Redirect to ="/adminPage"/>
            )
        }
        else if(role === 'Dispecer' && this.state.redirect){
            return(
                <Redirect to="/dispatch"/>
            )
        }
        else if(role === 'Spasilac' && this.state.redirect){
            return(
                <Redirect to='/rescuerMap'/>
            )
        }
        const cellStyle = {
            textAlign: 'center',
            verticalAlign: 'middle'
        }
        let zavrseneAkcije = this.state.akcije;
        let i = 0;
        const listAkcije = zavrseneAkcije.filter((akcija) => akcija.status === "U_tijeku")
        .map((akcija) =>
            <tr key={i++}>
                <td style={cellStyle}>{akcija.sifakcija}</td>
                <td style={cellStyle}>{akcija.nazivakcija}</td>
                <td style={cellStyle}>{akcija.status}</td>
                {localStorage.getItem("role") === 'Dispecer' ?
                <td style={cellStyle}>
                    <Button variant='success' dataakcija={akcija.sifakcija} onClick={this.closeAction}>Zatvori akciju</Button>{' '}
                    <Button variant='warning' dataakcija={akcija.sifakcija} onClick={this.actionDetails}>Detalji akcije</Button>
                </td>
                : null}
                {localStorage.getItem("role") === 'Spasilac' ?
                <td style={cellStyle}>
                    <Button variant='success' 
                            dataakcija={akcija.sifakcija} 
                            datauser={localStorage.getItem('user')}
                            onClick={this.joinAction}>
                        Prijavi se na akciju
                    </Button>
                    {this.state.reload && akcija.sifakcija === this.state.joinedAction ? <div style={{color: "green"}}>Uspješno ste se prijavili na akciju</div> : null}
                </td>
                : null}
            </tr>
        )
        return(
            <div>
                <h1>Akcije u tijeku</h1>
                <Table style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <thead>
                        <tr>
                            <th>Sifra akcije</th>
                            <th>Naziv akcije</th>
                            <th>Status akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listAkcije}
                    </tbody>
                </Table>
                <Button onClick={this.redirect}>Vrati se natrag</Button>
            </div>
        )
    }
}