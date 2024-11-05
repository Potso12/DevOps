import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
//import exec from 'child_process'


function App() {
  const [isloggedIn, setIsloggedIn] = useState(false)
  const [text, setText] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


const LogIn = async (e) => {
  try {
    await axios.post('http://localhost:8200', {
      username, password } )
    setIsloggedIn(true)
  } catch {
    console.log('Login failed!, Wrong crendentials')
  }
}

const request = async (e) => {
  e.preventDefault()
  try {
    const response = await axios.get('http://localhost:8200');
    setText(response.data)
  } catch {
    console.log('error in request to server')
  }
}

const stop = (e) => {
  e.preventDefault()
  console.log('not implemented')
}

  return (
    <div>
      <button onClick={() => setIsloggedIn(!isloggedIn)}>Change login</button>
      {isloggedIn ? (
      <div>
        <h1>Type your crendentials to log in</h1>
        <form onSubmit={LogIn}>
          <input type="text" onChange={(e) => setUsername(e.target.value) } />
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Log in</button>
        </form>
      </div>
      ) :
      <div>
        <button onClick={request} >request</button>
        <button onClick={stop}>stop</button>
        <p>{text}</p>
      </div>
      }
    </div>
  )
}

export default App
