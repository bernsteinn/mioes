import { useState } from "react"

export default function TemplateProfileCreation(){
    const [address, setAddress] = useState()
    const [name, setName] = useState()
    const [averagePrice, setAveragePrice] = useState()

    var addressElement = document.getElementById("restaurantAddress")
    var nameElement = document.getElementById("restaurantName")
    var priceElement = document.getElementById("averagePrice")
    addressElement.addEventListener("change", (e) => {
        setAddress(e.target.value)
    })
    nameElement.addEventListener("change", (e) => {
        setName(e.target.value)
    })
    priceElement.addEventListener("change", (e) => {
        setAveragePrice(e.target.value)
    })
    return(
    <div className="editor">
        <form>
            <input id="restaurantAddress" placeholder="El nombre de tu restaurante"></input>
            <input id="restaurantName" placeholder="El nombre de tu restaurante"></input>
            <input id="averagePrice" placeholder="El precio medio de tu restaurante"></input>
        </form>
    </div>)
}