import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

export default class Logout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            korisnickoime : props.korisnickoime
        }
    }
    componentDidMount() {
        navigator.geolocation.clearWatch(localStorage.getItem("locationId"));
        localStorage.removeItem("user")
        localStorage.removeItem("role")
        localStorage.removeItem("locationId")
        this.props.setLoggedIn(false)
    }
    render() {
        return <Redirect to="/" />
    }
}