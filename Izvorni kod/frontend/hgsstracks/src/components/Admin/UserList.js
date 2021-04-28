import React, {Component} from 'react'
import axios from 'axios'
import {Button, Table, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class UserList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            korisnici: [{
                ime: "",
                prezime: "",
                email: "",
                brojmob: "",
                uloga: "",
                korisnickoime: ""
            }]
        }
        this.getUsers = this.getUsers.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    getUsers(){
        axios.get(URL + "/userlist")
        .then(res => {
            let arr = [];
            let i = 0;
            for (var k of res.data) {
                arr[i++] = k;
            }
            arr = arr.filter(u => u.status === 'Registriran' && u.uloga !== 'Admin').sort((a, b) => a.korisnickoime <= b.korisnickoime ? -1 : 1)
            this.setState({korisnici: arr})
            console.log(this.state)
        })
    }

    componentDidMount(){
        this.getUsers();
    }

    deleteUser(event) {
        let username = {
            korisnickoime: event.currentTarget.getAttribute("datakorisnik")
        }
        axios.post(URL + "/deletekorisnik", username)
        .then(() => this.getUsers())
    }

    render(){
        const imageStyle = {
            width: '200px',
            height: '200px',
            //backgroundPosition: 'center',
            //backgroundRepeat: 'no-repeat',
            //backgroundSize: 'cover',
            //margin: 'auto',
            objectFit: 'cover'
        };
        const cellStyle = {
            textAlign: 'center',
            verticalAlign: 'middle'
        }
        const korisnici = this.state.korisnici
        let i = 0;
        const listKorisnici = korisnici.map((korisnik) =>
            <tr key={i++}>
                <td>
                    <Image src={korisnik.urlslika}  style={imageStyle}/>
                </td>
                <td style={cellStyle}>{korisnik.ime}</td>
                <td style={cellStyle}>{korisnik.prezime}</td>
                <td style={cellStyle}>{korisnik.email}</td>
                <td style={cellStyle}>{korisnik.brojmob}</td>
                <td style={cellStyle}>{korisnik.uloga}</td>
                <td style={cellStyle}>
                    <Link to={`/editUser/${korisnik.korisnickoime}`}>
                        <Button variant="warning">
                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                        </Button>
                    </Link>
                </td>
                <td style={cellStyle}>
                    <Button variant="danger" datakorisnik={korisnik.korisnickoime} onClick={this.deleteUser}>
                        <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                    </Button>
                </td>
            </tr>
        )
        return(
            <Table style={{textAlign: 'center', verticalAlign: 'middle'}}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>E-mail</th>
                        <th>Mobitel</th>
                        <th>Uloga</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {listKorisnici}
                </tbody>
            </Table>
        )
    }
}