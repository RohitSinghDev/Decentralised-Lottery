// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Lottery{
    // array in solidity is a reference type
    address public manager;
    address[] public players;


    constructor(){
        manager = msg.sender;
    }

    function enter() public payable{
        require(msg.value>0.001 ether);
        players.push(msg.sender);

    }

    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty,block.timestamp,players)));
    }

    function pickWinner()public restricted{
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);//initialise the array to initial size 0
        // players = new address[](5);[0x00000,0x0000,0x0000,0x0000,0x0000]
    }
    //when a modifier is given to a function, the complete code of the fucntion is taken and given to the modifier 
    // which replaces the underscore and our function internally chnages to:
    // modifier restricted(){
    //     require(msg.sender==manager);
    //     uint index = random() % players.length;
    //     payable(players[index]).transfer(address(this).balance);
    //     players = new address[](0);
    // }
    // 

    modifier restricted(){
        require(msg.sender==manager);
        _;
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }
}
