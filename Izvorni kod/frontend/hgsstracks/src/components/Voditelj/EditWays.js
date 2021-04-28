import React, {Component} from 'react'
import axios from 'axios'
import {Form, Button} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

export default class EditWays extends Component {
    constructor(props) {
        super(props)
        this.state = {
            korisnickoime: this.props.match.params.username,
            naciniSpasavanja: [
                {
                    value: "Pješke",
                    sifnacin: 1,
                    isChecked: false
                },
                {
                        value: "Bicikl",
                        sifnacin: 2,
                        isChecked: false
                },
                {
                    value: "Pas",
                    sifnacin: 3,
                    isChecked: false
                },
                {
                    value: "Dron",
                    sifnacin: 4,
                    isChecked: false
                },
                {
                    value: "Auto",
                    sifnacin: 5,
                    isChecked: false
                },
                {
                    value: "Brod",
                    sifnacin: 6,
                    isChecked: false
                },
                {
                    value: "Helikopter",
                    sifnacin: 7,
                    isChecked: false
                }]
        }
        this.handleCheck = this.handleCheck.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.getWays = this.getWays.bind(this);
    }
    

    getWays(){
        axios.post(URL + "/spasilacnacinlist", {
            korisnickoime: this.state.korisnickoime
        })
        .then(res => {
            let arr = res.data;
            arr = arr.map(n => n.imenacin)
            let newNacini = this.state.naciniSpasavanja
            console.log(newNacini)
            for (let j = 0; j < this.state.naciniSpasavanja.length; j++) {
                if (arr.includes(this.state.naciniSpasavanja[j].value)) {
                    newNacini[j].isChecked = true;
                }
            }
            this.setState({
                naciniSpasavanja: newNacini
            })
        })
    }

    componentDidMount(){
        this.getWays();
    }

    handleCheck = (event) => { 
        let noviNacini = this.state.naciniSpasavanja;
        for (let i = 0; i < this.state.naciniSpasavanja.length; i++) {
            if (noviNacini[i].value === event.target.value) {
                noviNacini[i].isChecked = event.target.checked;
            }
        }
        this.setState({
            naciniSpasavanja: noviNacini
        })
    }

    handleSave(event){
        event.preventDefault()
        //console.log(this.state.naciniSpasavanja)
        let noviNacini = []
        noviNacini = this.state.naciniSpasavanja.filter(n => n.isChecked === true).map(n => n.sifnacin)
        //console.log(noviNacini)
        let arr = []
        for (let i = 0; i < noviNacini.length; i++) {
            arr[i] = {
                korimespasilac: this.state.korisnickoime,
                sifnacin: noviNacini[i]
            }
        }
        if (arr.length === 0)
            arr[0] = {
                korimespasilac: this.state.korisnickoime,
                sifnacin: null
            }
        axios.post(URL + "/updatenacini", arr)
        .then(() => {
            this.setState({
                reload: true
            })
        })
    }

    render(){
        if (this.state.reload) {
            return <Redirect to ="/leader" />
        }
        let i = 0;
        const naciniList = this.state.naciniSpasavanja.map((nacin) => 
            <Form.Check key = {i++}
                type = "checkbox"
                label = {nacin.value}
                checked = {nacin.isChecked}
                value = {nacin.value}
                onChange={this.handleCheck}
            />
        )
        return(
            <div>
                <h2>Načini spašavanja za spasioca {this.state.korisnickoime}:</h2>
                <Form onSubmit={this.handleSave}>
                    <Form.Group controlId="naciniSpasavanja">
                        {naciniList}
                    </Form.Group>
                    <Button variant="primary" type="submit">Spremi</Button>
                </Form>
            </div>
        )
    }
}