# Decentralized-Storage

### Steps to Run the Project

1.  **Start Hardhat Node**  
    Run the Hardhat node to simulate a local Ethereum network:
    `npx hardhat node` 
    
2.  **Deploy the Contract**  
    Deploy the smart contract to the local Hardhat network:
    `npx hardhat run scripts/deploy.js` 
    
    **Note:**  Use the contract address generated during deployment in the client application.
    
3.  **Start the Client**  
    Navigate to the client directory and start the development server:
    `cd client && npm run start`
