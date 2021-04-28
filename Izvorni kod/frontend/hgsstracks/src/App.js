import NavigationBar from './components/NavigationBar'
import Welcome from './components/Welcome'
import Login from './components/Login'
import Logout from './components/Logout'
import Register from './components/Register'
import Profile from './components/Profile'
import EditUser from './components/EditUser'
import Dispatcher from './components/Dispatcher/Dispatcher'
import UserList from './components/Admin/UserList'
import Action from './components/Dispatcher/Action'
import Administrator from './components/Admin/Administrator'
import Leader from './components/Voditelj/Leader'
import EditWays from './components/Voditelj/EditWays'
import NewRescuer from './components/Voditelj/NewRescuer'
import SpasilacMap from './components/Maps/SpasilacMap'
import OngoingActions from './components/Dispatcher/OngoingActions'
import FinishedActions from './components/Dispatcher/FinishedActions'
import StanicaList from './components/Stanica/StanicaList'
import ActionManagement from './components/Dispatcher/ActionManagement'
import ListSpasioci from './components/Stanica/ListSpasioci'
import NewTask from './components/Dispatcher/NewTask'
import RequestBackup from './components/Dispatcher/RequestBackup'
import CurrentAction from './components/Spasilac/CurrentAction'
import ActiveRequests from './components/Spasilac/ActiveRequests'

import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {useState} from 'react'



const PrivateRoute = ({Component, role, requiredRoles, ...rest}) => {
  return (
   <Route {...rest} render={props => requiredRoles.includes(role) ? (<Component {...props}/>) :
      (<Redirect to={{pathname: '/', state: {from: props.location}}}/>)

   }/>
  )
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("user") === null ? false : true)
  const admin = ["Admin"]
  const dispatcher = ["Dispecer"]
  const adminDispatcher = ["Admin", "Dispecer"]
  const user = ["Spasilac"]
  const adminUser = ["Spasilac", "Admin"]
  const adminDispatcherUser = ["Admin", "Dispecer", "Spasilac"]

    return (
      <Router>
        <NavigationBar {...{loggedIn}} />
        <Container>
              <Switch>
                <Route path="/" exact component={Welcome} />
                <Route exact path='/login' render={
                          () => <Login {...{setLoggedIn}} />
                  } />
                <Route path="/register" exact component={Register} />
                <Route exact path='/logout' render={
                          () => <Logout {...{setLoggedIn}} />
                  } />
                {/*Admin routes */}  
                <PrivateRoute  path="/users" exact role={localStorage.getItem("role")} requiredRoles={admin} Component = {UserList} />
                <PrivateRoute path="/adminPage" exact role={localStorage.getItem("role")} requiredRoles={admin} Component={Administrator} />
                
                
                
                {/*User*/}
                <PrivateRoute path="/requestlist" exact role={localStorage.getItem("role")} requiredRoles={user} Component={ActiveRequests} />
                <PrivateRoute path="/leader" exact role={localStorage.getItem("role")} requiredRoles={user} Component={Leader}/>
                <PrivateRoute path="/leaderAddRescuer" exact role={localStorage.getItem("role")} requiredRoles={user} Component={NewRescuer}/>
                <PrivateRoute path="/rescuerMap" exact role={localStorage.getItem("role")} requiredRoles={user} Component={SpasilacMap} />
                <PrivateRoute path="/leader/:username" role={localStorage.getItem("role")} requiredRoles={adminUser} Component={EditWays}/>
                <PrivateRoute path="/currentaction/:username" role={localStorage.getItem("role")} requiredRoles={adminUser} Component={CurrentAction} />
                
                {/*Admin or dispatcher*/}
                <PrivateRoute path="/finishedActions" exact role={localStorage.getItem("role")} requiredRoles={adminDispatcher} Component={FinishedActions} />
                <PrivateRoute path="/stationList" exact role={localStorage.getItem("role")} requiredRoles={adminDispatcher} Component={StanicaList} />
                
                {/*Admin or dispatcher or user*/}
                <PrivateRoute path="/ongoingActions" exact role={localStorage.getItem("role")} requiredRoles={adminDispatcherUser} Component={OngoingActions} />
                <PrivateRoute path="/user/:username" role={localStorage.getItem("role")} requiredRoles={adminDispatcherUser} Component={Profile} />
                <PrivateRoute path="/editUser/:username" role={localStorage.getItem("role")} requiredRoles={adminDispatcherUser} Component={EditUser} />

                {/*Dispatcher */}
                <PrivateRoute path="/dispatch" exact role={localStorage.getItem("role")} requiredRoles={dispatcher} Component={Dispatcher}/>
                <PrivateRoute path="/newAction" exact role={localStorage.getItem("role")} requiredRoles={dispatcher} Component={Action} />
                <PrivateRoute path="/stationRescuersList" exact role={localStorage.getItem("role")} requiredRoles={dispatcher} Component={ListSpasioci} />
                <PrivateRoute path="/action/:actionId" role={localStorage.getItem("role")} requiredRoles={dispatcher} Component={ActionManagement} />
                <PrivateRoute path="/requestbackup/:actionId" role={localStorage.getItem("role")} requiredRoles={dispatcher} Component={RequestBackup}/>
                <PrivateRoute path="/newtask/:rescuerId/:actionId" role={localStorage.getItem("role")} requiredRoles={dispatcher} Component={NewTask} />
              </Switch>
        </Container>
      </Router>
    );
   
}
