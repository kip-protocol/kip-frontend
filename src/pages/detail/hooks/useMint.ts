import { KIPQueryAddress } from '@/config'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { mintABI } from '../config'
import { useEffect, useState } from 'react'

export const useMint = (_questionId: number, _address: string) => {
  const [questionId, setQuestionId] = useState<number>(_questionId)
  const [address, setAddress] = useState<string>(_address)
  const [uri, setURI] = useState<string>('')

  const { data, write } = useContractWrite({
    address: KIPQueryAddress,
    abi: mintABI,
    functionName: 'mint',
    args: [questionId, address, uri],
  })

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  const writeWithSetURI = (uri: string) => {
    setURI(uri)
  }

  useEffect(() => {
    if (uri) {
      write?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri])

  return {
    setQuestionId,
    setAddress,
    writeWithSetURI,
    write,
    isSuccess,
    isLoading,
  }
}
