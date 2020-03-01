/* eslint-disable react/destructuring-assignment */
import React,{ useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Intent, H2, Card ,Alert,Position, Toaster} from '@blueprintjs/core';

import classes from './Company.module.css'

const toaster = Toaster.create({
  position: Position.TOP
});


const Company = (props) => {

  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);



const showToast = () => {
  toaster.show({ message: "Company successfully deleted." ,intent: Intent.DANGER,});
}

  const handleDeleteOpen = () => setIsOpenDeleteAlert(true);
  const handleDeleteConfirm = () => {
    setIsOpenDeleteAlert(false);
    showToast();
    props.deleteCompany();
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
        Are you sure you want to move the lead <b>{props.company_name}</b> to Trash? 
      </p>
    </Alert>
  )


  return (

    <Card interactive elevation="1" className={classes.Company} style={{ backgroundColor: "rgb(216, 196, 169)" }}>
      {deleteConfirm}
      <H2>
        {props.company_name}
      </H2>
      <p>Contact Person: <strong> {props.contact_person}</strong></p>
      <p>Address: <strong> {props.address}</strong></p>
      <p>Phone: <strong> {props.phone}</strong></p>
      <p>Email: <strong> {props.email}</strong></p>
      <p>Website: <strong> {props.website}</strong></p>
      <Button intent={Intent.PRIMARY} minimal onClick={props.editCompany}>Edit Details</Button>
      {(Cookies.get('role')==='ADMIN') ? <Button intent={Intent.DANGER} minimal onClick={handleDeleteOpen}>Delete</Button> : null}
    </Card>
  );
}


export default Company;
