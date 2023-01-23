// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";



contract RandomWinnerGame is VRFConsumerBase, Ownable {
      
      uint public fee;
      bytes32 public keyHash;
      address[] public playerAddress;
      uint public maxPlayer;
     
      uint public entryfee;
      uint public gameId;

      event GameStarted(uint gameId,uint maxPlayer,uint entryfee);

      event PlayerJoined(uint gameId,address player);

      event gameEnded(uint gameId,address winner,bytes32 requestId);

      enum gameState {
         notStarted,
         isRunning,
         start,
         end
      }

      
      error invalidState();

      ///havint not enough ether
      error insufficientfund();

      ///reach max limit
      error reachMaxLimit();

       
      gameState public State;
      constructor(address vrfCoordinator,address linkToken,bytes32 vrfKeyHash,uint vrfFee )
           VRFConsumerBase(vrfCoordinator,linkToken){
           keyHash = vrfKeyHash;
           fee= vrfFee;
           State = gameState.notStarted;
        }
      
      function gameStarted(uint _maxPlayer,uint _entryfee) external{
            if(State == gameState.isRunning){
                revert invalidState();
            }
            delete playerAddress;

            maxPlayer = _maxPlayer;

            entryfee = _entryfee ;

            State = gameState.start;

            gameId+=1;
            
            emit GameStarted(gameId, maxPlayer, entryfee);
      }

      function playerJoin() external payable {

         if(State==gameState.end || State==gameState.notStarted){
            revert invalidState();
         }
         if(msg.value < entryfee){
            revert insufficientfund();
         }
         if(playerAddress.length > maxPlayer){
            revert reachMaxLimit();
         }
         playerAddress.push(msg.sender);

         if(playerAddress.length == maxPlayer){
             getRandomWinner();
         }

      }

     function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual override {
         
         uint winnerIndex = randomness % playerAddress.length;

         address winner = playerAddress[winnerIndex];

         (bool send,) = winner.call{value:address(this).balance}("");
         if(!send){
            revert();
         }
         emit gameEnded(gameId, winner, requestId);

         State = gameState.end;
      }

      function getRandomWinner() private returns(bytes32 requestId){

    
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
   
        return requestRandomness(keyHash, fee);
      }

       receive() external payable{}

       fallback() external payable{}




}