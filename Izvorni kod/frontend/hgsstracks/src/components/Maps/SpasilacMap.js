import React, {useState} from 'react'
import {Marker, Popup, MapContainer, TileLayer, Polyline, useMapEvents} from 'react-leaflet'
import L from 'leaflet'
import task from '../../icons/pin.png'
import camp from '../../icons/camping.png'
import rescuer from '../../icons/firefighter.png'
import comment from '../../icons/comment.png'
import location from '../../icons/location.png'
import tent from '../../icons/tent.png'
import axios from 'axios'

import polyline from 'polyline'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

function taskIcon(iconSize) {
    return L.icon({
        iconUrl: task,
        iconSize: [iconSize]
    });
}

function campIcon(iconSize) {
    return L.icon({
        iconUrl: camp,
        iconSize: [iconSize]
    });
}

function tempCamp(iconSize) {
    return L.icon({
        iconUrl: tent,
        iconSize: [iconSize]
    });
}

function rescuerIcon(iconSize) {
    return L.icon({
        iconUrl: rescuer,
        iconSize: [iconSize]
    });
}

function commentIcon(iconSize) {
    return L.icon({
        iconUrl: comment,
        iconSize: [iconSize]
    });
}

function locationIcon(iconSize) {
    return L.icon({
        iconUrl: location,
        iconSize: [iconSize]
    });
}

function ClickLocation(props) {
    const [position, setPosition] = useState(null)
    
    const map = useMapEvents({
        click(e) {
            props.func(e.latlng)
            setPosition(e.latlng)
        }
    })

    return position === null ? null : (
      <Marker position={position} icon={locationIcon(20)}>
        <Popup>You are here</Popup>
      </Marker>
    )
}
export class SpasilacMap extends React.Component {
    constructor(props) {
        super()
        this.state= {
            zadaci: [],
            rescuers: [],
            position: undefined,
            positions: [[]],
            akcija: props.akcija,
            stanice: [],
            comments: [],
            tempStations: [],
            updateMap: props.updateMap
        }
        this.getTasks = this.getTasks.bind(this)
        //this.setClickLocation = this.setClickLocation.bind(this)
        this.listRescuers = this.listRescuers.bind(this)
        this.getStanice = this.getStanice.bind(this)
        this.getComments = this.getComments.bind(this)
        this.getTempStations = this.getTempStations.bind(this)
        this.getRoutes = this.getRoutes.bind(this)
    }
    getTasks(){
        let spasioc = {
            korisnickoime: localStorage.getItem("user")
        }
        axios.post(URL + "/zadacispasioca", spasioc)
        .then(res => {
            let arr = [];
            let i = 0;
            for (var k of res.data) {
                arr[i++] = k;
            }
            this.setState({
                zadaci: arr,
                routes: arr.filter(zadatak => zadatak.nazivzadatak === "Prođi rutom")})
            this.getRoutes()
        })
    }

    getRoutes() {
        let arr = []
        let routeInfo = []
        for (let i = 0; i < this.state.routes.length; i++) {
                let route = this.state.routes[i]
                axios.get(`
                https://router.project-osrm.org/route/v1/foot/${route.pocetnalokacijaduzina},${route.pocetnalokacijasirina};${route.lokacijaduzina},${route.lokacijasirina}`)
                .then(res => {
                    arr[i] = polyline.decode(res.data.routes[0].geometry)
                    routeInfo[i] = route.komentar
                    this.setState({
                        positions: arr,
                        routeInfo: routeInfo
                    })
                })
        }
        

    }
    listRescuers() {
        axios.post(URL + "/currentaction", {
            sifakcija: this.state.akcija.sifakcija
        }).then(res => {
            this.setState({
                rescuers: res.data
            })
        })
    }

    getStanice(){
        axios.get(URL + "/stanicalist")
        .then(res => {
            let arr = [];
            let i = 0;
            for (var k of res.data) {
                arr[i++] = k;
            }
            this.setState({stanice: arr})
        })
    }

    getComments(){
        axios.post(URL + "/akcijakomentari", {
            sifakcija: this.state.akcija.sifakcija
        }).then(res => {
            this.setState({
                comments: res.data
            })
        })
    }

    getTempStations(){
        axios.post(URL + "/akcijapostaje", {
            sifakcija: this.state.akcija.sifakcija
        }).then(res => {
            this.setState({
                tempStations: res.data
            })
        })
    }

    componentDidMount(){
        this.getTasks()
        this.listRescuers()
        this.getStanice()
        this.getComments()
        this.getTempStations()
    }

    render(){
        const zadaci = this.state.zadaci
        let i = 0;
        const zadaciList = zadaci.filter(zadatak => zadatak.nazivzadatak !== "Prođi rutom").map(zadatak => 
            <Marker key = {i++}
                position={[
                    zadatak.lokacijasirina,
                    zadatak.lokacijaduzina
                ]}
                icon={taskIcon(20)}
            >
                <Popup>
                    <p>{zadatak.komentar}</p>
                </Popup>
            </Marker>
        )
        let polylines = null;
        if (this.state.positions !== undefined && this.state.routeInfo !== undefined) {
            let idx  = 0;
            polylines = this.state.positions.map(p => 
            <Polyline key={i++} positions={p} color = "red">
            <Popup>{this.state.routeInfo[idx++]}</Popup>
            </Polyline>)
        }
        
        const spasioci = this.state.rescuers
        const spasiociList = spasioci.filter(s => s.lokacijasirina !== null && s.lokacijaduzina !== null).map(spasioc =>
            <Marker key = {i++}
                position={[
                    spasioc.lokacijasirina,
                    spasioc.lokacijaduzina
                ]}   
                icon={rescuerIcon(20)}
            >
                <Popup>
                    <p>{spasioc.korisnickoime}</p>
                </Popup>
            </Marker>
        )

        const stanice = this.state.stanice
        const staniceList = stanice.filter(s => s.lokacijasirina !== null && s.lokacijaduzina !== null).map(stanica =>
            <Marker key = {i++}
                position={[
                    stanica.lokacijasirina,
                    stanica.lokacijaduzina
                ]}   
                icon={campIcon(20)}
            >
                <Popup>
                    <p>{stanica.nazivstanica}</p>
                </Popup>
            </Marker>
        )

        const komentari = this.state.comments
        const komentariList = komentari.map(komentar =>
            <Marker key = {i++}
                position={[
                    komentar.lokacijasirina,
                    komentar.lokacijaduzina
                ]}   
                icon={commentIcon(20)}
            >
                <Popup>
                    <p>{komentar.komentar}</p>
                </Popup>
            </Marker>
        )

        const tempStations = this.state.tempStations
        const tempStationsList = tempStations.map(temp =>
            <Marker key = {i++}
                position={[
                    temp.lokacijasirina,
                    temp.lokacijaduzina
                ]}   
                icon={tempCamp(20)}
            >
                <Popup>
                    <p>{temp.nazivpostaja}</p>
                </Popup>
            </Marker>
        )
        return (
                <MapContainer center={[45.815399, 15.966568]} zoom={9} style={{ margin: 20, height: 300, width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {zadaciList}
                    {polylines}
                    {tempStationsList}
                    {komentariList}
                    {staniceList}
                    {spasiociList}
                    <ClickLocation func={this.props.func} />
                </MapContainer>
        )
    }
}

function areEqual(prevProps, nextProps) {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
   return nextProps.updateMap !== true
  }

export default React.memo(SpasilacMap, areEqual);