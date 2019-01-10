pragma solidity ^0.4.24;

contract InstagramPosting{
    
    struct Post{
        address owner;
        string ipfsHash;
    }
    
    mapping(uint256 => Post) posts;
    uint256 postCtr;
    
    function sendHash(string x) public {
        Post storage posting = posts[++postCtr];
        posting.owner = msg.sender;
        posting.ipfsHash = x;
    }
    
    function getCounter() public view returns(uint256) {
        return postCtr;
    }
    
    function getHash(uint256 index) public view returns (string x) {
        if(posts[index].owner == msg.sender){
            return posts[index].ipfsHash;
        }
        else return "INVALID";
    }
}