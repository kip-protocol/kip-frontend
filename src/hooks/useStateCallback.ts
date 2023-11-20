import React, { Dispatch, useEffect, useState } from 'react'

export const useStateCallback = <T = undefined>(
  initialValue: T,
  callback: (value: T) => void
): [T | undefined, Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    callback(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return [value, setValue]
}
