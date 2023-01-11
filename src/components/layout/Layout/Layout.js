import {
  faDiscord,
  faMediumM,
  faRedditAlien,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "gatsby"
import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import "./Layout.scss"
import { footerLinks } from "./menu"
import { Disclosure } from "@headlessui/react"
import { MenuIcon, XIcon } from "@heroicons/react/outline"
import { menus } from "./menu"
import { useMeasure } from "react-use"

const icons = [
  { icon: faDiscord, color: "#8867ff", link: "https://discord.gg/EJKBkK9UBD" },
  { icon: faTwitter, color: "#62b0e5", link: "https://twitter.com/MasterBrewsNFT" },
  { icon: faRedditAlien, color: "#ff4300", link: "https://reddit.com/r/masterbrews" },
  { icon: faMediumM, color: "#fac045", link: "https://blog.masterbrews.cards" },
]

export default function Layout({
  title = "MasterBrews",
  children,
  contentClassName = "",
  headerClass = "",
  headerStyle = null,
  visibleClass = true,
  visibleFooter = true
}) {
  const [activeIcon, setActiveIcon] = useState("")
  const [ref, /*{ height, bottom }*/] = useMeasure()

  const [web3, setWeb3] = useState(null)
  const [onboard, setOnboard] = useState(null)
  const [connectedAddress, setConnectedAddress] = useState(null)
  const [walletReady, setWalletReady] = useState(false)

  const NETWORK_ID = 1; // Mainnet
  //const NETWORK_ID = 4; // Rinkeby

  // supported wallets
  const FORTMATIC_KEY = "pk_live_9F32123A9D83F8DA"
  //const FORTMATIC_KEY = "pk_test_DC79864314971EB1"
  const PORTIS_KEY = "42bc626f-e174-4314-939e-bdb358d33930"
  const INFURA_KEY = "fa8b97680fdd4614b172c724586e8f5b"
  const APP_URL = "https://masterbrews.cards"
  const CONTACT_EMAIL = "keith@masterbrews.cards"
  const RPC_URL = "https://mainnet.infura.io/v3/fa8b97680fdd4614b172c724586e8f5b"
  //const RPC_URL = "https://rinkeby.infura.io/v3/fa8b97680fdd4614b172c724586e8f5b"
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

  const sliceAddress = (val) => {
    return val.slice(0, 6) + '...' + val.slice(-4)
  }

  async function handleConnectDisconnect() {
    if (!walletReady) {
      await login();
    } else {
      logout();
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="layout">
        <Disclosure
          as="nav"
          ref={ref}
          className={`header fixed z-50 w-full px-0 ${headerClass} ${visibleClass ? "block" : "hidden"} `}
          style={headerStyle}
        >
          {({ open }) => (
            <>
              <div ref={ref}>
                <div className="container mx-auto py-4 md:py-0">
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1 flex items-center justify-between sm:items-stretch min-w-full">
                      <div className="flex-shrink-0 flex items-center">
                        <Link to="/">
                          <img
                            className="block h-8 w-auto"
                            src="/LogoDark.png"
                            alt="Workflow"
                          />
                        </Link>
                      </div>
                      <div className="hidden sm:block sm:ml-6">
                        <div className="flex space-x-4">
                          <div>
                            <ul className="navMenus">
                              {menus.map(dt => (
                                <li className="py-2 px-3" key={dt.name} >
                                  {dt.type == 'internal' ?

                                    <Link
                                      activeClassName="active"
                                      to={dt.path}
                                      partiallyActive={!!dt.partiallyActive}
                                      target={dt.target}
                                    >
                                      {dt.name}
                                    </Link>
                                    :
                                    <a href={dt.path} target={dt.target}>
                                      {dt.name}
                                    </a>
                                  }
                                </li>
                              ))}
                              {
                                walletReady && connectedAddress ?
                                  <li className="py-2 pl-3">
                                    <Link activeClassName="active" to="/mybrews" target="">My BREWs</Link>
                                  </li>
                                  :
                                  ""
                              }
                              <li className="py-2 pl-3">
                                {
                                  walletReady && connectedAddress ?
                                    <div className="py-2 px-4 flex items-center">
                                      <span className="text-xs text-gray-600 mr-1">{sliceAddress(connectedAddress)}</span>
                                      <span className="ml-1 rounded-full bg-red-400" onClick={handleConnectDisconnect} style={{ 'display': 'inline-block', 'width': '20px', 'height': '20px', }}></span>
                                    </div>
                                    :
                                    <button
                                      id="connect_button"
                                      className="flex justify-center gap-2 items-center bg-green-400 hover:bg-green-300 text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full"
                                      onClick={handleConnectDisconnect}
                                    ><span className="text-secondary tracking-wider">Connect</span></button>
                                }
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                      {/* Mobile menu button*/}
                      <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md menuToggleIcon focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <MenuIcon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="sm:hidden bg-black">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <div>
                    <ul className="navMenus flex-col">
                      <li className="py-2 px-3 w-full">
                        {
                          walletReady && connectedAddress ?
                            <div className="py-2 px-4 flex justify-center items-center">
                              <span className="text-xs text-gray-600 mr-1">{sliceAddress(connectedAddress)}</span>
                              <span className="ml-1 rounded-full bg-red-400" onClick={handleConnectDisconnect} style={{ 'display': 'inline-block', 'width': '20px', 'height': '20px', }}></span>
                            </div>
                            :
                            <button
                              className="flex justify-center gap-2 items-center bg-green-400 hover:bg-green-300 text-sm text-black font-bold py-2 px-4 rounded-sm tracking-wide w-full"
                              onClick={handleConnectDisconnect}
                            ><span className="text-secondary tracking-wider">Connect</span></button>
                        }
                      </li>
                      {
                        walletReady && connectedAddress ?
                          <li className="py-2 px-3" key="mybrews">
                            <Link activeClassName="active" to="/mybrews" target="">My BREWs</Link>
                          </li>
                          :
                          ""
                      }
                      {menus.map(dt => (
                        <li className="py-2 px-3" key={dt.name}>
                          <Link
                            activeClassName="active"
                            to={dt.path}
                            target={dt.target}
                          >
                            {dt.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure
          as="nav"
          ref={ref}
          className={`top-0 bg-black fixed z-50 w-full px-0 ${headerClass} ${visibleClass ? "hidden" : "block"} `}
          style={headerStyle}
        >
          <>
            <div ref={ref}>
              <div className="container mx-auto py-4">
                <div className="flex items-center justify-center sm:items-stretch min-w-full">
                  <div className="flex-shrink-0 flex items-center">
                    <Link to="/">
                      <img
                        className="block h-8 w-auto"
                        src="/LogoDark.png"
                        alt="Workflow"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Disclosure>

        <div
          // style={{ marginTop: height }}
          className="contentWrapper flex flex-col bg-secondary relative"
        >
          <main
            className={`content container mx-auto flex-grow flex flex-col ${contentClassName} ${visibleClass ? 'pb-20' : 'pb-0'} `}
          >
            {children}
          </main>
        </div>

        <div className={`footerWrapper min-w-full ${visibleClass && visibleFooter ? "block" : "hidden"} `}>
          <div className="footer container mx-auto w-full flex flex-col md:flex-row items-center lg:justify-between">
            <div>
              <div className="text-center followText hidden md:block">
                Follow Us
              </div>
              <div className="mt-4 flex align-middle justify-center mb-4">
                <ul className="flex justify-between flex-grow">
                  {icons.map(dt => (
                    <a href={dt.link} target="_blank" rel="noreferrer" key={dt.icon}>
                      <div
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
                </ul>
              </div>
              <div className="copyText text-gray-400 text-center mt-3 hidden md:block">
                ©2021 MasterBrews. All rights reserved.
              </div>
            </div>
            <div className="flex-col md:flex-row items-center flex justify-center lg:justify-end">
              {footerLinks.map(dt => (
                <div
                  key={dt.heading}
                  className="mx-3 footerNavItem mb-5 md:mb-0"
                >
                  <div className="footerNavHeading text-center md:text-left text-sm">
                    {dt.heading}
                  </div>
                  <ul>
                    {dt.links.map(sb => (
                      <li className="text-gray-300 text-center md:text-left my-1.5 font-semibold text-sm" key={sb.label}>
                        {sb.type == 'internal' ?
                          <Link to={sb.link}>
                            {sb.label}
                          </Link>
                          :
                          <a href={sb.link}>
                            {sb.label}
                          </a>
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="copyText text-gray-400 text-center mt-3 block md:hidden">
              ©2021 MasterBrews. All rights reserved.
            </div>
          </div>
        </div>
        <div className={`relative min-w-full ${!visibleClass && visibleFooter ? "block" : "hidden"} `}>
          <div className="container mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Link to="/">
                <img
                  src="/LogoDark.png"
                  width="280"
                  alt="Footer Logo" />
              </Link>
              <div className="copyright text-sm text-white opacity-60 mt-8 md:mt-0">
                &copy; 2021 MasterBrews All Rights Reserved
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
