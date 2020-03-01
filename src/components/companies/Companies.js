/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */

import React, {useState} from 'react';
import { Intent, Spinner } from '@blueprintjs/core';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import { gql } from "apollo-boost";
import { withRouter } from 'react-router-dom';
import Company from './company/Company';
import classes from './Companies.module.css'


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
          status   
        }
      }
`;

const DELETE_COMPANY = gql`
  mutation deleteCompany($id:Int!) {
    deleteCompany(id:$id) {
      id
      company_name
      contact_person    
      website
      phone
      email
      address 
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

const Companies = (props) => {


  const [newCompanies, setNewCompanies] = useState([]);
  const [wonCompanies, setWonCompanies] = useState([]);
  const [lostCompanies, setLostCompanies] = useState([]);
  const [mapping, setMapping] = useState(true)

  const [deleteCompany] = useMutation(DELETE_COMPANY,
    {
      update(cache, { data: { deleteCompany } }) {
        const { companies } = cache.readQuery({ query: GET_COMPANIES });
        cache.writeQuery({
          query: GET_COMPANIES,
          data: { companies: companies.filter(e => e.id !== deleteCompany.id) },
        });
      }
    });

  const [editCompany] = useMutation(EDIT_COMPANY);
  const { data, loading, error } = useQuery(GET_COMPANIES);

  if (loading) return <Spinner intent={Intent.PRIMARY} />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;


  const nc = [];
  const wc = [];
  const lc = [];


  data.companies.map(company => {
    if (company.category === 'NEW') {
      nc.push(company)

    }
    if (company.category === 'WON') {
      wc.push(company)

    }
    if (company.category === 'LOST') {
      lc.push(company)
    }

  })
  if (mapping) {
    setMapping(false);
    setNewCompanies(nc);
    setWonCompanies(wc);
    setLostCompanies(lc);
  }


  const editCompanyHandler = (id) => {
    props.history.push(`/edit-company/${id}`)
  }

  const deleteCompanyHandler = (id) => {

    let category = "";
    let comp = newCompanies.find(c => c.id === id);
    if (comp) {
      category = "NEW"
    }
    comp = lostCompanies.find(c => c.id === id);
    if (comp) {
      category = "LOST"
    }
    comp = wonCompanies.find(c => c.id === id);
    if (comp) {
      category = "WON"
    }

    if (category === "NEW") {
      const deletingCompanyIndex = newCompanies.findIndex(c => c.id === id);
      const updatedList = [...newCompanies]
      updatedList.splice(deletingCompanyIndex, 1);
      setNewCompanies(updatedList);
    }
    if (category === "WON") {
      const deletingCompanyIndex = wonCompanies.findIndex(c => c.id === id);
      const updatedList = [...wonCompanies]
      updatedList.splice(deletingCompanyIndex, 1);
      setWonCompanies(updatedList);
    }
    if (category === "LOST") {
      const deletingCompanyIndex = lostCompanies.findIndex(c => c.id === id);
      const updatedList = [...lostCompanies]
      updatedList.splice(deletingCompanyIndex, 1);
      setLostCompanies(updatedList);
    }
    deleteCompany({
      variables: {
        id
      }
    })
    props.history.push('/');
  }

  const companiesNew = newCompanies.map((company, index) => {
    return (
      <Draggable key={company.id} draggableId={company.id.toString()} index={index}>
        {(provided) => (
          <div

            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <Company
              key={company.id}
              company_name={company.company_name}
              contact_person={company.contact_person}
              address={company.address}
              website={company.website}
              phone={company.phone}
              email={company.email}
              category={company.category}
              editCompany={() => editCompanyHandler(company.id)}
              deleteCompany={() => deleteCompanyHandler(company.id)}
            />
          </div>
        )}
      </Draggable>
    )
  }
  )

  const companiesWon = wonCompanies.map((company, index) => {
    return (
      <Draggable key={company.id} draggableId={company.id.toString()} index={index}>
        {(provided) => (
          <div

            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <Company
              key={company.id}
              company_name={company.company_name}
              contact_person={company.contact_person}
              address={company.address}
              website={company.website}
              phone={company.phone}
              email={company.email}
              category={company.category}
              editCompany={() => editCompanyHandler(company.id)}
              deleteCompany={() => deleteCompanyHandler(company.id)}
            />
          </div>
        )}
      </Draggable>
    )
  }
  )

  const companiesLost = lostCompanies.map((company, index) => {
    return (
      <Draggable key={company.id} draggableId={company.id.toString()} index={index}>
        {(provided) => (
          <div

            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <Company
              key={company.id}
              company_name={company.company_name}
              contact_person={company.contact_person}
              address={company.address}
              website={company.website}
              phone={company.phone}
              email={company.email}
              category={company.category}
              editCompany={() => editCompanyHandler(company.id)}
              deleteCompany={() => deleteCompanyHandler(company.id)}
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
      const draggedCompany = newCompanies.find((company) => company.id.toString() === draggableId);
      const updatedCompanies = Array.from(newCompanies);
      updatedCompanies.splice(source.index, 1);
      updatedCompanies.splice(destination.index, 0, draggedCompany)
      setNewCompanies(updatedCompanies)
      return
    }
    if (destination.droppableId === "WON" && source.droppableId === "WON") {
      const draggedCompany = wonCompanies.find((company) => company.id.toString() === draggableId);
      const updatedCompanies = Array.from(wonCompanies);

      updatedCompanies.splice(source.index, 1);
      updatedCompanies.splice(destination.index, 0, draggedCompany)
      setWonCompanies(updatedCompanies)
      return
    }
    if (destination.droppableId === "LOST" && source.droppableId === "LOST") {
      const draggedCompany = lostCompanies.find((company) => company.id.toString() === draggableId);
      const updatedCompanies = Array.from(lostCompanies);

      updatedCompanies.splice(source.index, 1);
      updatedCompanies.splice(destination.index, 0, draggedCompany)
      setLostCompanies(updatedCompanies)
      return
    }

    let sourceList = null;
    let destinationList = null;

    if (source.droppableId === "NEW")
      sourceList = newCompanies;
    if (source.droppableId === "WON")
      sourceList = wonCompanies;
    if (source.droppableId === "LOST")
      sourceList = lostCompanies;
    if (destination.droppableId === "NEW")
      destinationList = newCompanies;
    if (destination.droppableId === "WON")
      destinationList = wonCompanies;
    if (destination.droppableId === "LOST")
      destinationList = lostCompanies;


    const draggedCompany = sourceList.find((company) => company.id.toString() === draggableId);
    const updatedSource = Array.from(sourceList);
    updatedSource.splice(source.index, 1);
    const updateDestination = Array.from(destinationList);
    updateDestination.splice(destination.index, 0, draggedCompany);


    if (destination.droppableId === "NEW")
      setNewCompanies(updateDestination)
    if (destination.droppableId === "WON")
      setWonCompanies(updateDestination)
    if (destination.droppableId === "LOST")
      setLostCompanies(updateDestination)

    if (source.droppableId === "NEW")
      setNewCompanies(updatedSource);
    if (source.droppableId === "WON")
      setWonCompanies(updatedSource)
    if (source.droppableId === "LOST")
      setLostCompanies(updatedSource)


    const helper = {
      id: draggedCompany.id,
      company_name: draggedCompany.company_name,
      contact_person: draggedCompany.contact_person,
      address: draggedCompany.address,
      phone: draggedCompany.phone,
      email: draggedCompany.email,
      website: draggedCompany.website,
      category: destination.droppableId,
      status: draggedCompany.status

    };



    editCompany({
      variables: {
        id: draggedCompany.id,
        input: helper
      }
    });


  }


  return (
    <div className={classes.Wrapper}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={classes.WrapperColumn}>
          <h1 className={classes.ColumnHead}>NEW</h1>

          <Droppable droppableId="NEW">
            {(provided) => (
              <div
                className={classes.Companies}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {companiesNew}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

        </div>
        <div className={classes.WrapperColumn}>
          <h1 className={classes.ColumnHead}>WON</h1>
          <Droppable droppableId="WON">
            {(provided) => (
              <div
                className={classes.Companies}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {companiesWon}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className={classes.WrapperColumn}>
          <h1 className={classes.ColumnHead}>LOST</h1>
          <Droppable droppableId="LOST">
            {(provided) => (
              <div
                className={classes.Companies}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {companiesLost}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>

  )

}

export default withRouter(Companies);