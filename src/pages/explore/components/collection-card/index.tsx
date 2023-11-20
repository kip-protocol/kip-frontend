import { Button, Link } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'
import { Collection } from '@/utils/helper'
import { KIPAddress } from '@/config'
import React from 'react'

import './index.less'

type CollectionCardProps = Collection

const CollectionCard = ({ id, cover }: CollectionCardProps) => {
  const navigate = useNavigate()

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(`/detail?id=${id}`)
  }

  return (
    <div className="kip-collection-card">
      <img
        className="kip-collection-card__cover"
        src={cover}
        width={280}
        height={372}
        onClick={(e) => handleNavigate(e)}
      />
      {/* <p className="kip-collection-card__name">The Consequences of Chaos #2</p> */}
      <Button className="kip-collection-card__trade" color="primary">
        <Link
          className="kip-collection-card__link"
          target="_blank"
          color="foreground"
          href={`https://testnets.opensea.io/assets/sepolia/${KIPAddress}/${id}`}
        >
          Trade
        </Link>
      </Button>
    </div>
  )
}

export default CollectionCard
