import { KIPQueryAddress } from '@/config'
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { queryABI } from '../config'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export const useQuery = (collectionId: number) => {
  const [question, setQuestion] = useState('')
  const questionDebounced = useDebounce(question)

  const { config } = usePrepareContractWrite({
    address: KIPQueryAddress,
    abi: queryABI,
    functionName: 'query',
    args: [BigInt(collectionId), questionDebounced],
    enabled: Boolean(questionDebounced),
  })

  const { data, write } = useContractWrite(config)

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  return { question, setQuestion, write, isSuccess, isLoading }
}
