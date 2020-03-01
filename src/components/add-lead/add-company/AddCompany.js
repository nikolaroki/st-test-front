/* eslint-disable no-useless-escape */
/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { InputGroup,Button, H4 ,Alert} from "@blueprintjs/core";
import { useForm } from 'react-hook-form';
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';

const ADD_COMPANY = gql`
  mutation addCompany($input: CompanyInput) {
    addCompany(input: $input) {
        id
    company_name
    contact_person
    address
    phone
    email
    website
    category
    status
    }
  }
`;

const GET_COMPANIES = gql`
  query GetCompanies {
        companies{
          id
          company_name
          contact_person    
          website
          phone
          email
          address 
          category    
        }
      }
`;



const AddCompany = (props) => {

  const [showConfirmAdded, setShowConfirmAdded] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [addCompany] = useMutation(ADD_COMPANY,
    {
      update(cache, { data: { addCompany } }) {
        const { companies } = cache.readQuery({ query: GET_COMPANIES });
        cache.writeQuery({
          query: GET_COMPANIES,
          data: { companies: companies.concat([addCompany]) },
        });
      }
    }
    );

  const onSubmit = d => {
    const companyInput = { id:0, ...d, status: 1, category: "NEW" };
    addCompany({
      variables: {
        input: companyInput
      }
    }); 
    setShowConfirmAdded(true);
  }
  const confirmAddedClosedHandler = () => {
    props.history.push('/')
  }

  const confirmAdded = (
    <Alert
      isOpen={showConfirmAdded}
      canOutsideClickCancel
      canEscapeKeyCancel
      onClose={confirmAddedClosedHandler}

    >
      <p>
        Company added!
      </p>
    </Alert>
  )






  return (
    <div style={{ display: "flexbox", width: "70%", margin: "0 auto", border: "1px black solid", padding: "10px" }}>
      {confirmAdded}
      <form onSubmit={handleSubmit(onSubmit)}>
        <H4>Company Name:</H4>
        <InputGroup
          name="company_name"
          inputRef={register({
            maxLength: { value: 40, message: 'max number of characters is 40' },
            required: 'Company name is required'
          })}
          large
          placeholder="Enter company name..."
          type="text"

        />
        <span style={{ color: "red" }}>{errors.company_name && errors.company_name.message}</span>

        <H4>Contact Person :</H4>
        <InputGroup
          large
          inputRef={register({
            maxLength: { value: 40, message: 'max number of characters is 40' },
            required: 'Contact person is required'
          })}
          name="contact_person"
          placeholder="Enter contact person..."
          type="text"
        />
        <span style={{ color: "red" }}>{errors.contact_person && errors.contact_person.message}</span>

        <H4>Address:</H4>
        <InputGroup
          large
          inputRef={register({
            required: 'Address is required'
          })}
          name="address"
          placeholder="Enter Address..."
          type="text"
        />
        <span style={{ color: "red" }}>{errors.address && errors.address.message}</span>

        <H4>Phone:</H4>
        <InputGroup
          large
          inputRef={register({
            pattern: {
              value: /^\d{9}$/,
              message: 'Incorect number format'
            },
            required: 'Phone number is requeired'
          })}
          name="phone"
          placeholder="Enter Phone Number..."
          type="text"
        />
        <span style={{ color: "red" }}>{errors.phone && errors.phone.message}</span>

        <H4>Email:</H4>
        <InputGroup
          large
          inputRef={register({
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: 'Email format not correct'
            },
            required: 'Email is requeired'
          })}
          name="email"
          placeholder="Enter Email..."
          type="text"

        />
        <span style={{ color: "red" }}>{errors.email && errors.email.message}</span>

        <H4>Website:</H4>
        <InputGroup
          large
          inputRef={register({
            required: 'Website is required'
          })}
          name="website"
          placeholder="Enter website..."
          type="text"
        />
        <span style={{ color: "red" }}>{errors.website && errors.website.message}</span>
        
        <Button type="submit" style={{marginTop:"10px"}} intent="success">Submit</Button>
      </form>
    </div>




  )
}

export default withRouter(AddCompany);