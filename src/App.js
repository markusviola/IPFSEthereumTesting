import React, { Component } from 'react';
import './App.css';
import web3 from './contracts/tools/web3';
import ipfs from './contracts/tools/ipfs';
import storehash from './contracts/tools/storehash';
import {Grid, Form, Button, Table} from 'react-bootstrap';
import axios from 'axios';


class App extends Component {
 
    state = {
      imgHash: null,
      textHash: null,
      buffer:'',
      bufferDesc: '',
      ethAddress:'',
      uploadListener: null,
      progressListener: '',  
      username: '',
      currentPosts: []

    };
    
    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
    };

    postDescription(evt){
        this.convertToBufferDesc(evt.target.value);
    }

    convertToBuffer = async(reader) => {
      const buffer = await Buffer.from(reader.result);
      this.setState({buffer});
    };

    convertToBufferDesc = async(reader) => {
      const bufferDesc = await Buffer.from(reader);
      this.setState({bufferDesc});
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
      
        console.log('Sending from Metamask account: ' + accounts[0]);
        const ethAddress= await storehash.options.address;
        this.setState({ethAddress});
        this.setProgressListener("(Uploading data to IPFS...)");

        await ipfs.add(this.state.buffer, (err, ipfsHash) => {

          console.log("[IPFS] Post Image Hash: "+ipfsHash);

          this.setState({ imgHash:ipfsHash[0].hash }, async ()=>{

            await ipfs.add(this.state.bufferDesc, (err, ipfsHash) => {

              console.log("[IPFS] Post Description Hash: "+ipfsHash);
              this.setState({ textHash:ipfsHash[0].hash }, async () => {

                
                await storehash.methods.sendHash(this.state.imgHash, this.state.textHash).send({
                  from: accounts[0] 
                }, (error, transactionHash) => {
                  if(typeof transactionHash !== 'undefined'){
                    this.setProgressListener("(Storing hashes to Ethereum...)");
                    storehash.once('NewPost', {from: accounts[0]}, 
                    (err, evt)=>{
                      this.setProgressListener("");
                      alert("Transaction Finished!")
                      console.log("Transaction Finished!");
                    })
                  }
                  else{
                    this.setProgressListener("");
                  }
                }); 
              });
            })
          });
        })
    }; 

    componentDidMount(){
      this.getPosts();
    }

    async getPosts(){
      const accounts = await web3.eth.getAccounts();
      storehash.methods.getCounter().call({from: accounts[0]},
        async (err, result)=>{
        if(err === null){
          let posts = [];
          for(let i=1; i<=result; i++){
            await storehash.methods.getHash(i).call({from: accounts[0]},
              (err, result)=>{
                axios.get("https://gateway.ipfs.io/ipfs/"+result.text)
                  .then(res => {
                    posts.push({
                      owner: result.owner,
                      textHash: res.data,
                      imgHash: result.img,
                    });    
                  }
                )
                
              }
            )
          }

          this.setState({currentPosts: posts},()=>{
            console.log(this.state.currentPosts);
          })

        }
      })

      
    }

    setProgressListener(msg){
      this.setState({progressListener: msg})
    }

render() {
      
      let progress = "";
      let displayedName = "";


      if(this.state.progressListener !== "") {
        progress = <div>{this.state.progressListener}<br/></div>
      }

      return (
        <div className="App" style={{marginLeft: "20px"}}>

          <header className="App-header">
            <h1> Instagram w/ Ethereum + IPFS</h1>
          </header>
          
          <hr />
          <Grid>
            {progress}
            <h3> Choose file to send to IPFS </h3>
            
            <Form onSubmit={this.onSubmit}>
              <textarea placeholder="Enter caption..." onChange = {this.postDescription.bind(this)} style={{width:"400px", height:"150px"}} /><br/><br/>
              <input type = "file" onChange = {this.captureFile} />
              <br/><br/>
              <Button 
              bsStyle="primary" 
              type="submit"> 
              Post
              </Button>
            </Form>
            <hr/>
          </Grid>
          <img className ="square-img" src="https://gateway.ipfs.io/ipfs/QmYfFDNkQHRtismkhJoanyXV3fPnRV97hULMGDTgKESt9a"/>
     </div>
      );
    } //render
} //App
export default App;