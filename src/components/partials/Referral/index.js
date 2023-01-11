import React, { useState } from 'react'

export default function Referral() {
  const [activeIcon, setActiveIcon] = useState("")
  return (
    <div className="referralPage">
      <div className="py-24">
        <div className="text-4xl text-center uppercase outlineText md:text-5xl">
          Referral Program
        </div>
        <div className="max-w-3xl mx-auto mt-10 text-lg leading-8 text-center text-white">
          Sharing is caring! Spread the word about our awesome NFTs, and for every friend who makes a purchase, we'll credit you with 10% you can spend in any way you like!
        </div>
      </div>

      <div className>
        <img src="/referral.png" alt="Referral" className="w-full xl:w-auto mx-auto hidden lg:block" />
        <div className="max-w-5xl xl:max-w-6xl mx-auto">
          <div className="block md:flex flex-row items-start justify-between">
            <div className="flex-1 mx-4 mt-8 md:mt-0">
              <img src="/image-step-01.png" alt="Step 01" className="w-auto mx-auto block lg:hidden mb-4" />
              <div className="mb-2 text-xl font-bold tracking-wider text-center text-primary">
                STEP 01
              </div>
              <div className="max-w-3xl mx-auto mt-4 md:mt-10 text-lg leading-8 text-center text-white">
                Tell your friends about our awesome NFTs, that come packed with goodness.
              </div>
            </div>
            <div className="flex-1 mx-4 mt-8 md:mt-0">
              <img src="/image-step-02.png" alt="Step 02" className="w-auto mx-auto block lg:hidden mb-4" />
              <div className="mb-2 text-xl font-bold tracking-wider text-center text-primary">
                STEP 02
              </div>
              <div className="max-w-3xl mx-auto mt-4 md:mt-10 text-lg leading-8 text-center text-white">
                Next, on Discord, have your friend message <b>Varius</b> or <b>Tilting-Shock</b> before they make their purchase, informing us they are buying and who referred them.
              </div>
            </div>
            <div className="flex-1 mx-4 mt-8 md:mt-0">
              <img src="/image-step-03.png" alt="Step 03" className="w-auto mx-auto block lg:hidden mb-4" />
              <div className="mb-2 text-xl font-bold tracking-wider text-center text-primary">
                STEP 03
              </div>
              <div className="max-w-3xl mx-auto mt-4 md:mt-10 text-lg leading-8 text-center text-white">
                Once their transaction is confirmed, you’ll get 10% of whatever your friend spent as a credit. Simply DM us on Discord to let us know when and how you'd like to use it!
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl lg:max-w-3xl mx-auto mt-16 md:mt-28 border-2 border-solid border-primary-darker rounded-2xl p-5 md:p-10">
          <div className="block md:flex items-center justify-evenly text-3xl md:text-4xl tracking-widest text-white text-center" style={{ 'textShadow': '0 2px 12px #99FFC7' }}>
            <span>JOIN US ON DISCORD: </span> <a href="https://discord.gg/EJKBkK9UBD" target="_blank"><button className="px-8 py-3 rounded-md mt-4 md:mt-0" style={{ 'backgroundColor': '#8867ff' }}><img src="/Discord-Logo Wordmark-White.png" alt="Discord Button" /></button></a>
          </div>
        </div>
    </div>
  )
}