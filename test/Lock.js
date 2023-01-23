const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");
const { FEE, VRF_COORDINATOR, LINK_TOKEN, KEY_HASH } = require("../constants");


describe("Random winner game",function(){
    let randomWinnerContract,deploycontract,accounts;
    it('Deploying contract',async function(){
        [...accounts] = await ethers.getSigners();
        console.log("accounts:" ,accounts[0].address)
         randomWinnerContract = await ethers.getContractFactory("RandomWinnerGame");
         deploycontract = await randomWinnerContract.deploy(VRF_COORDINATOR,LINK_TOKEN,KEY_HASH,FEE);
         deploycontract.deployed();
        console.log("Contract Address:",deploycontract.address);
    })
    it('start the game',async function(){
       
        let txngameStarted = await deploycontract.gameStarted(5,2);
        await txngameStarted.wait();
        console.log("Entry fee,max players, game Sate",await deploycontract.entryfee(),await deploycontract.maxPlayer(),await deploycontract.State());
    })

    it('player join',async function(){
        let amount  = ethers.utils.parseEther("2") 
        let count = 0;
      let txnplayerJoin = await deploycontract.connect(accounts[1]).playerJoin({value:amount});
      await txnplayerJoin.wait();
      
      txnplayerJoin = await deploycontract.connect(accounts[2]).playerJoin({value:amount});
      await txnplayerJoin.wait();
      
      txnplayerJoin = await deploycontract.connect(accounts[3]).playerJoin({value:amount});
      await txnplayerJoin.wait();
      
      txnplayerJoin = await deploycontract.connect(accounts[4]).playerJoin({value:amount});
      await txnplayerJoin.wait();
      
      // txnplayerJoin = await deploycontract.connect(accounts[5]).playerJoin({value:amount});
      // await txnplayerJoin.wait();

    //   txnplayerJoin = await deploycontract.connect(accounts[6]).playerJoin({value:amount});
    //   await txnplayerJoin.wait();
      
      
      const contractBalance = await ethers.provider.getBalance(deploycontract.address);
      console.log("Contract Balance", contractBalance.toString());
     
        console.log("player address 0",await deploycontract.playerAddress(0));
        console.log("player address 1",await deploycontract.playerAddress(1));
      
    })
    

})