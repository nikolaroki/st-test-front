/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Intent, H2, Card, Alert, Position, Toaster } from '@blueprintjs/core';
import classes from './Person.module.css'

const toaster = Toaster.create({
  position: Position.TOP
});

const Person = (props) => {

  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);



  const showToast = () => {
    toaster.show({ message: "Person successfully deleted.", intent: Intent.DANGER, });
  }

  const handleDeleteOpen = () => setIsOpenDeleteAlert(true);
  const handleDeleteConfirm = () => {
    setIsOpenDeleteAlert(false);
    showToast();
    props.deletePerson();
  }
  const handleDeleteCancel = () => setIsOpenDeleteAlert(false);


  const deleteConfirm = (
    <Alert
      cancelButtonText="Cancel"
      confirmButtonText="Move to Trash"
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpenDeleteAlert}
      onCancel={handleDeleteCancel}
      onConfirm={handleDeleteConfirm}
      canEscapeKeyCancel
      canOutsideClickCancel
    >
      <p>
        Are you sure you want to move the lead <b>{props.first_name} {props.last_name}</b> to Trash?
      </p>
    </Alert>
  )

  return (



    <Card
      interactive
      elevation="1"
      className={classes.Person}
      style={{ backgroundColor: "rgb(216, 196, 169)" }}

    >
      {deleteConfirm}
      <H2>{props.first_name} {props.last_name}</H2>
      <p>Gender: <strong> {props.gender}</strong></p>
      <p>Address: <strong> {props.address}</strong></p>
      <p>Mobile: <strong> {props.mobile}</strong></p>
      <p>Email: <strong> {props.email}</strong></p>
      <Button intent={Intent.PRIMARY} minimal onClick={props.editPerson}>Edit Details</Button>
      {(Cookies.get('role') === 'ADMIN') ? <Button intent={Intent.DANGER} minimal onClick={handleDeleteOpen}>Delete</Button> : null}
    </Card>



  );
}


export default Person;


