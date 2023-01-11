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
import "./NewLayout.scss"
import { footerLinks } from "./menu"
import { Disclosure } from "@headlessui/react"
import { MenuIcon, XIcon } from "@heroicons/react/outline"
import { newMenus } from "./newMenu"
import { useMeasure } from "react-use"

const icons = [
  { icon: faDiscord, color: "#8867ff", link: "https://discord.gg/EJKBkK9UBD", },
  { icon: faTwitter, color: "#62b0e5", link: "https://twitter.com/MasterBrewsNFT" },
  { icon: faRedditAlien, color: "#ff4300", link: "https://reddit.com/r/masterbrews" },
  { icon: faMediumM, color: "#fac045", link: "https://blog.masterbrews.cards" },
]

export default function NewLayout({
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

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="newLayout">
        <Disclosure
          as="nav"
          ref={ref}
          className={`header fixed z-50 w-full px-0 py-3 ${headerClass} ${visibleClass ? "block" : "hidden"} `}
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
                            src="/whelps/newlogo.png"
                            alt="Workflow"
                          />
                        </Link>
                      </div>
                      <div className="hidden sm:block sm:ml-6">
                        <div className="flex space-x-4">
                          <div>
                            <ul className="navMenus">
                              {newMenus.map(dt => (
                                <li className="py-2 px-3 font-muka-bold" key={dt.name} >
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
                              {icons.map(dt => (
                                <li className="py-2 pl-3">
                                  <a href={dt.link} target="_blank" rel="noreferrer" key={dt.icon}>
                                    <div
                                      className="iconContainer"
                                    >
                                      <FontAwesomeIcon color={'white'} icon={dt.icon}  />
                                    </div>
                                  </a>
                                </li>
                              ))}
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
                      {newMenus.map(dt => (
                        <li className="py-2 px-3 font-muka-bold" key={dt.name}>
                          <Link
                            activeClassName="active"
                            to={dt.path}
                            target={dt.target}
                          >
                            {dt.name}
                          </Link>
                        </li>
                      ))}
                      <li className="py-2 px-3 w-full">
                        <div className="mb-2 flex align-middle justify-center mt-4">
                          <ul className="flex justify-center flex-grow">
                            {icons.map(dt => (
                              <a href={dt.link} target="_blank" rel="noreferrer" key={dt.icon}>
                                <div
                                  className="iconContainer mx-2"
                                >
                                  <FontAwesomeIcon color={'white'} icon={dt.icon}  />
                                </div>
                              </a>
                            ))}
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
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

        <div className="footerWrapper min-w-full">
          <div className="footer container mx-auto w-full flex flex-col md:flex-row items-center lg:justify-center">
            <div>
              <div className="mt-4 flex align-middle justify-center mb-4">
                <ul className="flex justify-between flex-grow">
                  {icons.map(dt => (
                    <a href={dt.link} target="_blank" rel="noreferrer" key={dt.icon}>
                      <div
                        className="iconContainer"
                      >
                        <FontAwesomeIcon color={'white'} icon={dt.icon}  />
                      </div>
                    </a>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
