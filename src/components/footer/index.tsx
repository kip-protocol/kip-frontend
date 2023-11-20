import './index.less'

import Discord from '@/assets/icon/discord.svg'
import Twitter from '@/assets/icon/twitter.svg'
import Instagram from '@/assets/icon/instagram.svg'
import Telegram from '@/assets/icon/telegram.svg'

type FooterProps = {
  divide?: boolean
}

const Footer = ({ divide }: FooterProps) => {
  return (
    <footer className={`kip-footer ${divide ? 'divide' : ''}`}>
      <div className="kip-info">
        <div className="kip-brand">KIP</div>
        <div className="kip-social">
          <a className="kip-social__item">
            <img src={Discord} alt="discord" />
          </a>
          <a className="kip-social__item">
            <img src={Twitter} alt="twitter" />
          </a>
          <a className="kip-social__item">
            <img src={Instagram} alt="instagram" />
          </a>
          <a className="kip-social__item">
            <img src={Telegram} alt="telegram" />
          </a>
        </div>
      </div>
      <div className="kip-copyright">
        © 2023 KIP Protocol. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
