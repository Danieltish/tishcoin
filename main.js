const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    const startTime = Date.now();
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    const endTime = Date.now();
    console.log(`Block mined: ${this.hash} (Nonce: ${this.nonce}, Time Taken: ${(endTime - startTime) / 1000}s)`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.peers = []; // Simulates peer-to-peer nodes
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2017', 'Genesis Block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    console.log('Starting mining process...');
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.syncChainAcrossPeers(); // Propagate new block
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('Invalid block hash detected!');
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log('Invalid previous block hash detected!');
        return false;
      }
    }
    return true;
  }

  addPeer(peerAddress) {
    if (!this.peers.includes(peerAddress)) {
      this.peers.push(peerAddress);
      console.log(`Peer added: ${peerAddress}`);
    } else {
      console.log(`Peer ${peerAddress} already exists.`);
    }
  }

  syncChainAcrossPeers() {
    console.log('Syncing blockchain with peers...');
    this.peers.forEach((peer) => {
      console.log(`Blockchain synced with peer: ${peer}`);
    });
  }

  adjustDifficulty() {
    if (this.chain.length % 10 === 0) {
      this.difficulty++;
      console.log(`Difficulty increased to ${this.difficulty}`);
    }
  }
}

// Test the updated blockchain
let tishcoin = new Blockchain();

// Adding peers
tishcoin.addPeer('Peer1-Node');
tishcoin.addPeer('Peer2-Node');

console.log('Mining block 1...');
tishcoin.addBlock(new Block(1, '10/07/2017', { amount: 4 }));

console.log('Mining block 2...');
tishcoin.addBlock(new Block(2, '12/07/2017', { amount: 10 }));

console.log('Is chain valid?', tishcoin.isChainValid());

console.log('Mining block 3...');
tishcoin.addBlock(new Block(3, '15/07/2017', { amount: 15 }));

console.log('Blockchain:', JSON.stringify(tishcoin, null, 2));
