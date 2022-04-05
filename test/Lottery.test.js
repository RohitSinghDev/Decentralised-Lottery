const assert = require("assert");
const AsyncEventEmitter = require("async-eventemitter");
const ganache = require("ganache-cli");
const { from } = require("memorystream");
const { json } = require("mocha/lib/reporters");
const Web3 = require("web3");

const { abi, evm } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let Lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  Lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: 1000000 });

  //   console.log(Lottery);
});

describe("Lottery", () => {
  it("lottery deployed", () => {
    assert.ok(Lottery.options.address);
  });

  it("players entered", async () => {
    // await Lottery.methods.enter().call({ from: accounts[1] }, () => {
    //   //   web3.eth.sendTransaction({
    //   //     from: accounts[1],
    //   //     to: Lottery.options.address,
    //   //     value: web3.utils.toWei("1", "ether"),
    // });
    // let players_length = await Lottery.methods.players.length;
    // let player = await Lottery.methods.players(players_length - 1).call();
    // assert.equal(player, accounts[1]);
    let players;
    for (let i = 1; i < 4; i++) {
      await Lottery.methods.enter().send({
        from: accounts[i],
        value: web3.utils.toWei("0.02", "ether"),
        //   to: Lottery.options.address,//not req in this case but doesnt cause error
      });
      players = await Lottery.methods.getPlayers().call({ from: accounts[0] });
      assert.equal(accounts[i], players[players.length - 1]);
    }
    // console.log(players);
  });

  it("requires minimum amount of ether", async () => {
    try {
      await Lottery.methods.enter().send({
        from: accounts[1],
        value: 0,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("only manager can call pickwinner", async () => {
    try {
      await Lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("player has entered and winner picked", async () => {
    await Lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("1", "ether"),
    });
    let initial_balance = await web3.eth.getBalance(accounts[1]);

    await Lottery.methods.pickWinner().send({ from: accounts[0] });

    let finalBalance = await web3.eth.getBalance(accounts[1]);

    // let difference = initial_balance - finalBalance;
    // assert(difference > web3.utils.toWei("0.8", "ether"));

    assert.notEqual(initial_balance, finalBalance, "player won");

    let playersFinal = await Lottery.methods.getPlayers().call();
    assert.equal(0, playersFinal.length, "players initiated empty");
    let lotteryBalance = await web3.eth.getBalance(Lottery.options.address);

    assert.equal(0, lotteryBalance);
  });
});
