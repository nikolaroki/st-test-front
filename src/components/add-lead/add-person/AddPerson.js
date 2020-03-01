/* eslint-disable no-useless-escape */
/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { InputGroup, RadioGroup, Radio, Button, H4 ,Alert} from "@blueprintjs/core";
import { useForm } from 'react-hook-form';
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';

const ADD_PERSON = gql`
  mutation addPerson($input: PersonInput) {
    addPerson(input: $input) {
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

const GET_PERSONS = gql`
  query GetPersons {
        persons{
          id
          first_name
          last_name    
          gender
          mobile
          email
          address 
          category    
        }
      }
`;


const AddPerson = (props) => {

  const [showConfirmAdded, setShowConfirmAdded] = useState(false);
  const [gender, setGender] = useState('MALE');
  const { register, handleSubmit, errors } = useForm();
  const [addPerson] = useMutation(ADD_PERSON,
    {
      update(cache, { data: { addPerson } }) {
        const { persons } = cache.readQuery({ query: GET_PERSONS });
        cache.writeQuery({
          query: GET_PERSONS,
          data: { persons: persons.concat([addPerson]) },
        });
      }
    }
    );

  const onSubmit = d => {
    const personInput = { id:0, ...d, gender, status: 1, category: "NEW" };
    addPerson({
      variables: {
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
        Person added!
      </p>
    </Alert>
  )






  return (
    <div style={{ display: "flexbox", width: "70%", margin: "0 auto", border: "1px black solid", padding: "10px" }}>
      {confirmAdded}
      <form onSubmit={handleSubmit(onSubmit)}>
        <H4>First Name:</H4>
        <InputGroup
          name="first_name"
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
        <Button type="submit" intent="success">Submit</Button>
      </form>
    </div>




  )
}

export default withRouter(AddPerson);