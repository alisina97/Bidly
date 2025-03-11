import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import PaymentPage from './pages/PaymentPage/PaymentPage'
import BidEnd from './pages/BidEnd/BidEnd'

function App() {
  const routes = (
    <Router>
      <Routes>
        <Route path='/' exact element={<Login/>} />
        <Route path='/home' exact element={<Home/>} />
        <Route path='/login' exact element={<Login/>} />
        <Route path='/signup' exact element={<SignUp/>} />
        <Route path="/payment" exact element ={<PaymentPage/>} />
        <Route path="/auctionbidding" exact element ={<oiledUpNBid/>} />
        <Route path='/bidend' exact element ={<BidEnd/>} />
      </Routes>
    </Router>
  )
  
  return (
    <div>
      {routes}
    </div>
  )
}

export default App