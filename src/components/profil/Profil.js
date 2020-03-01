/* eslint-disable camelcase */
import React from 'react';
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie';
import { Colors, H5, H2, Card} from '@blueprintjs/core';

const SECRET_KEY = 'my-secret';



const Profil = (props) => {



    if (!Cookies.get('signedin')) {
        props.history.push('/login');
        return null
    }

    const getUser = () => {
        try {
            const token = Cookies.get('jwt');
            const { email, role, last_name, first_name } = jwt.verify(token, SECRET_KEY);
            return { email, role, last_name, first_name };
        } catch (e) {
            console.log('Error', e)
            return null;
        }
    }

    const user = getUser();

    return (
      <div>
        <Card elevation='3'>
          <H5 style={{ color: Colors.LIME1 }}>
            First Name:
          </H5>
          <H2>
            {user.first_name}
          </H2>
        </Card>
        <Card elevation='3'>
          <H5 style={{ color: Colors.LIME1 }}>
            Last Name:
          </H5>
          <H2>
            {user.last_name}
          </H2>
        </Card>
        <Card elevation='3'>
          <H5 style={{ color: Colors.LIME1 }}>
            Email:
          </H5>
          <H2>
            {user.email}
          </H2>
        </Card>
        <Card elevation='3'>
          <H5 style={{ color: Colors.LIME1 }}>
            Role:
          </H5>
          <H2>
            {user.role}
          </H2>
        </Card>
      </div>




    )
}

export default Profil;