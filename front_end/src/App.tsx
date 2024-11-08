import './App.css'
import { useState } from 'react'
import axios from 'axios'
import { Buffer as BufferPolyfill } from 'buffer'


function App() {
  const [isloggedIn, setIsloggedIn] = useState(false)
  const [text, setText] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [basicToken, setBasicToken] = useState('')


  const LogIn = async (e) => {
    e.preventDefault()
    const auth = BufferPolyfill.from(`${username}:${password}`, 'utf8').toString('base64');
    setBasicToken(`Basic ${auth}`)

    try {
      await axios.get('http://nginx:8198', {
        headers: {
          'Authorization': basicToken
        }
      })
      setIsloggedIn(true)
      setText('Welcome')
      console.log('log in succesfull')
    } catch (error) {
      setText('Wrong credentials! try again')
      console.log(error)
    }
  }

const request = async (e) => {
  e.preventDefault()
  try {
    const response = await axios.get('http://nginx:8198', {
      headers: {
      'Authorization': basicToken
      }
    })
    setText(JSON.stringify(response.data))
  } catch {
    console.log('error in request to server')
  }
}

const stop = async (e) => {
  e.preventDefault()
  try {
    await axios.delete('http://nginx:8198', {
      headers: {
      'Authorization': basicToken
      }
    })
  } catch {
    console.log('error in request to server')
  }
};

  return (
    <div>
      {!isloggedIn ? (
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