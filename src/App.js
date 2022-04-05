import "./App.css";
import web3 from "./web3";
import Lottery from "./Lottery";
import { useEffect, useState } from "react";
import bootstrap from "bootstrap";

const App = () => {
  // console.log(web3.version);

  // let accounts = web3.eth.getAccounts().then(console.log);

  const [managerAcc, setManager] = useState("");
  //setting manager of the contract

  const [playersArr, setPlayers] = useState([]);
  // getting players array

  const [contractBalance, setContractBalance] = useState(""); //we initialise the balance with empty string because it is not number but an object, a number that is wrapped in a library called big number js

  const [inputAmount, setInputAmount] = useState("");
  // input amount to put to lottery

  const [message, setMessage] = useState("");

  useEffect(() => {
    const asyncCall = async () => {
      // await Lottery.methods
      //   .manager()
      //   .call()
      //   .then((result) => setManager(result)); //this is called by the first account we sign in in metamask, like componentdidmount
      const manager = await Lottery.methods.manager().call();
      setManager(manager);

      const players = await Lottery.methods.getPlayers().call();
      setPlayers(players);

      const balance = await web3.eth.getBalance(Lottery.options.address);
      setContractBalance(balance);
    };
    asyncCall();
  }, []);

  const enterAmount = (event) => {
    setInputAmount(event.target.value);
  };

  const submitEnterForm = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("waiting for transactiuon to complete");

    // below await function will take 15-20 sec to execute
    await Lottery.methods.enter().send({
      from: accounts[0],
      // we are assuming the first account will be used to enter the lottery
      value: web3.utils.toWei(inputAmount, "ether"),
    });

    setMessage("transaction completed");
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("choosing a winner and sending award...");
    await Lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("winner has been picked and awarded!");
  };

  const display_btn = {
    display: "none",
  };

  const display2 = {
    display: "block",
  };

  const getAcc = async () => {
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  };

  const pickWinnerDisplay = () => {
    const account = getAcc();

    if (account == managerAcc) {
      return display2;
    }
    return display_btn;
  };

  return (
    <div>
      <h2>Lottery contract</h2>
      <p>managed by {managerAcc} </p>
      <p>{playersArr.length} have applied for lottery</p>
      <p>{web3.utils.fromWei(contractBalance, "ether")} ether deposited</p>
      <hr />
      <form onSubmit={submitEnterForm}>
        <h4>want to try your luck..?</h4>
        <div>
          <label>enter the amount to enter</label>
          <input type="text" onChange={enterAmount} value={inputAmount}></input>
        </div>
        <input type="submit"></input>
      </form>
      <hr />
      {/* <p>{pickWinnerDisplay()}</p> */}
      <button onClick={pickWinner} style={pickWinnerDisplay()}>
        pick winner
      </button>
      ;
      <hr />
      <h4>{message}</h4>
    </div>
  );
};

export default App;
