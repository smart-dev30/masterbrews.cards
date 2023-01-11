import React, { useState, useEffect } from "react"

import abi_master from "./../ABIs/abi-master.json"
import abi_distributor from "./../ABIs/abi-distributor.json"
import abi_consumer from "./../ABIs/abi-consumer.json"
import abi_mainnft from "./../ABIs/abi-mainnft.json"

import {
  CONTRACT_ADDRESS_MASTER,
  CONTRACT_ADDRESS_DISTRIBUTOR,
  CONTRACT_ADDRESS_CONSUMER,
  CONTRACT_ADDRESS_MAINNFT,
} from '@config/addresses'

export default function Migrate() {
  let walletReady = typeof window !== 'undefined' && window.__walletReady;
  let web3 = typeof window !== 'undefined' && window.__web3;
  let connectedAddress = typeof window !== 'undefined' && window.__connectedAddress;

  const [consumerHolders, setConsumerHolders] = useState([]);
  const [distributorHolders, setDistributorHolders] = useState([]);
  const [masterBrewerHolders, setMasterBrewerHolders] = useState([]);
  const [bonusItemHolders, setBonusItemHolders] = useState([]);
  const [blockNo, setBlockNo] = useState("");

  useEffect(() => {
    pollConnectReady();
    setInterval(() => {
      pollConnectReady();
    }, POLL_CONNECT_READY_TIMEOUT);
  }, []);

  const POLL_CONNECT_READY_TIMEOUT = 1000;
  function pollConnectReady() {
    if ((web3 !== window.__web3) || (walletReady !== window.__walletReady) || (connectedAddress !== window.__connectedAddress)) {
      walletReady = window.__walletReady;
      web3 = window.__web3;
      connectedAddress = window.__connectedAddress;

      if (walletReady && web3 && connectedAddress) {
        refreshTokens();
      } else {
        setMasterBrewerHolders([]);
        setDistributorHolders([]);
        setConsumerHolders([]);
      }
    }
  }

  async function refreshTokens() {
    setBlockNo("LOADING.......");
    setConsumerHolders([]);
    setDistributorHolders([]);
    setMasterBrewerHolders([]);
    setBonusItemHolders([]);

    if (web3 == null || walletReady == false) {
      console.log("No web3");
      return;
    }

    await refreshHoldersInContract(abi_consumer, CONTRACT_ADDRESS_CONSUMER, setConsumerHolders);
    await refreshHoldersInContract(abi_distributor, CONTRACT_ADDRESS_DISTRIBUTOR, setDistributorHolders);
    await refreshHoldersInContract(abi_master, CONTRACT_ADDRESS_MASTER, setMasterBrewerHolders);

    setBlockNo(await web3.eth.getBlockNumber());
  }

  async function refreshEvents() {
    setBlockNo("LOADING.......");
    setConsumerHolders([]);
    setDistributorHolders([]);
    setMasterBrewerHolders([]);
    setBonusItemHolders([]);

    if (web3 == null || walletReady == false) {
      console.log("No web3");
      return;
    }

    await refreshPackOwners(abi_mainnft, CONTRACT_ADDRESS_MAINNFT, setBonusItemHolders);

    setBlockNo(await web3.eth.getBlockNumber());
  }

  function giftNoToString(giftNo) {
    switch (parseInt(giftNo)) {
      case 0: return "No bonus";
      case 1: return "Luchador";
      case 2: return "Free pack";
      case 3: return "Distributor";
      case 4: return "Master Brewer";
      case 5: return "Brewmaster";
      case 6: return "PLS&TY";
      default: return "Error";
    }
  }

  async function refreshPackOwners(abi, address, setFunc) {
    if (web3 == null || walletReady == false) {
      console.log("No web3");
      return;
    }

    if (await web3.eth.getCode(address) == "0x") {
      // no contract on this network
      console.log("No contract");
      return;
    }

    const holders = [];
    const contract = new web3.eth.Contract(abi, address);
    contract.events.PackOpened({}, { fromBlock: 0, toBlock: 'latest' }, (error, eventResult) => {
      if (error) {
        console.log('Error in PackOpened event handler: ' + error);
      } else {
        // console.log('PackOpened: ' + JSON.stringify(eventResult));

        if (eventResult.returnValues._giftNo > 0) {
          let newHolder = {
            owner: eventResult.returnValues._owner,
            bonusItem: giftNoToString(eventResult.returnValues._giftNo),
            packNo: parseInt(eventResult.returnValues._packNo) + 1,
          };
          holders.push(newHolder);
        }
      }
    });

    setFunc(holders);
  }

  async function refreshHoldersInContract(abi, address, setFunc) {
    if (web3 == null || walletReady == false) {
      console.log("No web3");
      return;
    }

    if (await web3.eth.getCode(address) == "0x") {
      // no contract on this network
      console.log("No contract");
      return;
    }

    const contract = new web3.eth.Contract(abi, address);
    const tokens = [];
    
    const numberOfTokens = await contract.methods.totalSupply().call();
    for (let i = 0; i < numberOfTokens; i++) {
      const tokenId = await contract.methods.tokenByIndex(i).call();
      const owner = await contract.methods.ownerOf(tokenId).call();

      tokens.push({tokenId, owner});
    }

    setFunc(tokens);
  }

  function formatCode(consumers, distributors, masters, blockNo, bonuses) {
    const consumerString = consumers.map((t) => `main.initialMigrateConsumerCard("${t.owner}", ${t.tokenId});`).reduce((p, c) => `${p}\n${c}`, "");
    const distributorString = distributors.map((t) => `main.initialMigrateDistributorCard("${t.owner}", ${t.tokenId});`).reduce((p, c) => `${p}\n${c}`, "");
    const masterString = masters.map((t) => `main.initialMigrateMasterBrewerCard("${t.owner}", ${t.tokenId});`).reduce((p, c) => `${p}\n${c}`, "");

    const bonusString = bonuses.map((t) => `Bonus NFT - ${t.bonusItem}: ${t.owner} in pack ${t.packNo}`).reduce((p, c) => `${p}\n${c}`, "");

    return `\n// Updated at block ${blockNo}\n${consumerString}\n${distributorString}\n${masterString}\n${bonusString}`;
  }

  return (
    <div className="mt-16">
      <h2 class="text-4xl text-center uppercase outlineText md:text-5xl">Migrate information</h2>
      <button class="justify-center gap-2 items-center bg-green-400 hover:bg-green-300 text-sm text-black font-bold py-2 px-4 rounded-sm" onClick={() => refreshTokens()}>Refresh migration</button>
      <button class="justify-center gap-2 items-center bg-green-400 hover:bg-green-300 text-sm text-black font-bold py-2 px-4 rounded-sm ml-1" onClick={() => refreshEvents()}>Refresh events</button>
      <textarea style={{width: 100 + '%', height: 500 + 'px', marginTop: 50 + 'px'}} value={formatCode(consumerHolders, distributorHolders, masterBrewerHolders, blockNo, bonusItemHolders)}></textarea>
    </div>
  )
}
