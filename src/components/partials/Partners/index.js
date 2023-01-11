import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import './Partners.scss'
import { icons } from '@util/homeCardData'

export default function Partners() {
  const [activeIcon, setActiveIcon] = useState("")

  return (
    <div className="partnerPage">
      <div className="py-24 container mx-auto">
        <div className="text-4xl text-center uppercase outlineText md:text-5xl">
          Our Partners and Friends
        </div>
        <div className="max-w-3xl mx-auto mt-10 text-lg leading-8 text-center text-white">
          While a good brew can be enjoyed alone, it tastes even better shared with friends! Cheers to our partners who help us build a stronger community for all.
        </div>
      </div>
      <div className="partnerBox container mx-auto">
        <div className="partner-container flex flex-col md:flex-row items-start justify-center">
          <div className="partner-item relative max-w-xs sm:max-w-sm p-4 md:p-8 mx-auto md:mx-4 bg-black bg-opacity-25 hover:shadow-sm">
            <img src="/partners/image-luchador.png" className="w-auto mx-auto" />
            <div className="text-xl font-bold tracking-wider text-primary text-center my-6">
              Luchadores.io
            </div>
            <div className="max-w-3xl mx-auto text-lg leading-8 text-left text-white">
              Each and every Luchador NFT is randomly genererated and has 100% of the art and metadata stored on the Ethereum blockchain. Only 10,000 will ever exist! 
            </div>
            <a href="https://luchadores.io" target="_blank" className='block md:absolute left-4 md:left-8 bottom-4 md:bottom-8 cursor-pointer text-center gap-2 px-10 py-2 mt-4 text-sm font-bold tracking-wide border-2 border-solid border-primary-darker text-primary-darker hover:text-black bg-transparent rounded-sm hover:bg-green-400'>
              View Partner Site
            </a>
          </div>
          <div className="partner-item relative max-w-xs sm:max-w-sm p-4 md:p-8 mx-auto md:mx-4 mt-10 md:mt-0 bg-black bg-opacity-25">
            <img src="/partners/image-brave.png" className="w-auto mx-auto" />
            <div className="text-xl font-bold tracking-wider text-primary text-center my-6">
              Brave Browser
            </div>
            <div className="max-w-3xl mx-auto text-lg leading-8 text-left text-white">
              The Brave browser is a fast, private and secure web browser that allows you to enjoy faster ad-free browsing, while also saving you data and battery life.
            </div>
            <a href="https://brave.com" target="_blank" className='block md:absolute left-4 md:left-8 bottom-4 md:bottom-8 cursor-pointer text-center gap-2 px-10 py-2 mt-4 text-sm font-bold tracking-wide border-2 border-solid border-primary-darker text-primary-darker hover:text-black bg-transparent rounded-sm hover:bg-green-400'>
              View Partner Site
            </a>
          </div>
        </div>
      </div>
      <div className="followBox pt-16 pb-32 mt-24">
        <div className="text-3xl md:text-4xl tracking-widest text-white text-center" style={{ 'textShadow': '0 2px 12px #99FFC7' }}>
          Want to Partner with us?
        </div>
        <div className="max-w-2xl lg:max-w-3xl mx-auto mt-8 md:mt-10 border-2 border-solid border-primary-darker rounded-2xl p-5 md:p-10">
          <div className="text-xl tracking-widest text-white text-center" style={{ 'textShadow': '0 2px 12px #99FFC7' }}>
            Send us a tweet or a message over discord
          </div>
          <div className="flex sm:flex justify-center items-center mt-5">
            {icons.map(dt => (
              // eslint-disable-next-line react/jsx-key
              <a href={dt.link} target="_blank" rel="noreferrer">
                <div
                  key={dt.color}
                  onMouseEnter={() => {
                    setActiveIcon(dt.color)
                  }}
                  onMouseLeave={() => {
                    setActiveIcon("")
                  }}
                  className="iconContainer"
                  style={{
                    boxShadow:
                      activeIcon === dt.color
                        ? `0px 0px 13px 5px ${dt.color}`
                        : "none",
                  }}
                >
                  <FontAwesomeIcon color={dt.color} icon={dt.icon} />
                </div>
              </a>
            ))}
          </div>
        </div>  
      </div>
    </div>
  )
}