import { useState, useEffect } from "react";
import axios from "axios"
import { ethers } from "ethers"
import Upload from "../artifacts/contracts/upload.sol/Upload.json"

import Loader from "./Loader";

function FileUpload({ provider }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const fileList = [...e.dataTransfer.files];
      const selectedFile = fileList.find((file) => file.type.startsWith("image/"));

      if (selectedFile) {
        setFile(selectedFile);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    }
  };

  console.log(file)

  async function handleSubmit() {
    if (file) {
      try {
        setLoading(true)
        const signer = provider.getSigner();
        let contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"


        const contract = new ethers.Contract(
          contractAddress, Upload.abi, signer
        )

        const address = await signer.getAddress();

        const formData = new FormData();
        formData.append("file", file);

        console.log("formdara", formData)
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "09f0c666c2e9231840b0",
            pinata_secret_api_key: "76f66d44c42ebacbcfa98d0950ef28617b50e134570b3c7b916a9b1de526daf4",
            "Content-Type": "multipart/form-data"
          }
        }
        )
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        await contract.connect(provider.getSigner()).add(address, ImgHash);
        console.log(ImgHash);
        setLoading(false)
        // signer.add(account, ImgHash)
        setFile(null)
      } catch (error) {
        console.log("Unable to upload", error)
        alert("Failed to upload image !")
        setLoading(false)
      }
    }
  }
  return (
    <div className="border-2 border-gray-300 border-dashed p-4 rounded-3xl m-7 w-max">
      <div className="flex items-center justify-center">
        {file ? (
          <img src={URL.createObjectURL(file)} alt="Selected file" className=" h-[300px]" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.707 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0L14 8.586V11a1 1 0 11-2 0V9.414l-2.293 2.293a1 1 0 01-1.414 0l-4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <div className="ml-4 text-gray-600 rounded-3xl">
          {file ? (
            <p className="mb-2">{file.name}</p>
          ) : (
            <div className="flex flex-col text-xl">
              <p className="mb-2">Drag and drop an image here</p>
              <p className=" text-center">or</p>
              <label htmlFor="file-upload" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 text-center rounded cursor-pointer">
                Select Image
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>
      </div>
     {file && ( <div className="w-full mt-4">
        <p className="bg-green-500 p-3 text-center text-white cursor-pointer rounded-md justify-center" onClick={() => handleSubmit()}>Upload</p>
      </div>)}
      {loading && <Loader />}
    </div>
  );
}

export default FileUpload;
