/* eslint-disable camelcase */
import React from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken'
import { Colors, H2, Tabs, Tab } from '@blueprintjs/core';
import Persons from '../persons/Persons';
import Companies from '../companies/Companies';
import classes from './Home.module.css'


const SECRET_KEY = 'my-secret';



const Home = (props) => {



  if (!Cookies.get('signedin')) {
    props.history.push('/login');
    return null
  }

  const getUsersName = () => {
    try {
      const token = Cookies.get('jwt');
      const { first_name } = jwt.verify(token, SECRET_KEY);
      return first_name;
    } catch (e) {
      console.log('Error', e)
      return null;
    }
  }





  return (
    <div>
      <div className={classes.Heading}>
        <H2 style={{ color: Colors.LIME1 }}>Welcome, {getUsersName()}!</H2>
        <p>Select what to view:</p>
      </div>
      <div className={classes.Board}>
        <Tabs
          large
          animate
          id="tabs"

        >
          <Tab id="prs" title="Person" panel={<Persons />} />
          <Tab id="cmp" title="Company" panel={<Companies />} />
          <Tabs.Expander />

        </Tabs>
      </div>

    </div>
  )
}

export default Home;