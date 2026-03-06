import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import App from '../App'
import Products from '../pages/Products'
import Checkout from '../pages/Checkout'
import OrderSuccess from '../pages/OrderSuccess'
import Collections from '../pages/Collections'
import AboutUs from '../pages/AboutUs'
import Returns from '../pages/Returns'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <App /> },
      { path: 'products/:setName', element: <Products /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'order-success', element: <OrderSuccess /> },
      { path: 'collections', element: <Collections /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'returns', element: <Returns /> },
    ],
  },
])

export default router

