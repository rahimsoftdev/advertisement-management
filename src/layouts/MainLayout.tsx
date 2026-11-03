import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/shared/Navbar'

export default function MainLayout() {
  return (
    <div>
      <Navbar/>
      <h1>this is main layout</h1>

      <Outlet/>
    </div>
  )
}
