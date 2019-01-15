pragma solidity ^0.5.0;

contract InstagramPosting{
    
    struct Post{
        address owner;
        string imgHash;
        string textHash;
    }
    
    mapping(address => string) public username;
    mapping(uint256 => Post) posts;
    uint256 postCtr;
    
    
    event NewPost(string _img, string _text);
    
    function sendHash(string memory _img, string memory _text) public {
        Post storage posting = posts[++postCtr];
        posting.owner = msg.sender;
        posting.imgHash = _img;
        posting.textHash = _text;
        
        emit NewPost(_img, _text);
    }
    
    //Just to make things neat and clean for the UI. 
    //Users can provide their custom names as display.
    function setName(string memory _name) public {
        username[msg.sender] = _name;
    }
    
    function getCounter() public view returns(uint256) {
        return postCtr;
    }
    
    function getHash(uint256 _index) public view returns (string memory img, string memory text, address owner) {
        owner = msg.sender;
        img = posts[_index].imgHash;
        text = posts[_index].textHash;
    }
}