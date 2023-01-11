  function handlePackError() {
    // alert("Something went wrong!");
    console.log("Something went wrong!");
  }

  function handlePackWithLuchador(packNo, cards) {
    // alert(`Your pack with ID ${packNo} contained cards ${cards} and an NFT Luchador!!`);
    console.log(`Your pack with ID ${packNo} contained cards ${cards} and an NFT Luchador!!`);
  }

  function handlePackWithFreePack(packNo, cards) {
    // alert(`Your pack with ID ${packNo} contained cards ${cards} and a FREE pack!!`);
    console.log(`Your pack with ID ${packNo} contained cards ${cards} and a FREE pack!!`);
  }

  function handlePackWithDistributor(packNo, cards) {
    // alert(`Your pack with ID ${packNo} contained cards ${cards} and a Distributor card!!`);
    console.log(`Your pack with ID ${packNo} contained cards ${cards} and a Distributor card!!`);
  }

  function handlePackWithMasterBrewer(packNo, cards) {
    // alert(`Your pack with ID ${packNo} contained cards ${cards} and a Master Brewer card!!`);
    console.log(`Your pack with ID ${packNo} contained cards ${cards} and a Master Brewer card!!`);
  }

  function handlePackWithBrewmaster(packNo, cards) {
    // alert(`Your pack with ID ${packNo} contained cards ${cards} and a Brewmaster NFT!!`);
    console.log(`Your pack with ID ${packNo} contained cards ${cards} and a Brewmaster NFT!!`);
  }

  function handlePackWithPLSTY(packNo, cards) {
    // alert(`Your pack with ID ${packNo} contained cards ${cards} and a PLS&TY NFT!!`);
    console.log(`Your pack with ID ${packNo} contained cards ${cards} and a PLS&TY NFT!!`);
  }

  function handlePackWithoutGift(packNo, cards) {
    // alert(`Your pack with ID ${packNo} contained cards ${cards}.`);
    console.log(`Your pack with ID ${packNo} contained cards ${cards}.`);
  }

  const GIFTNO_NOTHING = 0;
  const GIFTNO_LUCHADOR = 1;
  const GIFTNO_FREE_PACK = 2;
  const GIFTNO_DISTRIBUTOR = 3;
  const GIFTNO_MASTER_BREWER = 4;
  const GIFTNO_BREWMASTER = 5;
  const GIFTNO_PLSTY = 6;

  export function displayPackReward(txReceipt, contract) {
    console.log(txReceipt);

    const packOpenedEvent = txReceipt.events.PackOpened;
    if (!packOpenedEvent) {
      handlePackError();
      return;
    } 

    const packNo = parseInt(packOpenedEvent.returnValues._packNo);
    const cardNo = parseInt(packOpenedEvent.returnValues._cardNo);
    const count = parseInt(packOpenedEvent.returnValues._count);
    const giftNo = parseInt(packOpenedEvent.returnValues._giftNo);

    const cards = [...Array(count).keys()].map((index) => `#${index+1+cardNo}`);

    switch (giftNo) {
      case GIFTNO_NOTHING:
        handlePackWithoutGift(packNo, cards);
        break;
      case GIFTNO_LUCHADOR:
        handlePackWithLuchador(packNo, cards);
        break;
      case GIFTNO_FREE_PACK:
        handlePackWithFreePack(packNo, cards);
        break;
      case GIFTNO_DISTRIBUTOR:
        handlePackWithDistributor(packNo, cards);
        break;
      case GIFTNO_MASTER_BREWER:
        handlePackWithMasterBrewer(packNo, cards);
        break;
      case GIFTNO_BREWMASTER:
        handlePackWithBrewmaster(packNo, cards);
        break;
      case GIFTNO_PLSTY:
        handlePackWithPLSTY(packNo, cards);
        break;
      default:
        console.log("Something went wrong!");
        break;
    }

    const animationId = selectAnimationId(giftNo, count);
    return animationId;
  }

  export function selectAnimationId(giftNo, count) {
    return giftNo * 3 + Math.floor(count/2);
  }

  export function getAnimationUrl(animationId) {
    //return "https://art.masterbrews.cards/animations/Open-Pack-Animation-1card-distributor.mp4";
    switch (animationId) {
      case 0: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-1card-nobonus.mp4";
      case 1: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-3card-nobonus.mp4";
      case 2: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-5card-nobonus.mp4";
      case 3: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-1card-luchador.mp4";
      case 4: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-3card-luchador.mp4";
      case 5: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-5card-luchador.mp4";
      case 6: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-1card-freepack.mp4";
      case 7: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-3card-freepack.mp4";
      case 8: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-5card-freepack.mp4";
      case 9: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-1card-distributor.mp4";
      case 10: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-3card-distributor.mp4";
      case 11: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-5card-distributor.mp4";
      case 12: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-1card-masterbrewer.mp4";
      case 13: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-3card-masterbrewer.mp4";
      case 14: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-5card-masterbrewer.mp4";
      case 15: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-1card-brewmaster.mp4";
      case 16: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-3card-brewmaster.mp4";
      case 17: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-5card-brewmaster.mp4";
      case 18: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-1card-plsty.mp4";
      case 19: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-3card-plsty.mp4";
      case 20: return "https://art.masterbrews.cards/animations/Open-Pack-Animation-5card-plsty.mp4";
    }
  }