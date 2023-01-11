import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "gatsby"

import "./HomePage.scss"

import { calculateTimeLeft } from '@util'

import { steps, icons, homeOddsData } from '@util/homeCardData'
import useMaster from '@hooks/useMaster'
import {
  CONTRACT_ADDRESS_MAINNFT
} from '@config/addresses'

import abi_mainnft from "./../ABIs/abi-mainnft.json"

import {displayPackReward, getAnimationUrl} from "../common";

import PackOpenModal from "react-modal";

export default function HomePage() {
  const [activeIcon, setActiveIcon] = useState("");
  const [openedPacks, setOpenedPacks] = useState([]);
  const [currentBlockNo, setCurrentBlockNo] = useState(0);
  const {value: currentSupplyPacks1, setValue: setCurrentSupplyPacks1} = useMaster('currentSupplyPacks1');
  const {value: maxSupplyPacks1, setValue: setMaxSupplyPacks1} = useMaster('maxSupplyPacks1');
  const {value: currentSupplyPacks3, setValue: setCurrentSupplyPacks3} = useMaster('currentSupplyPacks4');
  const {value: maxSupplyPacks3, setValue: setMaxSupplyPacks3} = useMaster('maxSupplyPacks3');
  const {value: currentSupplyPacks5, setValue: setCurrentSupplyPacks5} = useMaster('currentSupplyPacks5');
  const {value: maxSupplyPacks5, setValue: setMaxSupplyPacks5} = useMaster('maxSupplyPacks5');

  const [packRewardModalOpen, setPackRewardModalOpen] = useState(false);
  const [packRewardId, setPackRewardId] = useState(-1);

  const QUANTITY_POLL_TIMEOUT = 2000; //timeout to poll remaining NFT quantity in ms

  const walletReady = typeof window !== 'undefined' && window.__walletReady;
  const web3 = typeof window !== 'undefined' && window.__web3;
  const onboard = typeof window !== 'undefined' && window.__onboard;
  const connectedAddress = typeof window !== 'undefined' && window.__connectedAddress;

  useEffect(() => {
    if (web3 && walletReady) {
      pollRemainingQuantity();
      getPastPacksFromEventsForEveryone();
      const interval = setInterval(() => {
        pollRemainingQuantity();
      }, QUANTITY_POLL_TIMEOUT);
      return () => clearInterval(interval);
    }
  }, [web3, walletReady]);

  async function pollRemainingQuantity() {
    if (web3 == null || walletReady == false || (await web3.eth.getCode(CONTRACT_ADDRESS_MAINNFT) == "0x")) {
      setCurrentSupplyPacks1(null);
      setCurrentSupplyPacks3(null);
      setCurrentSupplyPacks5(null);
      setMaxSupplyPacks1(null);
      setMaxSupplyPacks3(null);
      setMaxSupplyPacks5(null);
      return;
    }

    const contract = new web3.eth.Contract(abi_mainnft, CONTRACT_ADDRESS_MAINNFT);

    const totalPacks1Card = parseInt(await contract.methods._totalPacks1Card().call());
    const maxPacks1Card = parseInt(await contract.methods.MAX_PACKS_1CARD().call());
    
    const totalPacks3Card = parseInt(await contract.methods._totalPacks3Card().call());
    const maxPacks3Card = parseInt(await contract.methods.MAX_PACKS_3CARD().call());
    
    const totalPacks5Card = parseInt(await contract.methods._totalPacks5Card().call());
    const maxPacks5Card = parseInt(await contract.methods.MAX_PACKS_5CARD().call());

    setCurrentSupplyPacks1(maxPacks1Card - totalPacks1Card);
    setMaxSupplyPacks1(maxPacks1Card);

    setCurrentSupplyPacks3(maxPacks3Card - totalPacks3Card);
    setMaxSupplyPacks3(maxPacks3Card);

    setCurrentSupplyPacks5(maxPacks5Card - totalPacks5Card);
    setMaxSupplyPacks5(maxPacks5Card);
  }

  function packBonusForDisplay(giftNo) {
    switch (giftNo) {
      case 1: return "FREE NFT LUCHADOR";
      case 2: return "FREE PACK";
      case 3: return "DISTRIBUTOR";
      case 4: return "MASTER BREWER";
      case 5: return "MARK MCKENNA'S BREWMASTER";
      case 6: return "PLS&TY x MASTERBREWS";
      default: return "Error";
    }
  }

  async function getPastPacksFromEventsForEveryone() {
    if (web3 == null || walletReady == false || await web3.eth.getCode(CONTRACT_ADDRESS_MAINNFT) == "0x") {
      return;
    }

    setCurrentBlockNo(await web3.eth.getBlockNumber());
    setOpenedPacks([]);
    const contract = new web3.eth.Contract(abi_mainnft, CONTRACT_ADDRESS_MAINNFT);

    contract.events.PackOpened({}, { fromBlock: 0, toBlock: 'latest' }, (error, eventResult) => {
      if (error) {
        console.log('Error in PackOpened event handler: ' + error);
      } else {
        let openedPack = {
          owner: eventResult.returnValues._owner,
          packNo: parseInt(eventResult.returnValues._packNo) + 1,
          giftNo: parseInt(eventResult.returnValues._giftNo),
          cardNo: parseInt(eventResult.returnValues._cardNo),
          count: parseInt(eventResult.returnValues._count),
          blockNo: parseInt(eventResult.blockNumber),
        };
        if (openedPack.giftNo > 0) {
          setOpenedPacks((packs) => [...packs, openedPack]);
        }
      }
    });
  }

  function handlePackReward(receipt, contract) {
    const animationId = displayPackReward(receipt, contract);
    
    setPackRewardId(animationId);
    setPackRewardModalOpen(true);
  }

  function dismissPackReward() {
    setPackRewardModalOpen(false);
  }

  const BUY_PACK_TX_MESSAGE = "Please wait until your transaction is confirmed. Your pack will then automatically open and reveal your item(s).";

  async function buyPackOf1() {
    if (!web3 || !onboard || !connectedAddress || await web3.eth.getCode(CONTRACT_ADDRESS_MAINNFT) == "0x") {
      return;
    }

    const contract = new web3.eth.Contract(abi_mainnft, CONTRACT_ADDRESS_MAINNFT);
    const payableAmount = web3.utils.toBN(await contract.methods.PACK_1CARD_PRICE().call());
    const gasLimit = web3.utils.toBN("350000");

    contract.methods.buyPack1Card().send({ from: connectedAddress, value: payableAmount, gas: gasLimit })
    .on('error', (error) => {
      console.log(error);
      alert(`Error ${error.code}: ${error.message}`);
    })
    .on('transactionHash', (hash) => alert(`${BUY_PACK_TX_MESSAGE} Tx: ${hash}`))
    .on('receipt', (receipt) => handlePackReward(receipt, contract));
  }

  async function buyPackOf3() {
    if (!web3 || !onboard || !connectedAddress || await web3.eth.getCode(CONTRACT_ADDRESS_MAINNFT) == "0x") {
      return;
    }

    const contract = new web3.eth.Contract(abi_mainnft, CONTRACT_ADDRESS_MAINNFT);
    const payableAmount = web3.utils.toBN(await contract.methods.PACK_3CARD_PRICE().call());
    const gasLimit = web3.utils.toBN("700000");

    contract.methods.buyPack3Card().send({ from: connectedAddress, value: payableAmount, gas: gasLimit })
    .on('error', (error) => {
      console.log(error);
      alert(`Error ${error.code}: ${error.message}`);
    })
    .on('transactionHash', (hash) => alert(`${BUY_PACK_TX_MESSAGE} Tx: ${hash}`))
    .on('receipt', (receipt) => handlePackReward(receipt, contract));
  }

  async function buyPackOf5() {
    if (!web3 || !onboard || !connectedAddress || await web3.eth.getCode(CONTRACT_ADDRESS_MAINNFT) == "0x") {
      return;
    }

    const contract = new web3.eth.Contract(abi_mainnft, CONTRACT_ADDRESS_MAINNFT);
    const payableAmount = web3.utils.toBN(await contract.methods.PACK_5CARD_PRICE().call());
    const gasLimit = web3.utils.toBN("1000000");

    contract.methods.buyPack5Card().send({ from: connectedAddress, value: payableAmount, gas: gasLimit })
    .on('error', (error) => {
      console.log(error);
      alert(`Error ${error.code}: ${error.message}`);
    })
    .on('transactionHash', (hash) => alert(`${BUY_PACK_TX_MESSAGE} Tx: ${hash}`))
    .on('receipt', (receipt) => handlePackReward(receipt, contract));
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer=setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  const packModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    content: {

    },
  };

	return (
  <div className="homepage2">
      <div className="home-banner">
        <div className="container pt-20 pb-56 mx-auto text-center">
          <div className="sm:flex justify-between items-center">
            <div className="flex sm:flex justify-center items-center mt-3 sm:mt-0">
              <div className="font-16 text-white tracking-wide sm:ml-3">
                Follow Us: 
              </div>
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
            <div className="mt-3 sm:mt-0">
              <Link to="#how_to">
                <button className="flex gap-2 justify-center items-center bg-transparent hover:bg-primary-darker border-2 border-solid border-primary-darker text-sm text-primary-darker hover:text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full" >
                  How to Connect Wallets
                </button>
              </Link>
            </div>
          </div>
          <div className="text-4xl md:text-7xl font-bold tracking-widest ct-banner-text mx-auto w-max mt-8" style={{'textShadow': '0 0 20px #000000, 3px 3px 0 #02813B', 'color': 'var(--color-yellow-primary)'}}>
            NFT 2.0 Live Sale
          </div>
          <div className="text-2xl md:text-3xl text-center uppercase text-primary-dark my-6">
            What COUNTRY and ARTIST will you get!?
          </div>
        </div>
      </div>
      <div className="container mx-auto -mt-44">
        <div className="bannerImg">
          <img src="/header-banner-image.png" alt="" className="w-full" />
        </div>
        <div className="outlineText text-center my-10 text-5xl uppercase font-bold">
          OUR NFT PACKS
        </div>
        <div className="block md:flex justify-center items-center">
          <img src="/mystery-can-left.png" alt="" className="mx-auto md:m-0 transform " />
          <div className="text-xl text-white px-4">
            Buy any pack below, and get a chance to win a <span className="text-2xl text-primary-darker font-bold">BONUS NFT</span> on the house!
          </div>
          <img src="/mystery-can-right.png" alt="" className="hidden md:block" />
        </div>
        <div className="cards mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5">
            <div className="salesCard max-w-xs md:max-w-sm px-4 mx-auto mt-4 lg:mt-0">
              <img src="/crate-x1.png" alt="" className="w-full" />
              <div>
                <div className="saveLabel bg-primary-darkest transform scale-x-100 inline-block w-auto py-1 px-3 pr-1 mt-4 invisible">
                  <span className="text-white text-sm italic font-bold tracking-wider">SAVE 10%</span>
                </div>
                <div className="flex flex-row items-center justify-between mt-2">
                  <div className="text-white text-xl">
                    <span className="text-3xl">0.08</span><span> ETH</span>
                  </div>
                  <div className="text-white text-xs flex items-center">
                    <span className="text-2xl border border-green-700 py-1 px-2 ml-2 rounded-md">{currentSupplyPacks1} / <span className="text-xl">8000</span></span>
                  </div>
                </div>
              { walletReady ?
                <button onClick={() => buyPackOf1()} className={`flex gap-2 justify-center items-center ${ (currentSupplyPacks1 > 0) ? 'bg-green-400 hover:bg-gray-300' : 'bg-gray-400 hover:bg-gray-300' }  text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full mt-5`} disabled={`${(currentSupplyPacks1 > 0) ? '' : 'disabled'}`}>
                  BUY 1-PACK
                </button>
              :
                <button onClick={() => document.getElementById("connect_button").click()} className="flex gap-2 justify-center items-center bg-green-400 hover:bg-green-300 text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full mt-5">
                  Connect Wallet 
                </button>
              }
              </div>
            </div>
            <div className="salesCard max-w-xs md:max-w-sm px-4 mx-auto mt-4 lg:mt-0">
              <img src="/crate-x3.png" alt="" className="w-full" />
              <div>
                <div className="saveLabel bg-primary-darkest transform scale-x-100 inline-block w-auto py-1 px-3 pr-1 mt-4 visible">
                  <span className="text-white text-sm italic font-bold tracking-wider">SAVE 12.5%</span>
                </div>
                <div className="flex flex-row items-center justify-between mt-2">
                  <div className="text-white text-xl">
                    <span className="text-3xl">0.21</span><span> ETH</span>
                  </div>
                  <div className="text-white text-xs flex items-center">
                    <span className="text-2xl border border-green-700 py-1 px-2 ml-2 rounded-md">{currentSupplyPacks3} / <span className="text-xl">1500</span></span>
                  </div>
                </div>
              { walletReady ?
                <button onClick={() => buyPackOf3()} className={`flex gap-2 justify-center items-center ${ (currentSupplyPacks3 > 0) ? 'bg-green-400 hover:bg-gray-300' : 'bg-gray-400 hover:bg-gray-300' }  text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full mt-5`} disabled={`${(currentSupplyPacks3 > 0) ? '' : 'disabled'}`}>
                  BUY 3-PACK
                </button>
              :
                <button onClick={() => document.getElementById("connect_button").click()} className="flex gap-2 justify-center items-center bg-green-400 hover:bg-green-300 text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full mt-5">
                  Connect Wallet 
                </button>
              }
              </div>
            </div>
            <div className="salesCard max-w-xs md:max-w-sm px-4 mx-auto mt-4 lg:mt-0">
              <img src="/crate-x5.png" alt="" className="w-full" />
              <div>
                <div className="saveLabel bg-primary-darkest transform scale-x-100 inline-block w-auto py-1 px-3 pr-1 mt-4 visible">
                  <span className="text-white text-sm italic font-bold tracking-wider">SAVE 17.5%</span>
                </div>
                <div className="flex flex-row items-center justify-between mt-2">
                  <div className="text-white text-xl">
                    <span className="text-3xl">0.33</span><span> ETH</span>
                  </div>
                  <div className="text-white text-xs flex items-center">
                    <span className="text-2xl border border-green-700 py-1 px-2 ml-2 rounded-md">{currentSupplyPacks5} / <span className="text-xl">500</span></span>
                  </div>
                </div>
              { walletReady ?
                <button onClick={() => buyPackOf5()} className={`flex gap-2 justify-center items-center ${ (currentSupplyPacks5 > 0) ? 'bg-green-400 hover:bg-gray-300' : 'bg-gray-400 hover:bg-gray-300' }  text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full mt-5`} disabled={`${(currentSupplyPacks5 > 0) ? '' : 'disabled'}`}>
                  BUY 5-PACK
                </button>
              :
                <button onClick={() => document.getElementById("connect_button").click()} className="flex gap-2 justify-center items-center bg-green-400 hover:bg-green-300 text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full mt-5">
                  Connect Wallet 
                </button>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 h-20" style={{ 'background': 'linear-gradient(180deg, #001409 0%, #000000 100%)' }}></div>
      <div className="oddsCards">
        <div className="container mx-auto py-16">
          <div className="outlineText text-center text-5xl uppercase font-bold">
            What Are The Odds?
          </div>
          <div className="text-center text-white font-medium line-height-medium mt-12">
            Every pack purchased has a random chance to generate a bonus NFT. 
          </div>
          <div className="flex justify-center mt-16 flex-wrap">
            {
              homeOddsData.map((dt, idx) => (
                <div className="text-center w-1/2 lg:w-1/3 xl:w-1/6 2xl:w-max">
                  <img src={dt.oddImg} alt="" className="mx-auto w-32 lg:w-44" />
                  <div className="font-bold text-xl tracking-wider text-center mb-4" style={{ 'color': dt.color }}>
                    {dt.oddPrice}
                  </div>
                </div>
              ))
            }
          </div>
          <Link to="/nfts">
            <button className="w-auto mx-auto mt-10 flex gap-2 justify-center items-center bg-green-400 hover:bg-green-300 text-sm text-black font-bold py-2 px-16 rounded-sm tracking-wide" >
              VIEW DETAILS
            </button>
          </Link>
        </div>
      </div>
      <div className="mb-10 h-20" style={{ 'background': 'linear-gradient(-180deg, #000000 0%, #001409 100%)' }} id="how_to"></div>

      <div className="text-primary font-bold text-3xl tracking-wider text-center mb-8">
        Connect Your Wallet Now
      </div>
			<div className="container mx-auto py-10 px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-10 pt-5">
          { steps.map(dt => (
            <div key={dt.name} className="flex flex-col items-center">
              <div className="outlineText text-5xl uppercase font-bold mb-5">
                {dt.name}
              </div>
              <div className="text-primary font-bold text-xl tracking-wider text-center mb-4">
                {dt.title}
              </div>
              <div className="text-center text-white font-medium line-height-medium">
                {dt.desc} <a href={dt.link} target="_blank" rel="noreferrer">{dt.linktext}</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      { openedPacks.slice(-8).map((pack, index) =>
        <div key={index} className={`bonus-banner animate-flicker animate-delay-${index} block sm:flex gap-1 justify-center items-center text-center bg-green-400 text-sm text-black py-2 px-4 rounded-sm tracking-wide w-full mt-5`}>
        {(currentBlockNo - pack.blockNo < 30)
        ? <> 
            <span id="bonus-banner__address" className="block sm:inline">{pack.owner}</span>
            <span id="bonus-banner__text" >just scored a</span>
            <span id="bonus-banner__prize" className="ml-3 font-bold" >{packBonusForDisplay(pack.giftNo)}!</span>
          </>
        : <>
            <span id="bonus-banner__address" className="block sm:inline">{pack.owner}</span>
            <span id="bonus-banner__text" >scored a</span>
            <span id="bonus-banner__prize" className="ml-3 font-bold" >{packBonusForDisplay(pack.giftNo)}</span>
            <span id="bonus-banner__text" className="block sm:inline">{currentBlockNo - pack.blockNo} blocks ago!</span>
          </>}
        </div>
      )}

      <PackOpenModal
        isOpen={packRewardModalOpen}
        style={packModalStyles}
        contentLabel="Modal"
        onRequestClose={() => dismissPackReward()}
        className="border-2 border-primary-dark rounded-xl p-5 bg-black mx-auto relative top-2/4 transform w-full max-w-sm md:max-w-md -translate-y-2/4 h-auto"
      >
        <div className="text-left text-white font-medium line-height-medium">
          <video controls autoplay
            style={{ border: '1px solid #99FFC7', boxShadow: '0 0 10px #99FFC7' }}
            className="w-full mx-auto rounded-xl">
            <source src={getAnimationUrl(packRewardId)} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        </div>
      </PackOpenModal>
		</div>
	)
}