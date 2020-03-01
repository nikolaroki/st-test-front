import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router-dom';


import { Navbar, Button, Alignment, Alert, Classes, Drawer, Position, H3 } from "@blueprintjs/core";

import classes from './Navigation.module.css'

const Navigation = (props) => {

  const [showLogutMenu, setShowLogutMenu] = useState(false);
  const [showGoodBye, setShowGoodBye] = useState(false);
  const [isSidedrawerOpen, setIsSidedrawerOpen] = useState(false)


  const logoutHandlerOpen = () => {
    setShowLogutMenu(true);
  }
  const logoutHandlerClosed = () => {
    setShowLogutMenu(false);
  }

  const confirmLogoutHandler = () => {
    setShowGoodBye(true);
    Cookies.remove('signedin');
    Cookies.remove('role');
    Cookies.remove('jwt');
  }

  const goodByeHandlerClosed = () => {
    setShowGoodBye(false);
    props.history.push('/login');
  }


  const goodByeMssg = (
    <Alert
      isOpen={showGoodBye}
      canOutsideClickCancel
      canEscapeKeyCancel
      onClose={goodByeHandlerClosed}

    >
      <p>
        Thank you for using our Lead application.
      </p>
    </Alert>
  )

  const logoutMenu = (
    <Alert
      confirmButtonText="Okay"
      isOpen={showLogutMenu}
      onClose={logoutHandlerClosed}
      canOutsideClickCancel
      canEscapeKeyCancel
      onConfirm={confirmLogoutHandler}
    >
      <p>
        Are you sure you want to logout?
      </p>
    </Alert>
  )

  const toHome = () => {
    props.history.push('/');
  }
  const toProfil = () => {
    props.history.push('/profil');
  }

  const toAddLead = () => {
    props.history.push('/add-lead');
  }

  const handleOpen = () => setIsSidedrawerOpen(true);
  const handleClose = () => setIsSidedrawerOpen(false);


  /*  */


  return (
    <div>

      <Navbar style={{ backgroundColor: "#b6d94c"}}>
        <div className={classes.Mobile}><Button onClick={handleOpen} minimal icon="menu" /></div>
        <div className={classes.Desktop}>
          <Navbar.Group align={Alignment.RIGHT}>
            <Navbar.Heading><strong>Lead App</strong></Navbar.Heading>
            <Navbar.Divider />
            <Button className={Classes.MINIMAL} icon="home" text="Home" onClick={toHome} />
            <Button className={Classes.MINIMAL} icon="add" text="Add Lead" onClick={toAddLead} />
            <Button className={Classes.MINIMAL} icon="person" text="Profil" onClick={toProfil} />
            <Button className={Classes.MINIMAL} icon="log-out" text="Logout" onClick={logoutHandlerOpen} />
          </Navbar.Group>
        </div>
      </Navbar>
          
      {logoutMenu}
      {goodByeMssg}
      <Drawer
        icon="menu"
        onClose={handleClose}
        title="LEAD APPLICATION"
        autoFocus
        canEscapeKeyClose
        canOutsideClickClose
        enforceFocus
        hasBackdrop
        isOpen={isSidedrawerOpen}
        position={Position.LEFT}
        usePortal
        size="70%"
      >
        <div className={Classes.DRAWER_BODY}>
          <div className={Classes.DIALOG_BODY}>
            <H3>Lead App</H3>
            <Button className={Classes.MINIMAL} icon="home" text="Home" onClick={toHome} />
            <br />
            <Button className={Classes.MINIMAL} icon="add" text="Add Lead" onClick={toAddLead} />
            <br />
            <Button className={Classes.MINIMAL} icon="person" text="Profil" onClick={toProfil} />
            <br />
            <Button className={Classes.MINIMAL} icon="log-out" text="Logout" onClick={logoutHandlerOpen} />
          </div>
        </div>
        <div className={Classes.DRAWER_FOOTER}>Salestrekker</div>
      </Drawer>
    </div>
  )
}

export default withRouter(Navigation);