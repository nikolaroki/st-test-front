import React, { useState } from 'react';
import { Button, Colors, H5, H2, InputGroup, Tooltip, Intent, Alert } from '@blueprintjs/core';

import cls from './Login.module.css';


const url = 'http://localhost:3001/login'


const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false)


  const handleLockClick = () => setShowPassword(!showPassword);

  const lockButton = (
    <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
      <Button
        icon={showPassword ? "unlock" : "lock"}
        intent={Intent.WARNING}
        minimal
        onClick={handleLockClick}
      />
    </Tooltip>
  );

  const alertMessage = (
    <Alert
      canOutsideClickCancel
      canEscapeKeyCancel
      confirmButtonText="Okay"
      isOpen={showAlert}
      onClose={() => setShowAlert(false)}
      onConfirm={() => setShowAlert(false)}
    >
      <p>
        Email and password do not match, please retry
      </p>
    </Alert>
  )

  const submitForm = event => {
    event.preventDefault()

    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `email=${email}&password=${password}`
    }


    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            setShowAlert(true);
          }
        }
        return response
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.cookie = 'signedin=true';
          document.cookie = `role=${data.role}`
          props.history.push('/')
        }
      })
  }

  const formTextColor = { color: Colors.DARK_GRAY5 };



  return (
    <div>
      <form className={cls.FormContainer} onSubmit={submitForm}>

        <H2 style={formTextColor}>Lead app</H2>
        <H5 style={formTextColor}>manage your leads with ease</H5>

        <InputGroup
          className={cls.Input}
          placeholder="Enter your email..."
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <InputGroup
          className={cls.Input}
          placeholder="Enter your password..."
          rightElement={lockButton}
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit" intent="success">Login</Button>

      </form>
      {alertMessage}
    </div>
  )
}

export default Login;