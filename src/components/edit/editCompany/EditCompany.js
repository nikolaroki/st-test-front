/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
/* eslint-disable radix */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { Spinner, Intent, InputGroup,Button, H4, Alert } from "@blueprintjs/core";
import { useForm, } from 'react-hook-form';
import { gql } from "apollo-boost";
import { useMutation, useQuery } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';


const GET_COMPANY = gql`
  query getCompany($id:Int) {
    getCompany(id:$id){
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

const EDIT_COMPANY = gql`
  mutation EditCompany($id:Int!, $input: CompanyInput) {
    editCompany(id:$id, input: $input) {
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


const EditCompany = (props) => {

    if (!Cookies.get('signedin')) {
        props.history.push('/login');
    }

    let { id } = props.match.params;
    id = parseInt(id);



    const [company, setCompany] = useState({
        company_name: "",
        contact_person: "",
        address: "",
        phone: "",
        email: "",
        website: ""
    });

    const { register, handleSubmit, errors } = useForm();

    const [showConfirmAdded, setShowConfirmAdded] = useState(false);
    const [formDataLoaded, setFormDataLoaded] = useState(false);



    const { data, loading, error } = useQuery(GET_COMPANY, {
        variables: { id }
    });

    const [editCompany] = useMutation(EDIT_COMPANY);


    if (loading) return <Spinner intent={Intent.PRIMARY} />;
    if (error) return <p>ERROR</p>;
    if (!data) return <p>Not found</p>;
    if (!data.getCompany) return <p>Not found</p>
    const { company_name,
        contact_person,
        address,
        phone,
        email,
        website } = data.getCompany;

    if (!formDataLoaded) {
        setCompany(
            {
                company_name,
                contact_person,
                address,
                phone,
                email,
                website
            });
        setFormDataLoaded(true);
    }


    const onSubmit = d => {
        const companyInput = { id: 0, ...d, status: data.getCompany.status, category: data.getCompany.category };
        editCompany({
            variables: {
                id,
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
          Company updated!
        </p>
      </Alert>
    )






    return (
      <div style={{ display: "flexbox", width: "70%", margin: "0 auto", border: "1px black solid", padding: "10px", marginTop: "50px" }}>

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
            defaultValue={company.company_name}
          />
          <span style={{ color: "red" }}>{errors.company_name && errors.company_name.message}</span>

          <H4>Contact Person :</H4>
          <InputGroup
            large
            defaultValue={company.contact_person}
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
            defaultValue={company.address}
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
            defaultValue={company.phone}
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
            defaultValue={company.email}
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
            defaultValue={company.website}
            inputRef={register({
                        required: 'Website is required'
                    })}
            name="website"
            placeholder="Enter website..."
            type="text"
          />
          <span style={{ color: "red" }}>{errors.website && errors.website.message}</span>

          <Button type="submit" intent="success" style={{marginTop:"10px"}}>Submit</Button>
        </form>
        {confirmAdded}
      </div>




    )

}



export default withRouter(EditCompany);