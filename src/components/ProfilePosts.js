import React, { Component } from 'react';
import './App.css';
import web3 from './contracts/tools/web3';
import ipfs from './contracts/tools/ipfs';
import storehash from './contracts/tools/storehash';
import {Grid, Form, Button, Table} from 'react-bootstrap';


class ProfilePosts extends Component {
 
    state = {
      imgHash: null,
      textHash: null,
      buffer:'',
      bufferDesc: '',
      ethAddress:'',
      uploadListener: null,
      progressListener: '',  
      username: '' 
    };
    
    componentDidMount(){
        
    }
    

render() {
      
      return (
        <div className="ProfilePosts" style={{marginLeft: "20px"}}>

          
     </div>
      );
    } 
} 
export default ProfilePosts;