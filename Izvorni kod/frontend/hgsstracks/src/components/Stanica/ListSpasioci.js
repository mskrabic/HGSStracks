import React, {Component} from 'react'
import axios from 'axios'
import {Table, Image} from 'react-bootstrap';

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class UserList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            korisnici: [],
            korisnickoime: "",
            sifstanica: props.location.sifstanica
        }
        this.getUsers = this.getUsers.bind(this);
    }

    getUsers(){
            let stanica = {
                sifstanica: this.state.sifstanica
            }
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
                //console.log(this.state)
            })
    }

    componentDidMount(){
        this.getUsers();
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
        const spasioci = this.state.korisnici
        let i = 0;
        const listSpasioci = spasioci.map((spasilac) =>
            <tr key={i++}>
                <td>
                    <Image src={spasilac.korisnik.urlslika}  style={imageStyle}/>
                </td>
                <td style={cellStyle}>{spasilac.korisnik.ime}</td>
                <td style={cellStyle}>{spasilac.korisnik.prezime}</td>
                <td style={cellStyle}>{spasilac.dostupan === false ? "nedostupan" : "dostupan"}</td>
            </tr>
        )
        return(
            <Table style={{textAlign: 'center', verticalAlign: 'middle'}}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Dostupnost</th>
                    </tr>
                </thead>
                <tbody>
                    {listSpasioci}
                </tbody>
            </Table>
        )
    }
}