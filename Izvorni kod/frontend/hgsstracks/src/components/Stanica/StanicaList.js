import React from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import {Link} from 'react-router-dom'
import Administrator from '../Admin/Administrator';
import NewStanica from './NewStanica';
import EditStanica from './EditStanica'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class StanicaList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            stanice: [],
            redirect: false,
            createNewStanica: false,
            editStanica: false,
            sifstanicaToEdit: ""
        }
        this.getStanice = this.getStanice.bind(this);
        this.returnToAdminPage = this.returnToAdminPage.bind(this);
        this.createNewStanica = this.createNewStanica.bind(this);
        this.deleteStanica = this.deleteStanica.bind(this);
        this.editStanica = this.editStanica.bind(this);
    }

    getStanice(){
        axios.get(URL + "/stanicalist")
            .then(res => {
                let arr = [];
                let i = 0;
                for (var k of res.data){
                    arr[i++] = k;
                }
                this.setState({stanice: arr});
            });
    }

    componentDidMount(){
        this.getStanice();
    }

    returnToAdminPage(){
        this.setState({redirect: true})
    }

    createNewStanica(){
        this.setState({createNewStanica: true})
    }

    editStanica(event){
        this.setState({
            sifstanicaToEdit: event.target.getAttribute('idstanica'),
            editStanica: true
        })
    }

    deleteStanica(event){
        let stanica = {
            sifstanica: event.target.getAttribute('datastanica')
        }
        axios.post(URL + "/deletestanica", stanica)
            .then(() => this.getStanice()) 
    }

    render(){
        if(this.state.redirect){
            return(
                <Administrator />
            )
        }

        if(this.state.createNewStanica){
            return(
                <NewStanica />
            )
        }

        if(this.state.editStanica){
            return(
                <EditStanica sifstanica = {this.state.sifstanicaToEdit} />
            )
        }
        
        const cellStyle = {
            textAlign: 'center',
            verticalAlign: 'middle'
        }
        const stanice = this.state.stanice.sort((s1, s2) => s1.sifstanica-s2.sifstanica)
        let i = 0;
        let liststanice = "";
        let button = "";
        if(localStorage.getItem('role') === "Admin"){
            button = <Button onClick={this.createNewStanica}>Dodaj novu stanicu</Button>
            liststanice = stanice.map((stanica) =>
                <tr key={i++}>
                    <td style={cellStyle}>{stanica.nazivstanica}</td>
                    <td style={cellStyle}>{stanica.sifstanica}</td>
                    <td style={cellStyle}>{stanica.korimevoditelj}</td>
                    <td style={cellStyle}>
                        <Button variant='warning' idstanica={stanica.sifstanica} onClick={this.editStanica}>Uredi stanicu</Button>
                    </td>
                    <td style={cellStyle}>
                        <Button variant='danger' datastanica={stanica.sifstanica} onClick={this.deleteStanica}>Obriši stanicu</Button>
                    </td>
                </tr>
            )
        }
        else{
            button = <p></p>
            liststanice = stanice.map((stanica) =>
                <tr key={i++}>
                    <td style={cellStyle}>{stanica.nazivstanica}</td>
                    <td style={cellStyle}>{stanica.sifstanica}</td>
                    <td style={cellStyle}>{stanica.korimevoditelj}</td>
                    <td style={cellStyle}>
                        <Link to={
                            {pathname:'/stationRescuersList',
                                    sifstanica: stanica.sifstanica}}>
                            <Button>
                                Popis spasioca u stanici
                            </Button>
                        </Link>
                    </td>
                </tr>
            )
        }
        return(
            <div>
                <Table style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <thead>
                        <tr>
                            <th>Naziv stanice</th>
                            <th>Šifra stanice</th>
                            <th>Korisničko ime voditelja stanice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {liststanice}
                    </tbody>
                </Table>
                <Button onClick={this.returnToAdminPage}>Vrati se natrag</Button>
                {' '}
                {button}
            </div>
        )
    }
}