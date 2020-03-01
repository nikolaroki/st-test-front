import { gql } from "apollo-boost";


const GET_ALL_LEADS = gql`
    query {
        persons {
            id
            name
            Person {
                last_name
                gender
            }
            address
            phone
            email
            category
        }
        companies {
            id
            name
            Company {
                contact_person
                website
            }
            address
            phone
            email
            category
        }
    }
`

const ADD_LEAD = gql`
    mutation addLead($input: LeadInput!) {
        addLead(input: $input) {
            name
        }
    }
`

const GET_PERSONS = gql`
    query {
        persons {
            id
            name
            Person {
                last_name
                gender
            }
            address
            phone
            email
            category
        }
    }
`

const GET_COMPANIES = gql`
    query {
        companies {
            id
            name
            Company {
                contact_person
                website
            }
            address
            phone
            email
            category
        }
    }
`

const UPDATE_LEAD = gql`
    mutation editLead($id: ID!, $data: LeadUpdate) {
        editLead(id: $id, data: $data)
    }
`

const DELETE_LEAD = gql`
    mutation deleteLead($id: [ID!]!) {
        deleteLead(id: $id)
    }
`

export { ADD_LEAD, GET_ALL_LEADS, GET_PERSONS, GET_COMPANIES, UPDATE_LEAD, DELETE_LEAD }