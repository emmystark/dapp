// Assuming you have MetaMask or a similar provider injected
// If not, you might need to connect to a specific network provider
const provider = new ethers.BrowserProvider(window.ethereum);

// Replace with the actual contract address after deployment
const contractAddress = "YOUR_CONTRACT_ADDRESS";

// Replace with the ABI of your SimpleStorage contract
// You can get this from the artifacts/contracts/SimpleStorage.sol/SimpleStorage.json file after compiling
const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newValue",
          "type": "uint256"
        }
      ],
      "name": "DataStored",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        }
      ],
      "name": "set",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

let simpleStorageContract;

async function connectWallet() {
    try {
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        simpleStorageContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("Wallet connected and contract instance created.");
    } catch (error) {
        console.error("Error connecting wallet:", error);
    }
}

async function setValue() {
    if (!simpleStorageContract) {
        alert("Please connect your wallet first.");
        return;
    }
    const newValue = document.getElementById("newValue").value;
    try {
        const tx = await simpleStorageContract.set(newValue);
        await tx.wait(); // Wait for the transaction to be mined
        console.log("Value set successfully!");
    } catch (error) {
        console.error("Error setting value:", error);
    }
}

async function getValue() {
    if (!simpleStorageContract) {
        alert("Please connect your wallet first.");
        return;
    }
    try {
        const value = await simpleStorageContract.get();
        document.getElementById("storedValue").innerText = value.toString();
        console.log("Value retrieved:", value.toString());
    } catch (error) {
        console.error("Error getting value:", error);
    }
}

// Connect wallet when the page loads
connectWallet();
