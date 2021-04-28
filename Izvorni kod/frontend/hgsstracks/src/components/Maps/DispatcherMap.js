import React, {useState} from 'react'
import {Marker, Popup, MapContainer, TileLayer, useMapEvents} from 'react-leaflet'
import L from 'leaflet'
import rescuer from '../../icons/firefighter.png'
import axios from 'axios'

const URL = "https://hgsstracks-backend.herokuapp.com/api"
//const URL = "http://localhost:8080/api"

function rescuerIcon(iconSize) {
    return L.icon({
        iconUrl: rescuer,
        iconSize: [iconSize]
    });
}

function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

function ClickLocation(props) {
    const [position, setPosition] = useState(null)  
    const [startAdded, setStartAdded] = useState(false)
    const [destAdded, setDestAdded] = useState(false)
    //console.log(props)
    let setStart = props.setStart
    let setDest = props.setDest
    const map = useMapEvents({
        click(e) {
            if (props.functional !== true) {
                // do nothing
            } else {
                var container = L.DomUtil.create('div'),
                startBtn = createButton('Start from this location', container),
                destBtn = createButton('Go to this location', container);
    
                let startMarker = L.marker()
                let destMarker = L.marker()
                L.DomEvent.on(startBtn, 'click', function() {
                    setStart(e.latlng)
                    props.setPosition(e.latlng)
                    setPosition(e.latlng)
                    if (!startAdded) {
                        setStartAdded(true)
                        startMarker.setLatLng(e.latlng).addTo(map)
                    } else {
                        alert("Već ste postavili početnu točku!")
                    }   
                    map.closePopup()
                });
                L.DomEvent.on(destBtn, 'click', function() {
                    //console.log(e.latlng)
                    setDest(e.latlng)
                    if (!destAdded) {
                        setDestAdded(true)
                        destMarker.setLatLng(e.latlng).addTo(map)
                    } else {
                        alert("Već ste postavili odredišnu točku!")
                    }  
                    map.closePopup()
                });
        
                L.popup()
                    .setContent(container)
                    .setLatLng(e.latlng)
                    .openOn(map);
            }
        }
    })

    return null;
    
}

export default class DispatcherMap extends React.Component {
    constructor(props) {
        super()
        //console.log(props)
        this.state= {
            zadaci: [],
            rescuers: [],
            position: undefined,
            akcija: props.akcija
        }
        this.listRescuers = this.listRescuers.bind(this)
        //console.log(this.state.akcija)
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

    componentDidMount(){
        this.listRescuers()
    }

    render(){
        const spasioci = this.state.rescuers
        let i = 0
        const spasiociList = spasioci.filter(s => s.lokacijasirina !== null & s.lokacijaduzina !== null).map(spasioc =>
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

        return (
                <MapContainer center={[45.815399, 15.966568]} zoom={9} style={{ margin: 20, height: 300, width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {spasiociList}
                    <ClickLocation functional={this.props.functional} setPosition={this.props.setPosition} setStart={this.props.setStart} setDest={this.props.setDest}/>
                </MapContainer>
        )
    }
}