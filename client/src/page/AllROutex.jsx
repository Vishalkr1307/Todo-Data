import React from 'react'
import {Route,Routes} from "react-router-dom"
import { Home } from './Home'
import { Login } from './Login'
import { Register } from './Register'

export const AllROutex = () => {
  return (
   <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path='/auth/login' element={<Login/>}/>
       <Route path='/auth/register' element={<Register/>}/>
   </Routes>
  )
}
