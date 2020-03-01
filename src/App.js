/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './components/Login/Login'
import Navigation from './components/navigation/Navigation'
import Profil from './components/profil/Profil'
import AddLead from './components/add-lead/AddLead'
import Home from './components/home/Home';
import NotFound from './components/not-found/NotFound';
import EditPerson from './components/edit/editPerson/EditPerson'
import EditCompany from './components/edit/editCompany/EditCompany'



function App() {

  return (
    <div>
      {(Cookies.get('signedin')) ? <Navigation /> : null}
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Home} />
        <Route exact path="/edit-person/:id" render={EditPerson} />
        <Route exact path="/edit-company/:id" render={EditCompany} />
        <Route path="/add-lead" component={AddLead} />
        <Route path="/profil" component={Profil} />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
