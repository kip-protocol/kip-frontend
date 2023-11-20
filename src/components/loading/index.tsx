import { Progress } from '@nextui-org/react'
import './index.less'

type LoadingProps = {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const Loading = ({ size = 'md', label = '' }: LoadingProps) => {
  return (
    <div className="kip-loading">
      <Progress
        isIndeterminate
        size={size}
        label={label}
        aria-label="Loading..."
        className="max-w-md"
      />
    </div>
  )
}

export default Loading
