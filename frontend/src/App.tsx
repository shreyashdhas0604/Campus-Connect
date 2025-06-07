// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import RegisterUser from './pages/UserRegistration'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/UserProfile'
import EventListing from './pages/EvenListing'
import ClubList from './pages/ClubList'
import ClubDetail from './pages/ClubDetail'
import ClubActivities from './pages/ClubActivities'
import ClubCreation from './pages/ClubCreation'


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/login" element={<Login />} />``
            <Route path="/profile" element={<Profile />} />
            <Route path="/event-listing" element={<EventListing />} />
            <Route path="/clubs" element={<ClubList />} />
            <Route path="/clubs/create" element={<ClubCreation />} />
            <Route path="/clubs/:id" element={<ClubDetail />} />
            <Route path="/clubs/:clubId/activities" element={<ClubActivities />} />
          </Routes>
      </Router>
    </>
  )
}

export default App
