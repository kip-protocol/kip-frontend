import { categories as _categories } from '@/types'

type SelectOption = {
  label: string
  value: string | number
}

export const createCollectionABI = [
  {
    name: 'createCollection',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'supply',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'royalties',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'categoryId',
        internalType: 'uint8',
        type: 'uint8',
      },
      {
        name: 'URI',
        internalType: 'string',
        type: 'string',
      },
    ],
    outputs: [],
  },
]

export const queryABI = [
  {
    name: 'query',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'id',
        internalType: 'uint256',
        type: 'uint256',
      },
      // {
      //   name: 'question',
      //   internalType: 'string',
      //   type: 'string',
      // },
    ],
    outputs: [],
  },
]

export const categories: SelectOption[] = _categories

export const queryRoyalties: SelectOption[] = [
  {
    label: '5%',
    value: 5,
  },
  {
    label: '10%',
    value: 10,
  },
  {
    label: '15%',
    value: 15,
  },
  {
    label: '20%',
    value: 20,
  },
  {
    label: '25%',
    value: 25,
  },
  {
    label: '30%',
    value: 30,
  },
]
