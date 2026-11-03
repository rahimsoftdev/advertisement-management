import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/shared/Navbar'

export default function MainLayout() {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}
