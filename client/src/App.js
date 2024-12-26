import Upload from "./artifacts/contracts/upload.sol/Upload.json"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import Loader from "./components/Loader";

function App() {
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState(null)
  const [provider, setProvider] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [loading, setLoading] = useState(false)

  const [userInput, setUserInput] = useState("")
  const [options, setOptions] = useState(["abcd"])
  const [selectedOption, setSelectedOption] = useState("")

  useEffect(() => {
    setLoading(true)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        })

        window.ethereum.on("accountsChanged", () => {
          window.location.reload()
        })

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        // console.log((await signer.getBalance()).toString())


        setAccount(address);
        let contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

        // console.log(await provider.getCode(address))

        const contract = new ethers.Contract(
          contractAddress, Upload.abi, signer
        )
        console.log(signer)
        console.log(contract)
        console.log(provider)
        setContract(contract)
        setProvider(provider)
        setLoading(false)

        const addressList = await contract.shareAccess();
        console.log(addressList)
        setOptions(addressList)
        let select = document.querySelector("#selectNumber");
        const options = addressList;

        // for (let i = 0; i < options.length; i++) {
        //   let opt = options[i];
        //   let e1 = document.createElement("option");
        //   e1.textContent = opt;
        //   e1.value = opt;
        //   select.appendChild(e1);
        // }
        // const addressList = await contract.connect(provider.getSigner()).add("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199","abc");
        // console.log(addressList)
      } else {
        console.log("Metamask is not installed")
      }
    };
    provider && loadProvider();
  }, [])

  async function allow() {
    // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    console.log(selectedOption)
    if (!selectedOption) {
      alert("Please enter address !")
    } else {
      await contract.connect(provider.getSigner()).allow(selectedOption);
      alert("Access Granted")
    }
  }



  return (
    <div className="">
      <p className='text-3xl text-center font-bold m-4'>Decentralized Image Storage</p>
      <hr></hr>

      <p className="text-2xl text-blue-900 text-center m-4">Account : {account ? account : "Not connected"} </p>
      <button className="m-auto ml-10 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 text-center rounded cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        Share with
      </button>
      <div className="flex justify-center items-center">
        <FileUpload contract={contract} account={account} provider={provider} />
      </div>
      <div className="flex justify-center">
        <Display contract={contract} account={account} provider={provider} />
      </div>
      {/* <button onClick={() => allow()}> allow</button> */}
      {loading && <Loader />}
      {showModal && <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        showClose={false}
      >
        <div className="p-4">
          <h2 className="text-center text-2xl font-serif font-bold text-blue-500 m-4">Share With</h2>
          <input type="text" class="input" id="input" name="input" placeholder="Enter address" autocomplete="off"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          <form id="myForm" className="flex justify-center mt-4">
            <select id="selectNumber" value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="" className="address">People With Access</option>
              {
                options?.map((option, index) => (
                  <option value={option[0]} className="address" key={index}>{option}</option>
                ))
              }
            </select>
          </form>
          <div className="flex mt-4 gap-4">
            <button className="m-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 text-center rounded cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button className="m-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 text-center rounded cursor-pointer"
              onClick={() => allow(true)}
            >
              Share
            </button>
          </div>
        </div>
      </Modal>}
    </div>
  );
}

export default App;
