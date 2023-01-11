import React, { useState } from 'react'
import { Link } from "gatsby"
import Modal from "react-modal";

Modal.setAppElement(`#___gatsby`);

const nftData = [
  {
    "image": '/nfts/masterbrew-01.png',
    "nftTitle": 'MASTER BREWER',
    "nftContent": 'Our ultra-premium tier. Amazing 1-of-1 artwork commissioned exclusively for MasterBrews from reknowned international artists along with passive income and included tokens.',
    "featured": [
      {
        "featuredTitle": "Regional Rights",
        "featuredDesc": "Earn 12.5% passive income from all BREW Gardens (marketplace) sales tied to your assigned country for as long as you hold the NFT."
      },
      {
        "featuredTitle": "50,000 $MBREW",
        "featuredDesc": "Receive a huge amount of our upcoming utility token, $MBREW. The token's value will be tied to the success and demand for our services platform offering."
      },
    ]
  },
  {
    "image": '/nfts/distributor-01.png',
    "nftTitle": 'DISTRIBUTOR',
    "nftContent": 'Our premium tier. Amazing 1-of-1 artwork commissioned exclusively for MasterBrews from emerging international artists along with passive income and included tokens.',
    "featured": [
      {
        "featuredTitle": "Regional Rights",
        "featuredDesc": "Earn 5% passive income from all BREW Gardens (marketplace) sales tied to your assigned country for as long as you hold the NFT."
      },
      {
        "featuredTitle": "5,000 $MBREW",
        "featuredDesc": "Receive a generous amount of our upcoming utility token, $MBREW. The token's value will be tied to the success and demand for our services platform offering."
      },
    ],
    "dir": 'left',
  },
  {
    "image": '/nfts/consumer-01.png',
    "nftTitle": 'CONSUMER',
    "nftContent": 'Our standard tier. Incredible 1-of-25 artwork commissioned exclusively for MasterBrews from emerging international artists along with included tokens, this is the only tier available for direct purchase.',
    "featured": [
      {
        "featuredTitle": "250 $MBREW",
        "featuredDesc": "Receive a starter amount of our upcoming utility token, $MBREW. The token's value will be tied to the success and demand for our services platform offering."
      },
    ]
  },
  {
    "image": '/nfts/pls.png',
    "nftTitle": 'PLS&TY x MASTERBREWS',
    "nftContent": 'One NFT to rule them all. PLS&TY has teamed up with MasterBrews to bring you a one-of-a-kind, ultra-exclusive blend of art and music that one lucky MasterBrews card buyer will win at random. PLS&TY\'s work includes a collection of chart topping singles such as "Good Vibes", "Down For Me", and "Rebel Love" (#1 on iTunes US Electronic Charts), and "Motives" (#1 on iTunes US Electronic Charts / Top 25 Billboard Electronic Charts).',
    "dir": 'left',
    "haveBtn": true,
  },
  {
    "image": '/nfts/mckenna-01.png',
    "nftTitle": 'MARK MCKENNA’S BREWMASTER',
    "nftContent": 'We have our own superhero! Will you be one of only 16 people in the world to own a copy? This limited edition NFT was created exclusively for MasterBrews by the comic book industry legend himself, Mark McKenna!',
  },
  {
    "image": '/nfts/free-pack-01.png',
    "nftTitle": 'FREE CONSUMER PACK',
    "nftContent": 'While this bonus is fairly self-explanatory, no one will be disappointed to get a free consumer and another shot at all our other bonuses! That is what we call a great value. Note: you will require a tiny amount of ETH for gas in order to open the pack from your "My BREWs" page.',
    "dir": 'left',
  },
  {
    "image": '/nfts/luchador-01.png',
    "nftTitle": 'FREE NFT LUCHADOR',
    "nftContent": 'Lucha! Lucha! Lucha! Created by our good friends at luchadores.io, these little guys are limited to 10,000 ever and are randomly generated using Chainlink VRF with millions of possible combinations and 100% on-chain art and metadata. New! Assign your luchador a custom name.',
  },
]

export default function Nfts() {
  const [open, setOpen] = useState(false)
  const modalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    content: {

    },
  };

  return (
    <div>
      <div className="py-24">
        <div className="text-4xl text-center uppercase outlineText md:text-5xl">
          AVAILABLE NFTs
        </div>
        <div className="max-w-3xl mx-auto mt-10 text-lg leading-8 text-center text-white">
          Below, you will find a description of all available MasterBrews NFTs and their corresponding perks and abilities. The Master Brewer, Distributor and Consumer are assigned a mystery country and artist which will be revealed after the public sale ends.
        </div>
      </div>

      <div className="container mx-auto promoBox">
        {
          nftData.map( (dt, index) => (
            <div className={`flex flex-col md:items-center justify-between py-10 md:py-16 md:flex-row${ !!dt.dir ? '' : '-reverse' }`} key={index}>
              <div className="flex-1">
                <img src={dt.image} className="max-w-xs md:max-w-sm mx-auto" />
                { dt.haveBtn && 
                  <button onClick={ () => setOpen(true) } className="flex gap-2 justify-center items-center bg-transparent hover:bg-primary-darker border-2 border-solid border-primary-darker text-sm text-primary-darker hover:text-black font-bold py-2 px-4 rounded-sm tracking-wide w-auto mx-auto" >
                    Play Video
                  </button>
                }
              </div>
              <div className={`flex-1 mt-5 md:mt-0 ${ !!dt.dir ? 'pl-0 md:pl-24' : 'pr-0 md:pr-24' } `}>
                <div className="mb-2 text-xl font-bold tracking-wider text-left text-primary">
                  {dt.nftTitle}
                </div>
                <div className="max-w-3xl mx-auto mt-2 mb-10 text-lg leading-8 text-left text-white">
                  {dt.nftContent}
                </div>
                {
                  dt?.featured?.map((dt, idx) => (
                    <div key={idx}>
                      <div className="text-primary font-bold text-xl tracking-wider text-left mb-2">
                        {dt.featuredTitle}
                      </div>
                      <div className="text-left text-white font-medium line-height-medium mb-5">
                        {dt.featuredDesc}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ) )
        }
      </div>
      <Modal
        isOpen={open}
        style={modalStyles}
        contentLabel="Modal"
        onRequestClose={() => (setOpen(false))}
        className="border-2 border-primary-dark rounded-xl p-5 bg-black mx-auto relative top-2/4 transform w-full max-w-sm md:max-w-md -translate-y-2/4 h-auto"
      >
        <div className="text-left text-white font-medium line-height-medium">
          <video controls
            style={{ border: '1px solid #99FFC7', boxShadow: '0 0 10px #99FFC7' }}
            className="w-full mx-auto rounded-xl">
            <source src="/promo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </Modal>
    </div>
  )
}
