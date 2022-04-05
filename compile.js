const path = require("path"); //provides a cross system compactibility
const fs = require("fs");
const solc = require("solc");

const LotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(LotteryPath, "utf8");
// console.log(source);

// console.log(solc.compile(source, 1)); //second arg gives how many contracts we want to compile
var input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

// var output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log(output);

// // bytecode is the actual code that is stored and executed on the blockchain
// // console.log(output.contracts["Lottery.sol"]["Lottery"].abi);
// exports.abi = output.contracts["Lottery.sol"]["Lottery"].abi;
// exports.bytecode = output.contracts["Lottery.sol"]["Lottery"].evm.bytecode.object;

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Lottery.sol"
].Lottery;

// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts);
