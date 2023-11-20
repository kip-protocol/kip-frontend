export const withdrawABI = [
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    outputs: [],
  },
]

export const approveABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
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
      {
        name: 'question',
        internalType: 'string',
        type: 'string',
      },
    ],
    outputs: [],
  },
]

export const mintABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'questionId',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'to',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'uri',
        internalType: 'string',
        type: 'string',
      },
    ],
    outputs: [],
  },
]
