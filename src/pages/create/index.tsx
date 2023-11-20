import Upload from '@/components/upload'
import './index.less'
import {
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  Spacer,
  Textarea,
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { categories, createCollectionABI, queryRoyalties } from './config'
import { createCollection, getURI } from '@/api'
import { parseEther, parseUnits } from 'ethers'
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSwitchNetwork,
} from 'wagmi'
import { KIPAddress } from '@/config'
import { CONTRACT_MAP } from '@/web3'
import { useNavigate } from 'react-router-dom'

const Create = () => {
  const { address } = useAccount()
  const { switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    switchNetwork?.(11155111)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [name, setName] = useState('')
  const [supply, setSupply] = useState('')
  const [category, setCategory] = useState(new Set<React.Key>([]))
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [queryRoyalty, setQueryRoyalty] = useState(new Set<React.Key>([]))

  const [CID, setCID] = useState('')
  const [key, setKey] = useState('')
  const [URI, setURI] = useState('')

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const { config } = usePrepareContractWrite({
    address: KIPAddress,
    abi: createCollectionABI,
    functionName: 'createCollection',
    args: [
      parseInt(supply || '1', 10),
      parseUnits(price || '1', 18),
      parseInt(queryRoyalty.values().next().value || '1', 10),
      parseInt(category.values().next().value || '1', 10),
      URI || '',
    ],
    value: parseEther('0.01'),
  })

  const { write } = useContractWrite(config)

  const handleCoverUpload = (CID: string) => {
    setCID(CID)
  }

  const handleDocUpload = (key: string) => {
    setKey(key)
  }

  const customValidate = () => {
    return (
      CID &&
      key &&
      name &&
      supply &&
      symbol &&
      description &&
      price &&
      category.values().next().value &&
      queryRoyalty.values().next().value
    )
  }

  const handleContractEvent = () => {
    CONTRACT_MAP.KIP.on('CreateCollection', (id, creator) => {
      if (creator === address) {
        createCollection({
          collectionId: parseInt(id.toString(), 10),
          cover: CID,
          fileKey: key,
        })
          .then(([err, res]) => {
            if (!err && res) {
              setLoading(false)
              window.alert(
                '🎉 Create collection success! ⌚️ Rough 20 minutes it will appear on EXPLORE'
              )
              navigate('/explore')
            }
          })
          .finally(() => {
            CONTRACT_MAP.KIP.off('CreateCollection')
          })
      }
    })
  }

  const handleCreateCollection = () => {
    console.log('CreateCollection: ', config.request)
    setLoading(true)
    write?.()
    handleContractEvent()
  }

  const handleGenerateMetadata = async () => {
    const passed = customValidate()
    if (passed) {
      setLoading(true)
      const [err, result] = await getURI({
        name,
        description,
        CID,
        category: parseInt(category.values().next().value, 10),
      })
      setLoading(false)
      if (!err && result.data) {
        setURI(result.data)
      } else {
        window.alert('Get URI for collection failed. Please try again.')
      }
    } else {
      window.alert('Please fulfill the form.')
    }
  }

  return (
    <div className="p-create">
      <div className="kip-collection-cover">
        <h1 className="kip-collection-cover__title">Cover Image</h1>
        <Upload onUpload={handleCoverUpload} />
      </div>
      <div className="kip-collection-info">
        <h1 className="kip-collection-info__title">Create KB NFT</h1>
        <div className="kip-collection-info__upload">
          <p className="kip-collection-info__label">Upload file</p>
          <p className="kip-collection-info__tip">
            Drag or choose your file to upload
          </p>
          <Upload
            accept={{ 'text/plain': [], 'application/pdf': [] }}
            acceptType={1}
            maxSize={1024 * 1024 * 25}
            tip="Only support text or PDF. Max 25MB"
            onUpload={handleDocUpload}
          />
        </div>
        <div className="kip-collection-info__metadata">
          <Input
            isRequired
            label="Name"
            labelPlacement="outside"
            placeholder='e.g. "Redeemable KB Card with logo"'
            className="mb-8"
            value={name}
            onValueChange={setName}
          />
          <div className="flex mb-8">
            <Input
              isRequired
              type="number"
              label="Supply"
              labelPlacement="outside"
              placeholder="e.g. 66"
              value={supply}
              onValueChange={setSupply}
            />
            <Spacer x={8} />
            <Select
              isRequired
              label="Category"
              labelPlacement="outside"
              placeholder="Select Category"
              selectedKeys={category}
              onSelectionChange={(keys) => {
                for (const key of keys) {
                  setCategory(new Set([key]))
                  break
                }
              }}
            >
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            <Spacer x={8} />
            <Input
              isRequired
              label="Token Symbol"
              labelPlacement="outside"
              placeholder="e.g. SDKW7890"
              value={symbol}
              onValueChange={setSymbol}
            />
          </div>
          <Textarea
            isRequired
            label="Description"
            labelPlacement="outside"
            placeholder="e.g. “After purchasing you will able to recived the logo...”"
            className="mb-8"
            value={description}
            onValueChange={setDescription}
          />
          <div className="flex">
            <Input
              isRequired
              type="number"
              label="Price per query"
              labelPlacement="outside"
              placeholder="e.g. USDT 0.13243"
              value={price}
              onValueChange={setPrice}
            />
            <Spacer x={8} />
            <Select
              isRequired
              label="Query Royalties"
              labelPlacement="outside"
              placeholder="Select"
              selectedKeys={queryRoyalty}
              onSelectionChange={(keys) => {
                for (const key of keys) {
                  setQueryRoyalty(new Set([key]))
                  break
                }
              }}
            >
              {queryRoyalties.map((royalty) => (
                <SelectItem key={royalty.value} value={royalty.value}>
                  {royalty.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <Divider className="my-10" />
        <div className="flex justify-end mb-10">
          {!URI && (
            <Button
              color="primary"
              onClick={handleGenerateMetadata}
              isLoading={loading}
            >
              Generate Metadata
            </Button>
          )}
          {!!URI && (
            <Button
              color="primary"
              onClick={handleCreateCollection}
              isLoading={loading}
            >
              Create NFT
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Create
