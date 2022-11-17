import { useStepContext } from "@mui/material"
import { useState, useEffect, React } from "react"
import { toast } from "react-toastify"
import { HexColorPicker } from "react-colorful";

export default function TemplateProfileCreation(){
    const [address, setAddress] =  useState("La dirección de tu restaurante")
    const [name, setName] =  useState("El nombre de tu restaurante")
    const [averagePrice, setAveragePrice] = useState("El precio medio de tu restaurante")
    const [chef, setChef] =  useState("Dietas especiales")
    const [cuisine, setCuisine] =  useState("Tipo de cocina de tu restaurante")
    const [description, setDescription] = useState("Información general sobre tu restaurante")
    const [insta, setInstagram] =  useState("@")
    const [face, setFacebook] =  useState("@")
    const [telf, setTelf] =  useState("El número de teléfono de tu restaurante")
    const [img, setImg] = useState()
    const [color, setColor] = useState()
    const [update, setUpdateNow] = useState(false)
    useEffect(() => {
        localStorage.setItem("ch", 0)
        fetch("/admin/restaurant" ,{method: 'GET', credentials: 'include'}).then(response => response.json()).then((data) => {
            if(data.status != false){
                setAddress(data.address)
                setName(data.name)
                setAveragePrice(data.pricerange)
                setChef(data.chef)
                setCuisine(data.food)
                setDescription(data.info)
                setImg(data.img)
                setInstagram(data.insta)
                setFacebook(data.face)
                setTelf(data.phone)
                setColor(data.color)
                return
            }
        })
        var addressElement = document.getElementById("restaurantAddress")
        var nameElement = document.getElementById("restaurantName")
        var priceElement = document.getElementById("averagePrice")
        var cuisineElement = document.getElementById("restaurantCuisine")
        var chefElement = document.getElementById("restaurantChef")
        var descriptionElement = document.getElementById("restaurantInfo")
        var instaElemet = document.getElementById("restaurantInstagram")
        var faceElement = document.getElementById("restaurantFacebook")
        var telfElement = document.getElementById("restaurantTelf")
        var events = ['keyup', 'keydown']
        events.forEach((ev) => {
            addressElement.addEventListener(ev, (e) => {
                setAddress(e.target.value)
            })
            instaElemet.addEventListener(ev, (e) => {
                setInstagram(e.target.value)
            })
            telfElement.addEventListener(ev, (e) => {
                setTelf(e.target.value)
            })
            faceElement.addEventListener(ev, (e) => {
                setFacebook(e.target.value)
            })
            nameElement.addEventListener(ev, (e) => {
                setName(e.target.value)
            })
            priceElement.addEventListener(ev, (e) => {
                setAveragePrice(e.target.value)
            })   
            cuisineElement.addEventListener(ev, (e) => {
                setCuisine(e.target.value)
            }) 
            chefElement.addEventListener(ev, (e) => {
                setChef(e.target.value)
            }) 
            descriptionElement.addEventListener(ev, (e) => {
                setDescription(e.target.value)
            }) 
    
        })

    }, [])
    useEffect(() => {
        if(localStorage.getItem("ch") != null && parseInt(localStorage.getItem("ch")) < 2){
            var checker = localStorage.getItem("ch")
            console .log(checker)
            localStorage.setItem("ch", parseInt(checker) + 1 )
            return
        }
        else if(localStorage.getItem("ch") != null && parseInt(localStorage.getItem("ch")) >= 2){
                fetch("/admin/restaurant/", {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({name: name, address: address, pricerange: averagePrice, chef: chef, food: cuisine, description: description, instagram: insta, facebook: face, telf: telf, color: color})
                }).then(response => response.json()).then((data) => {
                    if(data.status != false){
                        toast.success("¡Los detalles de tu restaurante han sido actualizados con éxito!")
                    }
                }) 
        }   
}, [update])
    var tetle;
    useEffect(() => {
        clearTimeout(tetle)
        tetle = setTimeout(() => {
            setUpdateNow(!update)
        }, 1000)
    }, [color, cuisine, name, address, description, averagePrice, chef, insta, face, telf])

    return(
        <>
    <div className="card card-style" style={{height: "90%", padding: "10px", overflow: 'unset'}}>
    <div className="editor" id="flexContainer">
        <div className="input-style has-borders no-icon validate-field mb-4">
        <input type="text" className="form-control validate-text" id="restaurantName"  placeholder={name} />
        <label htmlFor="restaurantName" className="color-highlight">Nombre de tu restaurante</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(Nombre)</em>
      </div>
        <div className="input-style has-borders no-icon validate-field mb-4">
        <input type="text" className="form-control validate-text" id="averagePrice"  placeholder={averagePrice} />
        <label htmlFor="averagePrice" className="color-highlight">Rango de precios que tu restaurante ofrece</label>
        <i className="fa fa-times disabled invalid color-red-dark" /> 
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(Precio)</em>
      </div>
        <div className="input-style has-borders no-icon validate-field mb-4">
        <input type="text" className="form-control validate-text" id="restaurantAddress"  placeholder={address} />
        <label htmlFor="restaurantAddress" className="color-highlight">La dirección de tu restaurante</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(Dirección)</em>
      </div>
      <div className="input-style has-borders no-icon validate-field mb-4">
        <input type="text" className="form-control validate-text" id="restaurantCuisine"  placeholder={cuisine} />
        <label htmlFor="restaurantCuisine" className="color-highlight">Especialidad y la cocina que ofreces en tu restaurante</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(Cocina)</em>
      </div>
      <div className="input-style has-borders no-icon validate-field mb-4">
        <input type="text" className="form-control validate-text" id="restaurantChef" placeholder={chef}  />
        <label htmlFor="restaurantChef" className="color-highlight">Dietas especiales de tu restaurante</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(Dietas)</em>
      </div>
      <div className="input-style has-borders no-icon validate-field mb-4">
        <input type="text" className="form-control validate-text" id="restaurantInstagram" placeholder={insta}  />
        <label htmlFor="restaurantInstagram" className="color-highlight">Instagram</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(Instagram)</em>
      </div>
      <div className="input-style has-borders no-icon validate-field mb-4">
        <input type="text" className="form-control validate-text" id="restaurantFacebook" placeholder={face}  />
        <label htmlFor="restaurantFacebook" className="color-highlight">Facebook</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(Facebook)</em>
      </div>
      <div className="input-style has-borders no-icon validate-field mb-4">
        <input type="text" className="form-control validate-text" id="restaurantTelf" placeholder={telf}  />
        <label htmlFor="restaurantTelf" className="color-highlight">Número de teléfono</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(Teléfono)</em>
      </div>
      <div className="input-style has-borders no-icon validate-field mb-4">
        <textarea id="restaurantInfo"placeholder={description} />
        <label htmlFor="restaurantInfo" className="color-highlight">Descripción general de tu restaurante</label>
        <em className="mt-n3">(Descripción)</em>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
      </div>
      <h2 style={{textAlign: 'center', marginLeft: '5%'}}>Escoje el color del botón para ver tu carta</h2>
      <HexColorPicker className="colorSelector1" id="colorPicker" color={color != null ? color : ' #97d81d'} onChange={setColor}/>
    </div>
    </div>
    <div className="preview" style={{width: '50%', marginLeft: '25%', marginTop: '10%'}}>
    <div class="card preload-img" data-src="https://www.effiliation.com/wp-content/uploads/2018/10/test.png" data-card-height="480">
            <div class="card-top m-3">
                <div class="notch-clear">
                    <a data-back-button href="#" class="icon icon-xs bg-white color-black rounded-m"><i class="fa fa-angle-left"></i></a>
                </div>
            </div>
            <div class="card-bottom ms-5 mb-1">
                <h1 class="font-40 font-900 line-height-xl mt-4">
                    {name}
                </h1>
                <p class="mb-3">
                    <i class="fa fa-map-marker font-11 me-2"></i>
                    {address}
                </p>
                <div class="d-flex pb-4">
                    <div class="align-self-center flex-grow-1">
                        <span class="font-11">
                            
                        </span>
                        <p class="mt-n2 mb-0">
                            <strong class="color-theme pe-2">5</strong>
                            <i class="fa fa-star color-yellow-dark"></i>
                            <i class="fa fa-star color-yellow-dark"></i>
                            <i class="fa fa-star color-yellow-dark"></i>
                            <i class="fa fa-star color-yellow-dark"></i>
                            <i class="fa fa-star color-yellow-dark"></i>
                        </p>
                    </div>
                </div>
            </div>
            <div class="card-overlay bg-gradient-fade-small"></div>
        </div>

        <div class="card card-overflow card-style mt-n5">
            <div class="content">
                <p>
                    {description}
                </p>

                <div class="row mb-0">
                    <div class="col-4">
                        <span class="font-11">Comida</span>
                        <p class="mt-n2 mb-3">
                            <strong class="color-theme">{cuisine}</strong>
                        </p>
                    </div>
                    <div class="col-4">
                        <span class="font-11">Precio medio</span>
                        <p class="mt-n2 mb-3">
                            <strong class="color-theme">{averagePrice}</strong>
                        </p>
                    </div>
                    <div class="col-4">
                        <span class="font-11">Dietas especiales</span>
                        <p class="mt-n2 mb-3">
                            <strong class="color-theme">{chef}</strong>
                        </p>
                    </div>

                </div>

                <div class="divider mt-3"></div>
                {insta == "@" && face == "@" && telf == "El número de teléfono de tu restaurante" ? null:
                <div style={{display: "flex", gap: "10%",justifyContent: "center", alignContent: 'center'}}>
                    {insta == "@" ? null: <><img style={{width: "50px", height: "50px"}}src="/images/icons/insta.png"></img><p className="socialHandle">@{insta}</p></>}
                    {face == "@" ? null: <><img style={{width: "50px", height: "50px"}}src="/images/icons/face.png"></img><p className="socialHandle">@{face}</p></>}
                    {telf == "El número de teléfono de tu restaurante" ? null: <><img style={{width: "50px", height: "50px"}}src="/images/icons/wa.png"></img><p className="socialHandle">+34{telf}</p></>}
                </div>
                }
                <a href="#" class="btn btn-full btn-m font-900 text-uppercase rounded-sm shadow-l mt-4" style={{backgroundColor : color}}>Ver la Carta</a>

            </div>
        </div> 
    </div>
    </>)
}