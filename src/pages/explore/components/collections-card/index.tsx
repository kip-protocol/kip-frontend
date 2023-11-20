import { Collection } from '@/utils/helper'
import CollectionCard from '../collection-card'

import './index.less'

type CollectionsCardProps = {
  title: string
  collections: Collection[]
}

const CollectionsCard = ({ title, collections }: CollectionsCardProps) => {
  return (
    <div className="kip-collections-card">
      <h1 className="kip-collections-card__title">{title}</h1>
      <div className="kip-collections">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} {...collection} />
        ))}
      </div>
    </div>
  )
}

export default CollectionsCard
