import React, {Component} from 'react'
import axios from 'axios'
import {Button, Table, Jumbotron, Row, Col, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class UserList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            korisnici: [],
            korisnickoime: "",
            sifstanica: ""
        }
        this.getUsers = this.getUsers.bind(this);
    }

    getUsers(){
        let username = localStorage.getItem("user")
        let spasilac = {
            korisnickoime: username
        }
        axios.post(URL + "/spasilacdata", spasilac)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                this.setState({
                    sifstanica: data.sifstanica
                })
            })
            .then(() => {
                let stanica = {
                    sifstanica: this.state.sifstanica
                }
                if (stanica.sifstanica !== null && stanica.sifstanica !== undefined) {
                    axios.post(URL + "/stanicaSpasilacList", stanica.sifstanica, {headers:{
                        'content-type': 'text/plain'
                    }})
                    .then(res => {
                        let arr = [];
                        let i = 0;
                        for (var k of res.data) {
                            arr[i++] = k;
                        }
                        this.setState({korisnici: arr})
                       // console.log(this.state)
                    })
                }
            })
    }

    componentDidMount(){
        axios.get(URL + "/leaderlist")
            .then(res => {
                if (!res.data.includes(localStorage.getItem("user")))
                    this.setState({
                        forbidden : true
                    })
            })   
        this.getUsers();
    }

    render(){
        if (this.state.forbidden) {
            let jumbotron = {
                textAlign: "center",
                marginTop: "20px"
            }
            return (
                <Row>
                    <Col lg={12} style={jumbotron}>
                        <Jumbotron className="bg-dark text-white">
                            <h1>Pozdrav, {localStorage.getItem("user")}!</h1>
                            <p>
                                Niste voditelj Vaše stanice i nemate pristup ovoj stranici.
                            </p>
                        </Jumbotron>
                    </Col>
            </Row>    
            )
        }
        const cellStyle = {
            textAlign: 'center',
            verticalAlign: 'middle'
        }
        const imageStyle = {
            width: '200px',
            height: '200px',
            //backgroundPosition: 'center',
            //backgroundRepeat: 'no-repeat',
            //backgroundSize: 'cover',
            //margin: 'auto',
            objectFit: 'cover'
        };
        const spasioci = this.state.korisnici
        let i = 0;
        const listSpasioci = spasioci.map((spasilac) =>
            <tr key={i++}>
                <td>
                    <Image src={spasilac.korisnik.urlslika}  style={imageStyle}/>
                </td>
                <td style={cellStyle}>{spasilac.korisnik.ime}</td>
                <td style={cellStyle}>{spasilac.korisnik.prezime}</td>
                <td style={cellStyle}>
                    <Link to={`/leader/${spasilac.korisnickoime}`}>
                        <Button variant="warning">
                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                        </Button>
                    </Link>
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
                        <th>
                            <Link to={`/leaderAddRescuer`}>
                                <Button variant="primary">Novi spasioc</Button>
                            </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {listSpasioci}
                </tbody>
            </Table>
        )
    }
}