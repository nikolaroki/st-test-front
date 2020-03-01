/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { Intent, Spinner } from '@blueprintjs/core';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { withRouter } from 'react-router-dom';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import Person from './person/Person'
import classes from './Persons.module.css'


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
          status    
        }
      }
`;

const DELETE_PERSON = gql`
  mutation deletePerson($id:Int!) {
    deletePerson(id:$id) {
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


const Persons = (props) => {


  const [newPersons, setNewPersons] = useState([]);
  const [wonPersons, setWonPersons] = useState([]);
  const [lostPersons, setLostPersons] = useState([]);
  const [mapping, setMapping] = useState(true)


  const [deletePerson] = useMutation(DELETE_PERSON,
    {
      update(cache, { data: { deletePerson } }) {
        const { persons } = cache.readQuery({ query: GET_PERSONS });
        cache.writeQuery({
          query: GET_PERSONS,
          data: { persons: persons.filter(e => e.id !== deletePerson.id) },
        });
      }
    });

  const [editPerson] = useMutation(EDIT_PERSON);

  const { data, loading, error } = useQuery(GET_PERSONS);

  if (loading) return <Spinner intent={Intent.PRIMARY} />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;



  const np = [];
  const wp = [];
  const lp = [];


  data.persons.map(person => {
    if (person.category === 'NEW') {
      np.push(person)

    }
    if (person.category === 'WON') {
      wp.push(person)

    }
    if (person.category === 'LOST') {
      lp.push(person)
    }

  })
  if (mapping) {
    setMapping(false);
    setNewPersons(np);
    setWonPersons(wp);
    setLostPersons(lp);
  }











  const editPersonHandler = (id) => {
    props.history.push(`/edit-person/${id}`)
  }



  const deletePersonHandler = (id) => {
    let category = "";
    let per = newPersons.find(p=>p.id===id);
    if(per){
      category="NEW"
    }
    per = lostPersons.find(p=>p.id===id);
    if(per){
      category="LOST"
    }
    per = wonPersons.find(p=>p.id===id);
    if(per){
      category="WON"
    }

    if(category==="NEW"){
      const deletingPersonIndex = newPersons.findIndex( p => p.id === id);
      const updatedList = [...newPersons]
      updatedList.splice(deletingPersonIndex, 1);
      setNewPersons(updatedList);       
    }
    if(category==="WON"){
      const deletingPersonIndex = wonPersons.findIndex( p => p.id === id);
      const updatedList = [...wonPersons]
      updatedList.splice(deletingPersonIndex, 1);
      setWonPersons(updatedList);  
    }
    if(category==="LOST"){
      const deletingPersonIndex = lostPersons.findIndex( p => p.id === id);
      const updatedList = [...lostPersons]
      updatedList.splice(deletingPersonIndex, 1);
      setLostPersons(updatedList);     
    }


    deletePerson({
      variables: {
        id
      }
    })
    props.history.push('/');
  }


  const personsNew = newPersons.map((person, index) => {
    return (
      <Draggable key={person.id} draggableId={person.id.toString()} index={index}>
        {(provided) => (
          <div

            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <Person
              index={index}
              key={person.id}
              first_name={person.first_name}
              last_name={person.last_name}
              address={person.address}
              gender={person.gender}
              mobile={person.mobile}
              email={person.email}
              category={person.category}
              editPerson={() => editPersonHandler(person.id)}
              deletePerson={() => deletePersonHandler(person.id)}
            />
          </div>
        )}
      </Draggable>

    )
  }
  )

  const personsWon = wonPersons.map((person, index) => {
    return (
      <Draggable key={person.id} draggableId={person.id.toString()} index={index}>
        {(provided) => (
          <div

            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <Person
              index={index}
              key={person.id}
              first_name={person.first_name}
              last_name={person.last_name}
              address={person.address}
              gender={person.gender}
              mobile={person.mobile}
              email={person.email}
              category={person.category}
              editPerson={() => editPersonHandler(person.id)}
              deletePerson={() => deletePersonHandler(person.id)}
            />
          </div>
        )}
      </Draggable>
    )
  }
  )
  const personsLost = lostPersons.map((person, index) => {
    return (
      <Draggable key={person.id} draggableId={person.id.toString()} index={index}>
        {(provided) => (
          <div

            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <Person
              index={index}
              key={person.id}
              first_name={person.first_name}
              last_name={person.last_name}
              address={person.address}
              gender={person.gender}
              mobile={person.mobile}
              email={person.email}
              category={person.category}
              editPerson={() => editPersonHandler(person.id)}
              deletePerson={() => deletePersonHandler(person.id)}
            />
          </div>
        )}
      </Draggable>
    )
  }
  )

  const onDragEnd = result => {

    const { destination, source, draggableId } = result;
    if (!destination) {
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    if (destination.droppableId === "NEW" && source.droppableId === "NEW") {
      const draggedPerson = newPersons.find((person) => person.id.toString() === draggableId);
      const updatedPersons = Array.from(newPersons);
      updatedPersons.splice(source.index, 1);
      updatedPersons.splice(destination.index, 0, draggedPerson)
      setNewPersons(updatedPersons)
      return
    }
    if (destination.droppableId === "WON" && source.droppableId === "WON") {
      const draggedPerson = wonPersons.find((person) => person.id.toString() === draggableId);
      const updatedPersons = Array.from(wonPersons);

      updatedPersons.splice(source.index, 1);
      updatedPersons.splice(destination.index, 0, draggedPerson)
      setWonPersons(updatedPersons)
      return
    }
    if (destination.droppableId === "LOST" && source.droppableId === "LOST") {
      const draggedPerson = lostPersons.find((person) => person.id.toString() === draggableId);
      const updatedPersons = Array.from(lostPersons);

      updatedPersons.splice(source.index, 1);
      updatedPersons.splice(destination.index, 0, draggedPerson)
      setLostPersons(updatedPersons)
      return
    }

    let sourceList = null;
    let destinationList = null;

    if (source.droppableId === "NEW")
      sourceList = newPersons;
    if (source.droppableId === "WON")
      sourceList = wonPersons;
    if (source.droppableId === "LOST")
      sourceList = lostPersons;
    if (destination.droppableId === "NEW")
      destinationList = newPersons;
    if (destination.droppableId === "WON")
      destinationList = wonPersons;
    if (destination.droppableId === "LOST")
      destinationList = lostPersons;


    const draggedPerson = sourceList.find((person) => person.id.toString() === draggableId);
    const updatedSource = Array.from(sourceList);
    updatedSource.splice(source.index, 1);
    const updateDestination = Array.from(destinationList);
    updateDestination.splice(destination.index, 0, draggedPerson);


    if (destination.droppableId === "NEW")
      setNewPersons(updateDestination)
    if (destination.droppableId === "WON")
      setWonPersons(updateDestination)
    if (destination.droppableId === "LOST")
      setLostPersons(updateDestination)

    if (source.droppableId === "NEW")
      setNewPersons(updatedSource);
    if (source.droppableId === "WON")
      setWonPersons(updatedSource)
    if (source.droppableId === "LOST")
      setLostPersons(updatedSource)


    const helper = {
      id: draggedPerson.id,
      first_name: draggedPerson.first_name,
      last_name: draggedPerson.last_name,
      gender: draggedPerson.gender,
      mobile: draggedPerson.mobile,
      email: draggedPerson.email,
      address: draggedPerson.address,
      category: destination.droppableId,
      status: draggedPerson.status
    };



    editPerson({
      variables: {
        id: draggedPerson.id,
        input: helper
      }
    });


  }





  return (

    <>

 





      <div className={classes.Wrapper}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={classes.WrapperColumn}>
            <h1 className={classes.ColumnHead}>NEW</h1>
            <Droppable droppableId="NEW">
              {(provided) => (
                <div
                  className={classes.Persons}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {personsNew}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className={classes.WrapperColumn} id="won">
            <h1 className={classes.ColumnHead}>WON</h1>
            <Droppable droppableId="WON">
              {(provided) => (
                <div
                  className={classes.Persons}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {personsWon}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className={classes.WrapperColumn} id="lost">
            <h1 className={classes.ColumnHead}>LOST</h1>
            <Droppable droppableId="LOST">
              {(provided) => (
                <div
                  className={classes.Persons}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {personsLost}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </>
  )

}

export default withRouter(Persons);