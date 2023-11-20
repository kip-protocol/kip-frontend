import Layout from '@/layout'
import Explore from '@/pages/explore'
import LandPage from '@/pages/landpage'
import { createBrowserRouter } from 'react-router-dom'
import Create from '@/pages/create'
import Detail from '@/pages/detail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandPage />,
      },
      {
        path: '/explore',
        element: <Explore />,
      },
      {
        path: '/create',
        element: <Create />,
      },
      {
        path: '/detail',
        element: <Detail />,
      },
    ],
  },
])

export default router
