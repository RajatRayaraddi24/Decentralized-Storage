import React from 'react'
import { useState, useEffect } from "react"

import Loader from './Loader'

function Display({ contract, account, provider }) {
  const [images, setImages] = useState([])

  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState("");
  const getData = async () => {
    let dataArray;
    console.log(userInput)
    setLoading(true)
    console.log(await provider.getCode(account))
    try {
      if (userInput) {
        dataArray = await contract.connect(provider.getSigner()).display(userInput)
        console.log(dataArray)
      }
      else {
        console.log("acc is ",account)
        console.log(await provider.getCode(account))
        
        dataArray = await contract.connect(provider.getSigner()).display(account)
        console.log(dataArray)

      }
      console.log(dataArray)
    } catch (e) {
      console.log(e)
      console.log("You dont have access")
      alert("You don't have access");
    }
   
    const isEmpty = dataArray && Object?.keys(dataArray)?.length === 0;

    if (!isEmpty) {
      const str = dataArray?.toString();
      const str_array = str?.split(",");
      setImages(str_array)
      setLoading(false)
      // const images = str_array.map((item, i) => {
      //   console.log(item.substring(7))
      //   return(
      //     <a href={`item`} key={i} target="_blank" rel="noreferrer">
      //       <img 
      //         key={i}
      //         src={`https://gateway.pinata.cloud/ipfs/${item.substring(7)}`}
      //         alt="imag"

      //       />
      //     </a>
      //   )
      // })
      // setImages(images)
    } else {
      alert("No image to display");
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-wrap flex-col">
      <div className='flex overflow-auto m-auto'>
      {images?.map((image, index) => (
        <a key={index} href={`https://gateway.pinata.cloud/ipfs/${image?.substring(6)}`} alt="some img" target="_blank" rel="noreferrer">
        <img
          // key={image}
          src={`https://gateway.pinata.cloud/ipfs/${image?.substring(6)}`}
          alt="placeholder"
          className="w-32 h-32 object-cover m-2"
        />
        </a>
      ))}
      </div>
      <div class="input-group mt-4 m-auto">
        <input type="text" class="input" id="input" name="input" placeholder="Account address" autocomplete="off"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <input class="button--submit" value="Get Images" type="submit"
          onClick={() => getData()}
        />
      </div>
      { loading && <Loader />}
    </div>
  )
}

export default Display 