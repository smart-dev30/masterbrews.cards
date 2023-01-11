// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

contract Callee {
  function initialMigrateConsumerCard(address minter, uint256 index);
  function initialMigrateDistributorCard(address minter, uint256 index);
  function initialMigrateMasterBrewerCard(address minter, uint256 index);
}

contract PackBrewDisbursement is Ownable {
  address public mainContract = address(0);
  
  function setMainContract(address mainContractAddress) external onlyOwner {
    mainContract = mainContractAddress;
  }
  
  function migrateContractHolders() external onlyOwner {
    Callee main = Callee(mainContract);
    
    // code goes here ------------------------
    main.initialMigrateConsumerCard("0xE0A36930F4b1E0a06788Bf3d3a860db999Bb4210", 1);
    main.initialMigrateConsumerCard("0xE0A36930F4b1E0a06788Bf3d3a860db999Bb4210", 2);
    main.initialMigrateConsumerCard("0xE0A36930F4b1E0a06788Bf3d3a860db999Bb4210", 3);
    main.initialMigrateConsumerCard("0xE0A36930F4b1E0a06788Bf3d3a860db999Bb4210", 4);
    main.initialMigrateConsumerCard("0xE0A36930F4b1E0a06788Bf3d3a860db999Bb4210", 5);
    
    main.initialMigrateDistributorCard("0xE0A36930F4b1E0a06788Bf3d3a860db999Bb4210", 1);
    main.initialMigrateDistributorCard("0xE0A36930F4b1E0a06788Bf3d3a860db999Bb4210", 2);
    
    main.initialMigrateMasterBrewerCard("0xE0A36930F4b1E0a06788Bf3d3a860db999Bb4210", 1);
    // ---------------------------------------
  }
}
