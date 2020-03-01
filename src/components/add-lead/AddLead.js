import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Intent, ButtonGroup, H1 } from "@blueprintjs/core";
import AddPerson from './add-person/AddPerson'
import AddCompany from './add-company/AddCompany'


const AddLead = (props) => {

  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false)


  if (!Cookies.get('signedin')) {
    props.history.push('/login');
    return null
  }

  const personButtonClicked = () => {
    setShowCompanyForm(false);
    setShowPersonForm(true);
  }

  const companyButtonClicked = () => {
    setShowPersonForm(false);
    setShowCompanyForm(true);
  }


  return (
    <>
      <H1>Add a new lead</H1>
      <ButtonGroup fill style={{ marginBottom: "50px", marginTop: "20px" }}>
        <Button icon="person" intent={Intent.PRIMARY} onClick={personButtonClicked}>Add new person</Button>
        <Button icon="office" intent={Intent.PRIMARY} onClick={companyButtonClicked}>Add new company</Button>
      </ButtonGroup>
      {showPersonForm ? <AddPerson /> : null}
      {showCompanyForm ? <AddCompany /> : null}
    </>




  )
}

export default AddLead;