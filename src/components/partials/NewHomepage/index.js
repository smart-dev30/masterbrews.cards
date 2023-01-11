import React, {useState, useEffect} from "react";

import useMaster from '@hooks/useMaster'
import {
  CONTRACT_ADDRESS_MAINNFT
} from '@config/addresses'
import abi_mainnft from "./../ABIs/abi-mainnft.json"
import Carousel from "react-multi-carousel"

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1280 },
    items: 6,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1279, min: 768 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
}
import './newHomepage.scss'

export default function NewHomepage() {
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

  // const walletReady = typeof window !== 'undefined' && window.__walletReady;
  // const web3 = typeof window !== 'undefined' && window.__web3;
  // const onboard = typeof window !== 'undefined' && window.__onboard;
  // const connectedAddress = typeof window !== 'undefined' && window.__connectedAddress;

  const [web3, setWeb3] = useState(null)
  const [onboard, setOnboard] = useState(null)
  const [connectedAddress,  setConnectedAddress] = useState(null)
  const [walletBalance,  setWalletBalance] = useState(null)
  const [walletReady, setWalletReady] = useState(false)

  const NETWORK_ID = 1; // Mainnet
  // const NETWORK_ID = 4; // Rinkeby

  // supported wallets
  const FORTMATIC_KEY = "pk_live_9F32123A9D83F8DA"
  //const FORTMATIC_KEY = "pk_test_DC79864314971EB1"
  const PORTIS_KEY = "42bc626f-e174-4314-939e-bdb358d33930"
  const INFURA_KEY = "fa8b97680fdd4614b172c724586e8f5b"
  const APP_URL = "https://masterbrews.cards"
  const CONTACT_EMAIL = "keith@masterbrews.cards"
  const RPC_URL = "https://mainnet.infura.io/v3/fa8b97680fdd4614b172c724586e8f5b"
  // const RPC_URL = "https://rinkeby.infura.io/v3/fa8b97680fdd4614b172c724586e8f5b"
  const APP_NAME = "MasterBrews"

  const wallets = [
    { walletName: "metamask", preferred: true },
    { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
    { walletName: "authereum", preferred: true },
    {
      walletName: "walletConnect",
      infuraKey: INFURA_KEY,
      preferred: true
    },
    {
      walletName: "fortmatic",
      apiKey: FORTMATIC_KEY,
      preferred: true
    },
    {
      walletName: "portis",
      apiKey: PORTIS_KEY,
      label: 'Login with Email'
    },
    { walletName: "opera" },
    { walletName: "operaTouch" },
    { walletName: "torus" },
    {
      walletName: 'trezor',
      appUrl: APP_URL,
      email: CONTACT_EMAIL,
      rpcUrl: RPC_URL
    },
    {
      walletName: 'ledger',
      rpcUrl: RPC_URL
    },
    {
      walletName: 'lattice',
      rpcUrl: RPC_URL,
      appName: APP_NAME
    },
    {
      walletName: 'cobovault',
      rpcUrl: RPC_URL,
      appName: APP_NAME,
    },
    { walletName: "status" },
    { walletName: "walletLink", rpcUrl: RPC_URL, appName: APP_NAME },
    { walletName: "imToken", rpcUrl: RPC_URL },
    { walletName: "meetone" },
    { walletName: "mykey", rpcUrl: RPC_URL },
    { walletName: "huobiwallet", rpcUrl: RPC_URL },
    { walletName: "hyperpay" },
    { walletName: "wallet.io", rpcUrl: RPC_URL },
    { walletName: "atoken" },
    { walletName: "frame" },
    { walletName: "ownbit" },
    { walletName: "alphawallet" }
  ]

  useEffect(() => {
    setWeb3(window.__web3 || null);
    setOnboard(window.__onboard || null);
    setConnectedAddress(window.__connectedAddress || null);
    setWalletBalance(window.__walletBalance || null);
    setWalletReady(window.__walletReady || false);
  }, []);

  useEffect(() => {
    window.__web3 = web3;
  }, [web3]);
  useEffect(() => {
    window.__onboard = onboard;
  }, [onboard]);
  useEffect(() => {
    window.__connectedAddress = connectedAddress;
  }, [connectedAddress]);
  useEffect(() => {
    window.__walletReady = walletReady;
  }, [walletReady]);
  useEffect(() => {
    window.__walletBalance = walletBalance;
  }, [walletReady])

  useEffect(async () => {
    if (typeof window !== "undefined") {
      let { default: Onboard } = await import("bnc-onboard")
      let { default: Web3 } = await import("web3")
      const BLOCKNATIVE_KEY = 'cd395250-b5c3-4079-a711-d5d0a5767542';

      const onboard = Onboard({
        dappId: BLOCKNATIVE_KEY,
        networkId: NETWORK_ID,
        darkMode: true,
        subscriptions: {
          address: setConnectedAddress,
          wallet: async wallet => {
            setWeb3(new Web3(wallet.provider));
          }
        },
        walletSelect: {
          wallets: wallets
        }
      });

      if (window.ethereum) {
        window.ethereum.on('chainChanged', handleNetworkChange);
        window.ethereum.on('disconnect', logout);
        window.ethereum.on('accountsChanged', logout);
      }

      setOnboard(onboard);
    }
  }, [])

  useEffect(() => {
    if (web3 && walletReady) {
      pollUntilAddressAvailable();
      // web3.eth.getBalance(connectedAddress)
        // .then(res => {
        //   setWalletBalance(res);
        // })
    }
  }, [web3, walletReady]);

  function pollUntilAddressAvailable() {
    if (connectedAddress) {
      return;
    }

    if (web3 && web3.currentProvider && web3.currentProvider.selectedAddress &&
      (web3.currentProvider.selectedAddress.length > 0)) {
      setConnectedAddress(web3.currentProvider.selectedAddress);
    } else {
      setTimeout(pollUntilAddressAvailable, 100);
    }
  }

  async function login() {
    if (onboard != null) {
      if (!await onboard.walletSelect()) {
        return;
      }
      setWalletReady(await onboard.walletCheck());
    }
  }

  function logout() {
    if (onboard != null) {
      onboard.walletReset();
    }
    setConnectedAddress(null);
    setWalletReady(false);
  }

  function handleNetworkChange(networkId) {
    console.log("Network changed to", networkId);
    logout();
    alert("You've just changed the Ethereum network! The app will not function properly if you selected the wrong network.");
  }

  async function handleConnectDisconnect() {
    if (!walletReady) {
      await login();
    } else {
      logout();
    }
  }

  //********************************** */

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

  const packModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    content: {

    },
  };

  const sliceAddress = (val) => {
    return val.slice(0, 6) + '...' + val.slice(-4)
  }

  const [countVal, setCountVal] = useState(1)

  const countMinus = () => {
    if (parseInt(countVal) <= 1)
    {
      setCountVal( 1 )
      console.log(walletBalance);
    } else {
      setCountVal( parseInt(countVal) - 1 )
    }
  }

  const countPlus = () => {
    setCountVal( parseInt(countVal) + 1 )
  }

  return (
    <div className="">
      <div className="homeBanner py-8 md:py-20 bg-secondary-whelps">
        <div className="container mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="flex-1 mt-8 md:mt-0">
              <div className="font-lemon text-center text-white text-2xl md:text-4xl tracking-wider">MINT. HATCH. EVOLVE.</div>
              <div className="newForm mt-10">
                <div className="form-container p-6 md:p-12">
                  <div className="">
                  {
                    walletReady && connectedAddress ?
                    <div>
                      <p className="text-white text-base flex items-center justify-items-start pl-2 md:pl-10"><img width="24" src="/whelps/icon-check.png" className="mr-4" alt="" /><span>Connected to wallet <span>{ sliceAddress(connectedAddress) }</span> via network homestead.</span></p>
                      <p className="text-white text-base flex items-center justify-items-start pl-2 md:pl-10 mt-2"><img width="24" src={`${ walletBalance == 0 ? '/whelps/icon-error.png' : '/whelps/icon-check.png' }`} className="mr-4" alt="" /><span>Wallet Balance of <span>{ walletBalance }</span>.</span></p> 
                    </div>
                    : 
                    <button
                      id="connect_button"
                      className="flex justify-center gap-2 items-center bg-primary-whelps text-sm text-black font-bold py-2 px-10 rounded-sm tracking-wide mx-auto"
                    ><span className="text-secondary tracking-wider uppercase" /*onClick={handleConnectDisconnect}*/ >Connect Wallet</span></button>
                  }
                  </div>
                  <div className="my-10">
                    <div className="rectangle"></div>
                  </div>
                  <div className="text-2xl text-yellow-whelps tracking-wide text-center font-muka-bold font-extrabold">Mint Your Dragons Now!</div>
                  <div className="mt-4">
                    <div className="counter-box">
                      <button className={`oval mr-4 cursor-pointer ${ walletReady && walletBalance != 0 ? 'connected' : '' }`} id="minus" onClick={ countMinus } disabled={`${ walletReady && walletBalance != 0 ? '' : 'disabled' }`} >
                        <span className="rect-minus"></span>
                      </button>
                      <input type="text" className="text-center counter-input py-2 px-4 text-black text-lg" id="counter-input" value={countVal} onChange={(e) => setCountVal(e.target.value) } disabled={`${ walletReady && walletBalance != 0 ? '' : 'disabled' }`}/>
                      <button className={`oval ml-4 cursor-pointer ${ walletReady && walletBalance != 0 ? 'connected' : '' }`} id="plus" onClick={ countPlus } disabled={`${ walletReady && walletBalance != 0 ? '' : 'disabled' }`} >
                        <span className="rect-minus"></span>
                        <span className="rect-plus"></span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className={`${ walletReady && walletBalance != 0 ? 'bg-primary-whelps' : 'bg-gray-400' } flex justify-center gap-2 items-center text-sm text-black font-bold py-2 px-10 rounded-sm tracking-wide mx-auto`} disabled={`${ walletBalance != 0 ? '' : 'disabled' }`}>
                      <span className="text-secondary tracking-wider uppercase" >MINT</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <img src="/whelps/hero-dragon.png" alt="Hero Dragon" className="w-100 md:w-auto mx-auto" srcset="" />
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 bg-black">
        <div className="flex justify-center items-center">
          <img src="/whelps/fire-left.png" className="hidden md:inline mt-2 mr-5" alt="Fire Left" />
          <div className="text-2xl text-yellow-whelps font-muka-bold tracking-wide text-center font-extrabold">Sale lasts 77 hours! All Remaining eggs are burned!</div>
          <img src="/whelps/fire-right.png" className="hidden md:inline mt-2 ml-5" alt="Fire Right" />
        </div>
      </div>

      <div className="evolution-path py-8 md:py-20">
        <div className="container mx-auto">
          <div className="font-lemon text-center text-primary-whelps text-2xl md:text-4xl tracking-wider">Evolution Path</div>
          <div className="font-muka-light text-center max-w-xl px-5 text-lg leading-8 mx-auto mt-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </div>
          <div className="block md:flex justify-items-between items-end">
            <div className="flex-1 text-center mt-6 md:mt-0">
              <img src="/whelps/image-egg.png" alt="Egg" className="mx-auto" />
              <div className="text-secondary-whelps text-xl font-muka-bold leading-7 mt-3">Egg</div>
            </div>
            <div className="flex-1 text-center mt-6 md:mt-0">
              <img src="/whelps/image-baby.png" alt="Baby" className="mx-auto" />
              <div className="text-secondary-whelps text-xl font-muka-bold leading-7 mt-3">Baby</div>
            </div>
            <div className="flex-1 text-center mt-6 md:mt-0">
              <img src="/whelps/image-whelp.png" alt="whelp" className="mx-auto" />
              <div className="text-secondary-whelps text-xl font-muka-bold leading-7 mt-3">Whelp</div>
            </div>
            <div className="flex-1 text-center mt-6 md:mt-0">
              <img src="/whelps/image-young.png" alt="Young Adult" className="mx-auto" />
              <div className="text-secondary-whelps text-xl font-muka-bold leading-7 mt-3">Young Adult</div>
            </div>
            <div className="flex-1 text-center mt-6 md:mt-0">
              <img src="/whelps/image-adult.png" alt="Adult" className="mx-auto" />
              <div className="text-secondary-whelps text-xl font-muka-bold leading-7 mt-3">Adult</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dragon-breeds pt-10 md:pt-24 bg-secondary-whelps" id="dragons">
        <div className="font-lemon text-center text-primary-whelps text-2xl md:text-4xl tracking-wider">Dragon Breeds</div>

        <div className="dragon-breeds-item-odd mt-16">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-items-center">
              <div className="flex-1 text-center mt-6 md:mt-0">
                <img src="/whelps/image-breed.png" className="mx-auto" alt="Breed" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-6">Breed Name</div>
                <div className="font-muka-light text-center text-white max-w-xl px-5 text-lg leading-8 mx-auto mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </div>
              </div>
              <div className="flex-1 text-center mt-6 md:mt-0">
                <img src="/whelps/image-breed-inferno.png" className="mx-auto" alt="Breed" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-6">Breed Name</div>
                <div className="font-muka-light text-center font-light text-white max-w-xl px-5 text-lg leading-8 mx-auto mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dragon-breeds-item-even mt-12 md:mt-32">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-items-center">
              <div className="flex-1 text-center mt-6 md:mt-0">
                <img src="/whelps/image-breed-inferno.png" className="mx-auto" alt="Breed" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-6">Breed Name</div>
                <div className="font-muka-light text-center font-light text-white max-w-xl px-5 text-lg leading-8 mx-auto mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </div>
              </div>
              <div className="flex-1 text-center mt-6 md:mt-0">
                <img src="/whelps/image-breed.png" className="mx-auto" alt="Breed" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-6">Breed Name</div>
                <div className="font-muka-light text-center text-white max-w-xl px-5 text-lg leading-8 mx-auto mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dragon-breeds-item-odd mt-12 md:mt-32">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-items-center">
              <div className="flex-1 text-center mt-6 md:mt-0">
                <img src="/whelps/image-breed.png" className="mx-auto" alt="Breed" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-6">Breed Name</div>
                <div className="font-muka-light text-center text-white max-w-xl px-5 text-lg leading-8 mx-auto mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </div>
              </div>
              <div className="flex-1 text-center mt-6 md:mt-0">
                <img src="/whelps/image-breed-inferno.png" className="mx-auto" alt="Breed" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-6">Breed Name</div>
                <div className="font-muka-light text-center font-light text-white max-w-xl px-5 text-lg leading-8 mx-auto mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-16 md:pt-28 bg-secondary-whelps">
        <div className="font-lemon text-center text-primary-whelps text-2xl md:text-4xl tracking-wider">Dragon Traits</div>
        <div className="font-muka-light text-center font-light text-white max-w-xl px-5 text-lg leading-8 mx-auto mt-6">
          A chance to generate over 100,000 unique dragon combinations! Each trait offers a offers a degree of rarity.
        </div>

        <div className="dragon-traits mt-7 md:mt-12 lg:mt-20">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <div className="text-center mt-8 md:mt-6 lg:mt-0">
                <img src="/whelps/image-dragon-den.png" className="mx-auto" alt="" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-4">Dragon’s Den</div>
              </div>
              <div className="text-center mt-8 md:mt-6 lg:mt-0">
                <img src="/whelps/image-dragon-breed.png" className="mx-auto" alt="" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-4">Breed</div>
              </div>
              <div className="text-center mt-8 md:mt-6 lg:mt-0">
                <img src="/whelps/image-dragon-body-pattern.png" className="mx-auto" alt="" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-4">Body Pattern</div>
              </div>
              <div className="text-center mt-8 md:mt-6 lg:mt-0">
                <img src="/whelps/image-dragon-facial-expression.png" className="mx-auto" alt="" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-4">Facial Expression</div>
              </div>
              <div className="text-center mt-8 md:mt-6 lg:mt-0">
                <img src="/whelps/image-dragon-horns.png" className="mx-auto" alt="" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-4">Horns</div>
              </div>
              <div className="text-center mt-8 md:mt-6 lg:mt-0">
                <img src="/whelps/image-dragon-breath.png" className="mx-auto" alt="" />
                <div className="text-white text-2xl font-muka-bold leading-7 mt-4">Breath</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 md:pt-28 ct-carousel bg-secondary-whelps">
        <Carousel responsive={responsive} infinite={true} arrow={false} autoPlay={true} autoPlaySpeed={5000} >
          <div>
            <img src="/whelps/slide-02.png" className="w-100" alt="Slide" />
          </div>
          <div>
            <img src="/whelps/slide-04.png" className="w-100" alt="Slide" />
          </div>
          <div>
            <img src="/whelps/slide-05.png" className="w-100" alt="Slide" />
          </div>
          <div>
            <img src="/whelps/slide-06.png" className="w-100" alt="Slide" />
          </div>
          <div>
            <img src="/whelps/slide-05.png" className="w-100" alt="Slide" />
          </div>
          <div>
            <img src="/whelps/slide-06.png" className="w-100" alt="Slide" />
          </div>
        </Carousel>
      </div>

      <div className="evolution-path py-8 md:py-20" id="distribution">
        <div className="container mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="flex-1 mt-8 md:mt-0">
              <div className="font-lemon text-primary-whelps text-2xl md:text-4xl tracking-wider">Distribution</div>
              <div className="font-muka-bold max-w-xl text-2xl leading-8 mt-12">
                0.008 ETH to all participants.
              </div>
              <div className="font-muka-bold max-w-xl text-2xl leading-8 mt-6">
                No bonding curve, FOMO pricing or price tiers. And just 2.5% royalty.
              </div>
              <div className="font-muka-bold max-w-xl text-2xl leading-8 mt-6">
                Give us some space (in your wallet)
              </div>
            </div>
            <div className="flex-1">
              <img src="/whelps/image-distribution.png" alt="Hero Dragon" className="w-100 md:w-auto mx-auto" srcset="" />
            </div>
          </div>
        </div>
      </div>

      <div className="road-map bg-secondary-whelps py-8 md:py-20" id="roadmap">
        <div className="container mx-auto">
          <div className="font-lemon text-primary-whelps text-2xl md:text-4xl tracking-wider text-center">Road Map Activations</div>
          <div className="road-map-box mt-12 md:mt-16">

            <div className="road-map-item mb-5 p-5 bg-dark-whelps rounded-lg">
              <div className="flex justify-between items-center">
                <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                <div className="text-lg font-muka-bold text-yellow-whelps tracking-wide text-center font-extrabold">10% SOLD</div>
              </div>
              <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </div>
            </div>

            <div className="road-map-item mb-5 p-5 bg-dark-whelps rounded-lg">
              <div className="flex justify-between items-center">
                <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                <div className="text-lg font-muka-bold text-yellow-whelps tracking-wide text-center font-extrabold">20% SOLD</div>
              </div>
              <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </div>
            </div>

            <div className="road-map-item mb-5 p-5 bg-dark-whelps rounded-lg">
              <div className="flex justify-between items-center">
                <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                <div className="text-lg font-muka-bold text-yellow-whelps tracking-wide text-center font-extrabold">30% SOLD</div>
              </div>
              <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </div>
            </div>

            <div className="road-map-item mb-5 p-5 bg-dark-whelps rounded-lg">
              <div className="flex justify-between items-center">
                <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                <div className="text-lg font-muka-bold text-yellow-whelps tracking-wide text-center font-extrabold">40% SOLD</div>
              </div>
              <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </div>
            </div>

            <div className="road-map-item mb-5 p-5 bg-dark-whelps rounded-lg">
              <div className="flex justify-between items-center">
                <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                <div className="text-lg font-muka-bold text-yellow-whelps tracking-wide text-center font-extrabold">60% SOLD</div>
              </div>
              <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </div>
            </div>

            <div className="road-map-item mb-5 p-5 bg-dark-whelps rounded-lg">
              <div className="flex justify-between items-center">
                <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                <div className="text-lg font-muka-bold text-yellow-whelps tracking-wide text-center font-extrabold">80% SOLD</div>
              </div>
              <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </div>
            </div>

            <div className="road-map-item mb-5 p-5 bg-dark-whelps rounded-lg">
              <div className="flex justify-between items-center">
                <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                <div className="text-lg font-muka-bold text-yellow-whelps tracking-wide text-center font-extrabold">100% SOLD</div>
              </div>
              <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </div>
            </div>

            <div className="long-term-box pt-8 md:pt-20">
              <div className="font-lemon text-primary-whelps text-2xl md:text-4xl tracking-wider text-center">Long Term Goals</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-7 mt-12">

                <div className="p-4 md:p-8 bg-dark-whelps">
                  <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                  <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  </div>
                </div>

                <div className="p-4 md:p-8 bg-dark-whelps">
                  <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                  <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  </div>
                </div>
                
                <div className="p-4 md:p-8 bg-dark-whelps">
                  <div className="font-lemon text-white text-xl tracking-wider">This is a title</div>
                  <div className="font-muka-light font-light text-white text-lg leading-8 mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="evolution-path py-8 md:py-20" id="team">
        <div className="container mx-auto">
          <div className="font-lemon text-primary-whelps text-2xl md:text-4xl tracking-wider text-center">Meet The Team</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12">
            <div className="grid-item mt-6 md:mt-0">
              <img src="/whelps/team-image.png" alt="Team Image" className="mx-auto" />
              <div className="text-black text-2xl font-muka-bold leading-7 mt-6 text-center">@twitterhandle</div>
            </div>
            <div className="grid-item mt-6 md:mt-0">
              <img src="/whelps/team-image.png" alt="Team Image" className="mx-auto" />
              <div className="text-black text-2xl font-muka-bold leading-7 mt-6 text-center">@twitterhandle</div>
            </div>
            <div className="grid-item mt-6 md:mt-0">
              <img src="/whelps/team-image.png" alt="Team Image" className="mx-auto" />
              <div className="text-black text-2xl font-muka-bold leading-7 mt-6 text-center">@twitterhandle</div>
            </div>
            <div className="grid-item mt-6 md:mt-0">
              <img src="/whelps/team-image.png" alt="Team Image" className="mx-auto" />
              <div className="text-black text-2xl font-muka-bold leading-7 mt-6 text-center">@twitterhandle</div>
            </div>
          </div>
        </div>
      </div>

      <div className="faq-box py-8 md:py-20 bg-secondary-whelps" id="faq">
        <div className="container mx-auto">
          <div className="font-lemon text-primary-whelps text-2xl md:text-4xl tracking-wider">Frequently Asked Questions</div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="col-span-1 md:col-span-2">
              <div className="faq-container mt-6">
                <div className="faq-item mt-10">
                  <div className="font-lemon text-white text-xl tracking-wider">Here is a question?</div>
                  <div className="font-muka-light font-light text-white text-lg leading-8 mt-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </div>
                </div>
                
                <div className="faq-item mt-10">
                  <div className="font-lemon text-white text-xl tracking-wider">Here is a question?</div>
                  <div className="font-muka-light font-light text-white text-lg leading-8 mt-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </div>
                </div>
                
                <div className="faq-item mt-10">
                  <div className="font-lemon text-white text-xl tracking-wider">Here is a question?</div>
                  <div className="font-muka-light font-light text-white text-lg leading-8 mt-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </div>
                </div>
                
                <div className="faq-item mt-10">
                  <div className="font-lemon text-white text-xl tracking-wider">Here is a question?</div>
                  <div className="font-muka-light font-light text-white text-lg leading-8 mt-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <img src="/whelps/image-faq.png" alt="Faq Image" className="absolute right-0 bottom-0" />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}