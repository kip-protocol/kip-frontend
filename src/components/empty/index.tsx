import NoData from '@/assets/nodata.svg'

import './index.less'

const Empty = () => {
  return (
    <div className="kip-empty">
      <h1 className="kip-empty__text">No Data</h1>
      <img
        className="kip-empty__illustration"
        src={NoData}
        alt="no data"
        width={400}
      />
    </div>
  )
}

export default Empty
