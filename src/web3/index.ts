import { KIPABI, KIPQueryABI, KIPTokenABI } from '@/abi'
import {
  KIPAddress,
  KIPQueryAddress,
  KIPTokenAddress,
  mumbaiRPC,
  sepoliaRPC,
} from '@/config'
import { ethers } from 'ethers'

const RPC_MAP = {
  sepolia: sepoliaRPC,
  mumbai: mumbaiRPC,
}

const PROVIDER_MAP = {
  sepolia: new ethers.JsonRpcProvider(RPC_MAP.sepolia),
  mumbai: new ethers.JsonRpcProvider(RPC_MAP.mumbai),
}

const CONTRACT_MAP = {
  KIP: new ethers.Contract(KIPAddress, KIPABI, PROVIDER_MAP.sepolia),
  KIPQuery: new ethers.Contract(
    KIPQueryAddress,
    KIPQueryABI,
    PROVIDER_MAP.mumbai
  ),
  KIPToken: new ethers.Contract(
    KIPTokenAddress,
    KIPTokenABI,
    PROVIDER_MAP.mumbai
  ),
}

export { RPC_MAP, PROVIDER_MAP, CONTRACT_MAP }
