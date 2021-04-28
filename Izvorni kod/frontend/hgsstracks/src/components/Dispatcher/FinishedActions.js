import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';
import {Table, Button} from 'react-bootstrap'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class FinishedActions extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            akcije: [],
            redirect: false
        }
        this.redirect = this.redirect.bind(this)
        this.getActions = this.getActions.bind(this)
        this.closeAction = this.closeAction.bind(this)
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

    render() {
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
        const cellStyle = {
            textAlign: 'center',
            verticalAlign: 'middle'
        }
        let zavrseneAkcije = this.state.akcije;
        let i = 0;
        const listAkcije = zavrseneAkcije.filter((akcija) => akcija.status === "Zavrsena").map((akcija) =>
            <tr key={i++}>
                <td style={cellStyle}>{akcija.sifakcija}</td>
                <td style={cellStyle}>{akcija.nazivakcija}</td>
                <td style={cellStyle}>{akcija.status}</td>
            </tr>
        )
        return(
            <div>
                <h1>Završene akcije</h1>
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