import React from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default function NavigationBar(props) { 
    if (props.loggedIn === false) {
            return (
                <Navbar bg="dark" variant="dark">
                    <Link to="/" className="navbar-brand">HGSStracks</Link>
                    <Nav className="mr-auto">
                        <Link className="nav-link" to="/">Početna</Link>
                        <Link className="nav-link" to="/login">Prijavi se</Link>
                        <Link className="nav-link" to="/register">Registracija</Link>
                    </Nav>
                </Navbar>
            );
    } else {
        let status = localStorage.getItem("status")
        if (status === "Zahtjev_poslan") {
            return (
                <Navbar bg="dark" variant="dark">
                    <Link to="/" className="navbar-brand">HGSStracks</Link>
                    <Nav className="mr-auto">
                        <Link className="nav-link" to="/">Početna</Link>
                        <Link className="nav-link" to={`/user/${localStorage.getItem("user")}`}>Profil</Link>
                        <Link className="nav-link" to="/logout">Odjava</Link>
                    </Nav>
                </Navbar>
            );
        } else {
            let role = localStorage.getItem("role")
            if (role === 'Spasilac') {
                return (
                    <Navbar bg="dark" variant="dark">
                        <Link to="/" className="navbar-brand">HGSStracks</Link>
                        <Nav className="mr-auto">
                            <Link className="nav-link" to="/">Početna</Link>
                            <Link className="nav-link" to={`/user/${localStorage.getItem("user")}`}>Profil</Link>
                            <Link className="nav-link" to="/leader">Upravljanje stanicom</Link>
                            <Link className="nav-link" to="/ongoingActions">Akcije u tijeku</Link>
                            <Link className="nav-link" to={`/currentaction/${localStorage.getItem("user")}`}>Trenutna akcija</Link>
                            <Link className="nav-link" to={`/requestlist`}>Zahtjevi za spasiocima</Link>
                            <Link className="nav-link" to="/logout">Odjava</Link>
                        </Nav>
                    </Navbar>
                );
            } else if (role === 'Admin') {
                return (
                    <Navbar bg="dark" variant="dark">
                        <Link to="/" className="navbar-brand">HGSStracks</Link>
                        <Nav className="mr-auto">
                            <Link className="nav-link" to="/">Početna</Link>
                            <Link className="nav-link" to={`/adminPage`}>AdminPage</Link>
                            <Link className="nav-link" to="/finishedActions">Završene akcije</Link>
                            <Link className="nav-link" to="/ongoingActions">Akcije u tijeku</Link>
                            <Link className="nav-link" to="/logout">Odjava</Link>
                        </Nav>
                    </Navbar>
                )
            } else if (role === 'Dispecer') {
                return (
                    <Navbar bg="dark" variant="dark">
                        <Link to="/" className="navbar-brand">HGSStracks</Link>
                        <Nav className="mr-auto">
                            <Link className="nav-link" to="/">Početna</Link>
                            <Link className="nav-link" to={`/user/${localStorage.getItem("user")}`}>Profil</Link>
                            <Link className="nav-link" to="/dispatch">Dispatch</Link>
                            <Link className="nav-link" to="/stationList">Prikaži stanice</Link>
                            <Link className="nav-link" to="/logout">Odjava</Link>
                        </Nav>
                    </Navbar>
                )
            }
        }        

        }
}