/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
/* eslint-disable radix */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { Spinner, Intent, InputGroup, RadioGroup, Radio, Button, H4, Alert } from "@blueprintjs/core";
import { useForm, } from 'react-hook-form';
import { gql } from "apollo-boost";
import { useMutation, useQuery } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

const GET_PERSON = gql`
  query GetPersons($id:Int) {
    getPerson(id:$id){
          id
          first_name
          last_name    
          gender
          mobile
          email
          address 
          category    
          status
        }
      }
`;

const EDIT_PERSON = gql`
  mutation EditPerson($id:Int!, $input: PersonInput) {
    editPerson(id:$id, input: $input) {
      id
      first_name
      last_name
      gender
      address
      mobile
      email
      category
      status
    }
  }
`;


const EditPerson = (props) => {

  if (!Cookies.get('signedin')) {
    props.history.push('/login');
}

  let { id } = props.match.params;
  id = parseInt(id);



  const [person, setPerson] = useState({
    first_name: "",
    last_name: "",
    address: "",
    mobile: "",
    email: ""
  });

  const { register, handleSubmit, errors} = useForm();

  const [showConfirmAdded, setShowConfirmAdded] = useState(false);
  const [gender, setGender] = useState("");
  const [formDataLoaded, setFormDataLoaded] = useState(false);



  const { data, loading, error } = useQuery(GET_PERSON, {
    variables: { id }
  });

  const [editPerson] = useMutation(EDIT_PERSON);


  if (loading) return <Spinner intent={Intent.PRIMARY} />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;
  if (!data.getPerson) return <p>Not found</p>
  const { first_name,
    last_name,
    address,
    mobile,
    email } = data.getPerson;
  
  if (!formDataLoaded) {
    setGender(data.getPerson.gender)
    setPerson(
      {
        first_name,
        last_name,
        address,
        mobile,
        email
      });
    setFormDataLoaded(true);
  }


  const onSubmit = d => {
    const personInput = { id: 0, ...d, gender,status: data.getPerson.status, category: data.getPerson.category };
    editPerson({
      variables: {
        id,
        input: personInput
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
        Person edited!
      </p>
    </Alert>
  )






  return (
    <div style={{ display: "flexbox", width: "70%", margin: "0 auto", border: "1px black solid", padding: "10px",marginTop:"50px" }}>

      <form onSubmit={handleSubmit(onSubmit)}>
        <H4>First Name:</H4>
        <InputGroup
          name="first_name"
          defaultValue={person.first_name}
          inputRef={register({
            maxLength: { value: 20, message: 'max number of characters is 20' },
            required: 'First name is required'
          })}
          large
          placeholder="Enter first name..."
          type="text"

        />
        <span style={{ color: "red" }}>{errors.first_name && errors.first_name.message}</span>

        <H4>Last Name:</H4>
        <InputGroup
          large
          defaultValue={person.last_name}
          inputRef={register({
            maxLength: { value: 20, message: 'max number of characters is 20' },
            required: 'Last name is required'
          })}
          name="last_name"
          placeholder="Enter last name..."
          type="text"
        />
        <span style={{ color: "red" }}>{errors.last_name && errors.last_name.message}</span>

        <H4>Address:</H4>
        <InputGroup
          large
          defaultValue={person.address}
          inputRef={register({
            required: 'Address is required'
          })}
          name="address"
          placeholder="Enter Address..."
          type="text"
        />
        <span style={{ color: "red" }}>{errors.address && errors.address.message}</span>

        <H4>Mobile:</H4>
        <InputGroup
          large
          defaultValue={person.mobile}
          inputRef={register({
            pattern: {
              value: /^\d{9}$/,
              message: 'Incorect number format'
            },
            required: 'Phone number is requeired'
          })}
          name="mobile"
          placeholder="Enter Mobile Phone Number..."
          type="text"
        />
        <span style={{ color: "red" }}>{errors.mobile && errors.mobile.message}</span>

        <H4>Email:</H4>
        <InputGroup
          large
          defaultValue={person.email}
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

        <H4>Gender:</H4>
        <RadioGroup
          name="gender"
          inputRef={register({
            required: 'Please select gender'
          })}
          inline
          selectedValue={gender}
          onChange={e => setGender(e.target.value)}
        >
          <Radio label="male" value="MALE" />
          <Radio label="female" value="FEMALE" />
        </RadioGroup>
        <Button type="submit" style={{marginTop:"10px"}} intent="success">Submit</Button>
      </form>
      {confirmAdded}
    </div>




  )

}



export default withRouter(EditPerson);