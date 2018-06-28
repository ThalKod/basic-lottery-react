import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {

  state={
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    isManager: false
  };

  async componentDidMount(){

    const manager = await lottery.methods.manager().call();
    const accounts = await web3.eth.getAccounts();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);


    this.setState(()=>({ manager, players, balance }));

  
    if(accounts[0] === this.state.manager){
      this.setState(()=>({isManager: true}));
    }

  }

  onSubmit = async (event) =>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transactions success...." });
    
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether") 
    });

    this.setState({ message: "You have been entered" });
  };

  onClick = async ()=>{
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transactions success...." });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: "A winner has been picked" });

  }; 

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
        This contract is managed by: {this.state.manager} <br />
        There are curently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, "ether")} ether !
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
            <h4>Wan to try your luck ?</h4>
            <div>
                <label htmlFor="">Amount of ether to enter: </label>
                <input 
                    type="text"
                    value={this.state.value}
                    onChange={event => this.setState({ value: event.target.value })}
                />
            </div>
            <button>Enter</button>
        </form>

        <hr />

        {this.state.isManager && (
          <div>
            <h4>Ready to pick a winner ?</h4>
            <button onClick={this.onClick}>Pick a winner</button>
            <hr />
          </div>
        )}
        

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
