import React, { useEffect, useState } from 'react'
import { getCollectionsCover } from '@/api'
import { categories } from '@/types'
import { Collection, CollectionTuple, buildCollection } from '@/utils/helper'
import { CONTRACT_MAP } from '@/web3'

import CollectionsCard from './components/collections-card'

import './index.less'
import Loading from '@/components/loading'
import Empty from '@/components/empty'

const Explore = () => {
  const [currentCategory, setCurrentCategory] = useState<number>(1)
  const [trendingCollections, setTrendingCollections] = useState<Collection[]>()
  const [mostMintedCollections, setMostMintedCollections] =
    useState<Collection[]>()
  const [newCollections, setNewCollections] = useState<Collection[]>()
  const [loading, setLoading] = useState(false)

  const calcNewCollections = (collections: Collection[]) => {
    return collections.sort((prev, next) => -prev.id - next.id)
  }

  const calcTrendingCollections = (collections: Collection[]) => {
    return collections.sort((prev, next) => -prev.queryCount - next.queryCount)
  }

  const calcMostMintedCollections = (collections: Collection[]) => {
    return collections.sort((prev, next) => -prev.mintCount - next.mintCount)
  }

  const setCover = (
    collections: Collection[],
    collectionId: number,
    cover: string
  ) => {
    collections.forEach((collection) => {
      if (collection.id === collectionId) {
        collection.cover = cover
      }
    })
  }

  const handleCategoryChange = (e: React.MouseEvent, category: number) => {
    e.preventDefault()
    setCurrentCategory(category)
  }

  const handleResetCollections = () => {
    setTrendingCollections([])
    setMostMintedCollections([])
    setNewCollections([])
  }

  useEffect(() => {
    setLoading(true)
    handleResetCollections()
    CONTRACT_MAP.KIPQuery.getCategoryCollections(currentCategory).then(
      (collections: CollectionTuple[]) => {
        const _collections = collections.map((collection: CollectionTuple) =>
          buildCollection(collection)
        )
        const ids = _collections.map((collection) => collection.id)
        getCollectionsCover({ ids }).then(([err, result]) => {
          if (!err && result) {
            result.data.forEach(({ id, cover }) => {
              setCover(_collections, id, cover)
            })
          }
          setTrendingCollections(calcTrendingCollections(_collections))
          setMostMintedCollections(calcMostMintedCollections(_collections))
          setNewCollections(calcNewCollections(_collections))
        })
        setLoading(false)
      }
    )
  }, [currentCategory])

  return (
    <div className="p-explore">
      <h1 className="kip-title">Explore</h1>
      <div className="kip-category">
        {categories.map((category) => (
          <div
            className={`kip-category__item ${
              currentCategory === category.value ? 'active' : ''
            }`}
            key={category.value}
            onClick={(e) => handleCategoryChange(e, category.value)}
          >
            {category.label}
          </div>
        ))}
      </div>
      {loading && <Loading label="loading..." />}
      {!!(
        !loading &&
        trendingCollections?.length === 0 &&
        mostMintedCollections?.length === 0 &&
        newCollections?.length === 0
      ) && <Empty />}
      {!!trendingCollections?.length && (
        <CollectionsCard
          title="Trending KBs"
          collections={trendingCollections}
        />
      )}
      {!!mostMintedCollections?.length && (
        <CollectionsCard
          title="Most Minted"
          collections={mostMintedCollections}
        />
      )}
      {!!newCollections?.length && (
        <CollectionsCard title="New Collections" collections={newCollections} />
      )}
    </div>
  )
}

export default Explore
