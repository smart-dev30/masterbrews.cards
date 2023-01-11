import React, { useState, useEffect } from "react"
import "./MyBrew.scss"
import Carousel from "react-multi-carousel"
import PackOpenModal from "react-modal";
import { Link } from "gatsby";

import abi_mainnft from "./../ABIs/abi-mainnft.json"

import {displayPackReward, getAnimationUrl, selectAnimationId} from "../common";

import {
  CONTRACT_ADDRESS_MAINNFT
} from '@config/addresses'

import {
  MIGRATED_CONSUMERS,
  MIGRATED_DISTRIBUTORS,
  MIGRATED_MASTERBREWERS
} from '@config/migrated'

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1280 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1279, min: 768 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
}

export default function MyBrew() {
  const [masterOpen, setMasterOpen] = useState(false)
  const [distributorOpen, setDistributorOpen] = useState(false)
  const [consumerOpen, setConsumerOpen] = useState(false)

  let walletReady = typeof window !== 'undefined' && window.__walletReady;
  let web3 = typeof window !== 'undefined' && window.__web3;
  let connectedAddress = typeof window !== 'undefined' && window.__connectedAddress;

  const [masterTokens, setMasterTokens] = useState([]);
  const [distributorTokens, setDistributorTokens] = useState([]);
  const [consumerTokens, setConsumerTokens] = useState([]);
  const [dropTokens, setDropTokens] = useState();
  const [freePacks, setFreePacks] = useState([]);

  const [openedPacks, setOpenedPacks] = useState([]);
  const [bonusCans, setBonusCans] = useState([]);
  const [migratedBonusCans, setMigratedBonusCans] = useState([]);

  const [packRewardModalOpen, setPackRewardModalOpen] = useState(false);
  const [packRewardId, setPackRewardId] = useState(-1);

  useEffect(() => {
    refreshTokens();
    pollConnectReady();
    setInterval(() => {
      pollConnectReady();
    }, POLL_CONNECT_READY_TIMEOUT);
  }, []);

  useEffect(() => {
    setBonusCans(migratedBonusCans.concat(openedPacks.map((t) => t.giftNo).filter((t) => [1, 5, 6].includes(t))));
  }, [openedPacks, migratedBonusCans]);

  const POLL_CONNECT_READY_TIMEOUT = 1000;
  function pollConnectReady() {
    if ((web3 !== window.__web3) || (walletReady !== window.__walletReady) || (connectedAddress !== window.__connectedAddress)) {
      walletReady = window.__walletReady;
      web3 = window.__web3;
      connectedAddress = window.__connectedAddress;

      if (walletReady && web3 && connectedAddress) {
        refreshTokens();
      } else {
        setMasterTokens([]);
        setDistributorTokens([]);
        setConsumerTokens([]);
        setDropTokens();
        setFreePacks([]);
      }
    }
  }

  function refreshTokens() {
    getTokensOwnedInMainContract();
    getPastPacksFromEvents();
    getBonusesFromInitialMigration();
  }

  function tokenStringForDisplay(tokenId, number_of_digits) {
    let result = tokenId.toString();
    while (result.length < number_of_digits) {
      result = "0" + result;
    }
    return result;
  }

  function getBonusesFromInitialMigration() {
    setMigratedBonusCans([]);

    MIGRATED_CONSUMERS.forEach(addr => {
      if (addr.toLowerCase() === connectedAddress.toLowerCase()) {
        setMigratedBonusCans((prev) => [...prev, 1]);
      }
    });

    MIGRATED_MASTERBREWERS.forEach(addr => {
      if (addr.toLowerCase() === connectedAddress.toLowerCase()) {
        setMigratedBonusCans((prev) => [...prev, 5]);
      }
    });
  }

  async function getPastPacksFromEvents() {
    if (web3 == null || walletReady == false || await web3.eth.getCode(CONTRACT_ADDRESS_MAINNFT) == "0x") {
      return;
    }

    setOpenedPacks([]);
    const contract = new web3.eth.Contract(abi_mainnft, CONTRACT_ADDRESS_MAINNFT);

    contract.events.PackOpened({}, { filter: {_owner: connectedAddress}, fromBlock: 0, toBlock: 'latest' }, (error, eventResult) => {
      if (error) {
        console.log('Error in PackOpened event handler: ' + error);
      } else {
        let openedPack = {
          packNo: parseInt(eventResult.returnValues._packNo) + 1,
          giftNo: parseInt(eventResult.returnValues._giftNo),
          cardNo: parseInt(eventResult.returnValues._cardNo),
          count: parseInt(eventResult.returnValues._count),
        };
        setOpenedPacks((packs) => [...packs, openedPack]);
      }
    });
  }

  async function getTokensOwnedInMainContract() {
    if (web3 == null || walletReady == false || await web3.eth.getCode(CONTRACT_ADDRESS_MAINNFT) == "0x") {
      setMasterTokens([]);
      setDistributorTokens([]);
      setConsumerTokens([]);
      setDropTokens();
      setFreePacks([]);
      return;
    }

    const contract = new web3.eth.Contract(abi_mainnft, CONTRACT_ADDRESS_MAINNFT);
    const masterTokens = [];
    const distributorTokens = [];
    const consumerTokens = [];
    let dropTokens = 0;
    const freePacks = []; 

    const numberOfTokens = await contract.methods.balanceOf(connectedAddress).call();

    const firstIndexMaster = parseInt(await contract.methods.FIRST_MASTER_BREWERS().call());
    const maxIndexMaster = parseInt(await contract.methods.MAX_MASTER_BREWERS().call());

    const firstIndexDistributor = parseInt(await contract.methods.FIRST_DISTRIBUTORS().call());
    const maxIndexDistributor = parseInt(await contract.methods.MAX_DISTRIBUTORS().call());

    const firstIndexConsumer = parseInt(await contract.methods.FIRST_CONSUMERS().call());
    const maxIndexConsumer = parseInt(await contract.methods.MAX_CONSUMERS().call());

    const firstIndexFreePack = parseInt(await contract.methods.FIRST_FREE_PACKS().call());
    const maxIndexFreePack = parseInt(await contract.methods.MAX_FREE_PACKS().call());

    for (let i = 0; i < numberOfTokens; i++) {
      const token = await contract.methods.tokenOfOwnerByIndex(connectedAddress, i).call();
      if (token >= firstIndexMaster && token < maxIndexMaster) {
        masterTokens.push(token-firstIndexMaster+1);
        if (token > 15303) { dropTokens += 50000; }
      } else if (token >= firstIndexDistributor && token < maxIndexDistributor) {
        distributorTokens.push(token-firstIndexDistributor+1);
        if (token > 15014) { dropTokens += 5000; }
      } else if (token >= firstIndexConsumer && token < maxIndexConsumer) {
        consumerTokens.push(token-firstIndexConsumer+1);
        if (token > 350) { dropTokens += 250; }
      } else if (token >= firstIndexFreePack && token < maxIndexFreePack) {
        freePacks.push(token-firstIndexFreePack+1);
      }
    }

    setMasterTokens(masterTokens);
    setDistributorTokens(distributorTokens);
    setConsumerTokens(consumerTokens);
    setDropTokens(dropTokens);
    setFreePacks(freePacks);
  }

  function handlePackReward(receipt, contract) {
    const animationId = displayPackReward(receipt, contract);
    
    setPackRewardId(animationId);
    setPackRewardModalOpen(true);
  }

  function dismissPackReward() {
    setPackRewardModalOpen(false);
  }

  const BUY_PACK_TX_MESSAGE = "Your transaction is processing, please wait for a confirmation message from your wallet. You will see the contents of the pack once the transaction has been confirmed.";

  async function openFreePack(packId) {
    if (web3 == null || walletReady == false || await web3.eth.getCode(CONTRACT_ADDRESS_MAINNFT) == "0x") {
      return;
    }

    const contract = new web3.eth.Contract(abi_mainnft, CONTRACT_ADDRESS_MAINNFT);
    const firstIndexFreePack = parseInt(await contract.methods.FIRST_FREE_PACKS().call());
    const gasLimit = web3.utils.toBN("350000");

    const tokenId = packId-1+firstIndexFreePack;
    contract.methods.openFreePack(tokenId).send({from: connectedAddress, gas: gasLimit})
    .on('error', (error) => {
      console.log(error);
      alert(`Error ${error.code}: ${error.message}`);
    })
    .on('transactionHash', (hash) => alert(`${BUY_PACK_TX_MESSAGE} Tx: ${hash}`))
    .on('receipt', (receipt) => {
      handlePackReward(receipt, contract);
      refreshTokens();
    });
  }

  const packModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    content: {

    },
  };

  function displayOpenedPack(pack) {
    const animationId = selectAnimationId(pack.giftNo, pack.count);

    setPackRewardId(animationId);
    setPackRewardModalOpen(true);
  }

  const totalTokens = (parseInt(consumerTokens.length) * 500) + (parseInt(distributorTokens.length) * 10000) + (parseInt(masterTokens.length) * 100000) - parseInt(dropTokens);
  //masterTokens.length + distributorTokens.length + consumerTokens.length;

  return (

    <div className="MyBrew mt-16">
      <div className="container mx-auto mt-12">
        <div className="outlineText text-6xl text-center uppercase font-bold mb-5">
          My Brews
        </div>
        <div className="text-center flex items-center justify-center">
          <img className="inline mr-2" src="/$mbrew-tokens.png" />
          <span className="text-white text-xl font-bold tracking-widest inline-block rounded-full border border-solid border-primary-dark px-8 py-4 ml-2">{totalTokens}</span>
        </div>

        {/* Free Packs */}
        <div className="myBrewsCard mt-20">
          <div className="flex items-center justify-items-center">
            <div className="flex-auto md:flex-initial">
              <div className="text-2xl font-bold text-white tracking-wider text-center md:text-left">Free Packs ({freePacks.length})</div>
            </div>
            <div className="flex-auto px-3 hidden md:block">
              <hr className="border-primary-dark" />
            </div>
          </div>
          <Carousel
            responsive={responsive}
            infinite={freePacks.length == 1 ? false : true}
            arrows={freePacks.length == 1 ? false : true}
            className="py-8"
          >
            {freePacks.map((item, index) => (
              <div>
                <Link to="/nfts">
                  <img src="/nfts/free-pack-01.png" alt="" />
                </Link>
                <div className="text-lg font-light mt-1 tracking-widest text-center" style={{ 'color': '#FFD079' }}>
                  <button onClick={() => openFreePack(item)} className={`flex gap-2 justify-center items-center bg-green-400 hover:bg-gray-300 text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full mt-5`}>
                    Open Pack #{tokenStringForDisplay(item,5)}
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Bonus Cans */}
        <div className="myBrewsCard mt-20">
          <div className="flex items-center justify-items-center">
            <div className="flex-auto md:flex-initial">
              <div className="text-2xl font-bold text-white tracking-wider text-center md:text-left">Bonus Cans ({bonusCans.length})</div>
            </div>
            <div className="flex-auto px-3 hidden md:block">
              <hr className="border-primary-dark" />
            </div>
          </div>
          <Carousel
            responsive={responsive}
            infinite={bonusCans.length == 1 ? false : true}
            arrows={bonusCans.length == 1 ? false : true}
            className="py-8"
          >
            {bonusCans.map((item, index) => (
              <div>
                <Link to="/nfts">
                  {
                    item === 1 ? <div><img src="/nfts/luchador-01.png" alt="" /></div> :
                    item === 5 ? <div><img src="/nfts/mckenna-01.png" alt="" /></div> :
                                        <div><img src="/nfts/pls.png" alt="" /></div>
                  }
                </Link>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Master Card Brews */}
        <div className="myBrewsCard mt-20">
          <div className="flex items-center justify-items-center">
            <div className="flex-auto md:flex-initial">
              <div className="text-2xl font-bold text-white tracking-wider text-center md:text-left">Master Brewers ({masterTokens.length})</div>
            </div>
            <div className="flex-auto px-3 hidden md:block">
              <hr className="border-primary-dark" />
            </div>
          </div>
          <Carousel
            responsive={responsive}
            infinite={masterTokens.length == 1 ? false : true}
            arrows={masterTokens.length == 1 ? false : true}
            className="py-8"
          >
            {masterTokens.map((item, index) => (
              <div>
                <Link to="/nfts">
                  <img src="/nfts/masterbrew-01.png" alt="" />
                </Link>
                <div className="text-lg font-light mt-1 tracking-widest text-center" style={{ 'color': '#FFF57A' }}>#{tokenStringForDisplay(item,2)}</div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Distributor Card Brews */}
        <div className="myBrewsCard mt-20">
          <div className="flex items-center justify-items-center">
            <div className="flex-auto md:flex-initial">
              <div className="text-2xl font-bold text-white tracking-wider text-center md:text-left">Distributors ({distributorTokens.length})</div>
            </div>
            <div className="flex-auto px-3 hidden md:block">
              <hr className="border-primary-dark" />
            </div>
          </div>
          <Carousel
            responsive={responsive}
            infinite={distributorTokens.length == 1 ? false : true}
            arrows={distributorTokens.length == 1 ? false : true}
            className="py-8"
          >
            {distributorTokens.map((item, index) => (
              <div>
                <Link to="/nfts">
                  <img src="/nfts/distributor-01.png" alt="" />
                </Link>
                <div className="text-lg font-light mt-1 tracking-widest text-center" style={{ 'color': '#FBFBFB' }}>#{tokenStringForDisplay(item,3)}</div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Consumer Card Brews */}
        <div className="myBrewsCard mt-20">
          <div className="flex items-center justify-items-center">
            <div className="flex-auto md:flex-initial">
              <div className="text-2xl font-bold text-white tracking-wider text-center md:text-left">Consumers ({consumerTokens.length})</div>
            </div>
            <div className="flex-auto px-3 hidden md:block">
              <hr className="border-primary-dark" />
            </div>
          </div>
          <Carousel
            responsive={responsive}
            infinite={consumerTokens.length == 1 ? false : true}
            arrows={consumerTokens.length == 1 ? false : true}
            className="py-8"
          >
            {consumerTokens.map((item, index) => (
              <div>
                <Link to="/nfts">
                  <img src="/nfts/consumer-01.png" alt="" />
                </Link>
                <div className="text-lg font-light mt-1 tracking-widest text-center" style={{ 'color': '#FFD079' }}>#{tokenStringForDisplay(item,5)}</div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Opened Packs */}
        <div className="myBrewsCard mt-20">
          <div className="flex items-center justify-items-center">
            <div className="flex-auto md:flex-initial">
              <div className="text-2xl font-bold text-white tracking-wider text-center md:text-left">Opened Packs ({openedPacks.length})</div>
            </div>
            <div className="flex-auto px-3 hidden md:block">
              <hr className="border-primary-dark" />
            </div>
          </div>
          <Carousel
            responsive={responsive}
            infinite={openedPacks.length == 1 ? false : true}
            arrows={openedPacks.length == 1 ? false : true}
            className="py-8"
          >
            {openedPacks.map((item, index) => (
              <div>
                <img src="/nfts/opened-can.png" alt="" />
                <div className="text-lg font-light mt-1 tracking-widest text-center" style={{ 'color': '#FFD079' }}>
                  <button onClick={() => displayOpenedPack(item)} className={`flex gap-2 justify-center items-center bg-green-400 hover:bg-gray-300 text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full mt-5`}>
                    REPLAY #{tokenStringForDisplay(item.packNo,5)}
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

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
