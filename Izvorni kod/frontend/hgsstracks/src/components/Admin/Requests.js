import React, {Component} from 'react'
import axios from 'axios'
import { Button, Table, Image } from 'react-bootstrap';
import Administrator from './Administrator';

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class Requests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            korisnici: [],
            redirect: false
        }
        this.getRequests = this.getRequests.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        this.returnToAdminPage = this.returnToAdminPage.bind(this);
    }

    
    getRequests(){
        axios.get(URL + "/requestsentlist")
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
        this.getRequests();
    }

    handleRequest(korisnik, prihvacen){
        if(prihvacen){
            korisnik.status = "Registriran"
			let user = {
				korisnickoime: korisnik.korisnickoime,
				email: korisnik.email,
				lozinka: korisnik.lozinka,
				ime: korisnik.ime,
				prezime: korisnik.prezime,
				brojmob: korisnik.brojmob,
				uloga: korisnik.uloga,
				status: korisnik.status,
				urlslika: korisnik.urlslika
			}
            axios.put(URL + "/updatekorisnik",user)
            //console.log('Prihvacen zahtjev za ' + korisnik.korisnickoime)
        }else{
			let username= {
				korisnickoime: korisnik.korisnickoime
			}
            axios.post(URL + "/deletekorisnik", username)
           // console.log('Odbijen zahtjev za ' + korisnik.korisnickoime)
        }
        this.setState({korisnici: this.state.korisnici.filter(function(k) { 
            return k.korisnickoime !== korisnik.korisnickoime 
        })})
    }

    returnToAdminPage(){
        this.setState({redirect: true})
    }

    render(){
        if(this.state.redirect){
            return(
                <Administrator />
            )
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
        const cellStyle = {
            textAlign: 'center',
            verticalAlign: 'middle'
        }
        const korisnici = this.state.korisnici
        let i = 0;
        const listKorisnici = korisnici.map((korisnik) =>
            <tr key={i++}>
                <td>
                    <Image src={korisnik.urlslika}  style={imageStyle} />
                </td>
                <td style={cellStyle}>{korisnik.ime}</td>
                <td style={cellStyle}>{korisnik.prezime}</td>
                <td style={cellStyle}>{korisnik.email}</td>
                <td style={cellStyle}>{korisnik.brojmob}</td>
                <td style={cellStyle}>{korisnik.uloga}</td>
                <td style={cellStyle}>
                    <Button variant="success"
                            onClick={() => this.handleRequest(korisnik, true)}>
                        Prihvati
                    </Button>
                </td>
                <td style={cellStyle}>
                    <Button variant="danger" 
                            onClick={() => this.handleRequest(korisnik, false)}>
                        Odbij
                    </Button>
                </td>
            </tr>
        )
        return(
            <div>
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
                        {korisnici.length === 0 ? <tr><td colSpan="8">Nema aktivnih zahtjeva</td></tr> : listKorisnici}
                    </tbody>
                </Table>
                <Button onClick={this.returnToAdminPage}>Vrati se natrag</Button>
            </div>
        )
    }
}