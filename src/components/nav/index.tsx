import { Button, Link } from '@nextui-org/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import './index.less'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import KipleyAI from '@/assets/kipley-horizontal-black.png'

const Nav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showWallet, setShowWallet] = useState<boolean>()

  const handleNavigate = (e: React.MouseEvent, path: string) => {
    e.preventDefault()
    navigate(path)
  }

  useEffect(() => {
    setShowWallet(location.pathname !== '/')
  })

  return (
    <nav className="kip-nav">
      <div className="kip-nav__brand" onClick={(e) => handleNavigate(e, '/')}>
        <img src={KipleyAI} alt="Kipley" />
      </div>
      {showWallet && (
        <div className="kip-nav__link">
          <Link
            href="/home"
            color="foreground"
            className="kip-nav__item"
            onClick={(e) => handleNavigate(e, '/')}
          >
            Home
          </Link>
          <Link
            href="/explore"
            color="foreground"
            className="kip-nav__item"
            onClick={(e) => handleNavigate(e, 'explore')}
          >
            Explore
          </Link>
          <Link
            href="/create"
            color="foreground"
            className="kip-nav__item"
            onClick={(e) => handleNavigate(e, 'create')}
          >
            Create
          </Link>
        </div>
      )}

      <div className="kip-nav__funcs">
        {!showWallet && (
          <Button color="primary" onClick={(e) => handleNavigate(e, 'explore')}>
            Launch APP
          </Button>
        )}
        {showWallet && <ConnectButton />}
      </div>
    </nav>
  )
}

export default Nav
