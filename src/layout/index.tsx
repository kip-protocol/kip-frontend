import Footer from '@/components/footer'
import Nav from '@/components/nav'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="kip">
      <Nav />
      <Outlet />
      <Footer divide />
    </div>
  )
}

export default Layout
