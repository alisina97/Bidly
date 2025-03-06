import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import PaymentPage from './pages/PaymentPage/PaymentPage'
import ReceiptPage from './pages/ReceiptPage/ReceiptPage'
import SellItemPage from './pages/SellItemPage/SellItemPage'
import EditAuctionPage from './pages/EditAuctionPage/EditAuctionPage'
function App() {
  const routes = (
    <Router>
      <Routes>
        <Route path='/' exact element={<Login/>} />
        <Route path='/home' exact element={<Home/>} />
        <Route path='/login' exact element={<Login/>} />
        <Route path='/signup' exact element={<SignUp/>} />
        <Route path="/payment" exact element ={<PaymentPage/>} />
		<Route path="/receipt" exact element ={<ReceiptPage/>} />
		<Route path="/sell" exact element ={<SellItemPage/>} />
		<Route path="/edit" exact element ={<EditAuctionPage/>} />
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