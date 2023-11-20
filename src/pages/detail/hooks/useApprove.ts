import { KIPQueryAddress, KIPTokenAddress } from '@/config'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { approveABI } from '../config'
import { useState } from 'react'

export const useApprove = () => {
  const [allowanceAmount, setAllowanceAmount] = useState(0n)

  const { data, write } = useContractWrite({
    address: KIPTokenAddress,
    abi: approveABI,
    functionName: 'approve',
    args: [KIPQueryAddress, allowanceAmount],
  })

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  return { allowanceAmount, setAllowanceAmount, write, isSuccess, isLoading }
}
