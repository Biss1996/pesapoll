import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function Layout() {
  return (
    <div>
        <Navbar />

        <div className='container mx-auto min-h-[80vh]'>
                  <Outlet />
                  <ToastContainer position="top-center" theme="colored"      />

        </div>

        <Footer />
    </div>
  )
}