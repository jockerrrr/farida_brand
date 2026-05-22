import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routing/routes.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import ComingSoon from './pages/ComingSoon.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router}/> 
    {/* <ComingSoon></ComingSoon> */}
  </React.StrictMode>,
)

