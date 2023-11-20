import { KIPQueryAddress } from '@/config'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { withdrawABI } from '../config'
import { parseUnits } from 'ethers'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export const useWithdraw = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const withdrawAmountDebounced = useDebounce(withdrawAmount, 500)

  const { data, write } = useContractWrite({
    address: KIPQueryAddress,
    abi: withdrawABI,
    functionName: 'withdraw',
    args: [parseUnits(withdrawAmountDebounced || '0', 18)],
  })

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return { withdrawAmount, setWithdrawAmount, write, isSuccess, isLoading }
}
