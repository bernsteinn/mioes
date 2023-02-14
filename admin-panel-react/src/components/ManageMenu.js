import { useEffect, useState } from "react";
import { ToastContainer, Toast, toast } from "react-toastify";
import { HexColorPicker } from "react-colorful";
import Sidebar from "./Sidebar"
export default function ManageMenu(){
  const [newCategoryName, setNewCategory] = useState()
  const [newProductCategory, setNewProductCategory] = useState()
  const [newProductPrice, setPrice] = useState()
  const [newProductName, setName] = useState()
  const [categorySelected, setProductCategory] = useState()
  const [updateNow, setUpdateNow] = useState(false)
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  const [actualEditingProduct, setActualEditingProduct] = useState()
  const [actualEditingCategory, setActualEditingCategory] = useState()
  const [actualEditingId, setActualEditingId] = useState()
  const [editedCategoryName, setEditedCategoryName] = useState()
  const [menuColor, setMenuColor] = useState("#ff5733");
  const [titleMenu, setTitle] = useState("Previsualización")
  const [colorUpdated, setUpdatedColor] = useState()
  const [font, setFont] = useState("SourceSansPro")
  var present;
    useEffect(() => {
      const goBackButton = document.createElement("span")
      goBackButton.classList.add("fas")
      goBackButton.classList.add("fa-arrow-left")
      goBackButton.onclick = function(){setUpdateNow(!updateNow)}
      goBackButton.id = "arrowBack"
      const selectContainer = document.getElementById("categoriesList")
      var categorySelector;
      selectContainer.innerHTML = ''
        fetch("/admin/session/menu", {credentials: 'include'}).then(response => response.json()).then((data) => {
            if(data.status != false && data.menu != undefined && data.menu != null){
                const container = document.getElementById("savedMenu")
                container.innerHTML = ""
                const selectContainer = document.getElementById("categoriesList")
                setMenuColor(data.color)
                setTitle(data.titleMenu)
                setFont(data.font)
                const title = document.createElement("h1")
                title.innerText = data.titleMenu
                title.style.textAlign = "center"
                title.style.fontFamily = font
                title.className = font
                title.contentEditable = true
                title.id = "menuTitle"
                title.addEventListener("keyup", (e) => {
                  clearTimeout(timeout3)
                  timeout3 = setTimeout(() => {
                    var data = new FormData()
                    data.append("newTitle", e.target.innerText)
                    fetch("/admin/session/menu/updatetitle", {method: 'POST', credentials: 'include', body: data}).then(r => r.json()).then((data) => {
                      if(data.status != true){
                        toast.error("Algo ha ido mal, vuelvelo a intentar")
                        return
                      }
                      setTitle(e.target.innerText)
                      setUpdateNow(!updateNow)
                      return
                    })
                  }, 1000)
                })                    
                container.append(title)
                data.menu.forEach((category)=>{
                    var categoryElement = document.createElement("div")
                    categorySelector = document.createElement("option")
                    categorySelector.value=category.name
                    categorySelector.innerText=category.name
                    selectContainer.appendChild(categorySelector)
                    categoryElement.innerHTML = `<img style="margin-bottom:-120px" src="${category.img}" class="mx-auto shadow-xl rounded-circle over-card image-category" id="categoryImg">
                    <div style="padding-top:120px;" class="card card-style">
                        <div class="content">
                        <h1 contentEditable="true" data-originaltext="${category.name}" id="changeCategoryName" class="text-center font-36 mt-3">${category.name}</h1>

            `              
                  category.products.forEach((product) => {
                          categoryElement.innerHTML = categoryElement.innerHTML + `<div class="d-flex mb-3">
                          <div class="align-self-center w-100">
                              <h1 class="mb-n2 font-16 font-500 opacity-70" id="editProduct" data-al="${JSON.stringify(product.allergens)}" data-al-list="${product.listOfAllergies}" data-price="${product.price}€" data-id="${product.productId}" data-category="${category.name}"data-img="${product.img}" data-menu="menu-modal-cart-edit">${product.name}</h1>
                          </div>
                          <div class="align-self-center ms-auto">
                              <h1 class="font-16 mb-0 font-500 opacity-70 ">${product.price}€</h1>
                          </div>
                      </div>`
                        }) 
                      categoryElement.innerHTML = categoryElement.innerHTML + '</div></div>' 
                      container.appendChild(categoryElement)
                    })
                    var categoryTitles = document.querySelectorAll("#changeCategoryName")
                    var timeout
                    if(categoryTitles.length > 0){
                      categoryTitles.forEach((title) => {
                        title.addEventListener("keyup", (e) => {
                          clearTimeout(timeout)
                          timeout = setTimeout(() => {
                            var categoryData = new FormData()
                            categoryData.append("name", e.target.innerHTML.toString())
                            categoryData.append("oldName", e.target.dataset.originaltext.toString())
                            fetch("/admin/session/menu/editcategory", {method: 'POST', credentials: 'include', body: categoryData }).then(res => res.json()).then((data) => {
                              if(data.status != false){
                                setUpdateNow(!updateNow)
                                return
                              }
                            })
                          }, 800)
                        })
                      })
                    }
                    var productsElements = document.querySelectorAll('#editProduct')
                    if(productsElements.length > 0){
                      productsElements.forEach(element => {
                      element.addEventListener("click", (e) => {
                        document.getElementById("productToEditTitle").value = e.target.innerText
                        setActualEditingProduct(e.target.innerText.toString())
                        setActualEditingCategory(e.target.dataset.category)
                        setActualEditingId(e.target.dataset.id)
                        document.getElementById("productToEditPrice").value = e.target.dataset.price
                        setSelectedFile(e.target.dataset.img)
                        setPreview(e.target.dataset.img)
                    })
                  })
                  }
                  }
                  else{
                    const title = document.createElement("h1")
                    title.innerText = titleMenu
                    title.contentEditable = true
                    title.style.textAlign = "center"
                    title.className = font
                    title.style.fontFamily = font
                    title.id = "menuTitle"
                    title.addEventListener("keyup", (e) => {
                      clearTimeout(timeout3)
                      timeout3 = setTimeout(() => {
                        var data = new FormData()
                        data.append("newTitle", e.target.innerText)
                        fetch("/admin/session/menu/updatetitle", {method: 'POST', credentials: 'include', body: data}).then(r => r.json()).then((data) => {
                          if(data.status != true){
                            return
                          }
                          return
                        })
                      }, 1000)
                    })                    
                    const text = document.createElement("p")
                    text.innerText = "Aún no hay nada por aquí. Empieza creando una nueva categoría."
                    const container = document.getElementById("savedMenu")
                    container.innerHTML = ""
                    container.append(title, text)
                  }
                  
                  
                  var menuOpen = document.querySelectorAll('[data-menu]');
                  var wrappers = document.querySelectorAll('.header, #footer-bar, .page-content');
              
                  menuOpen.forEach(el => el.addEventListener('click',e =>{
                      //Close Existing Opened Menus
                      const activeMenu = document.querySelectorAll('.menu-active');
                      for(let i=0; i < activeMenu.length; i++){activeMenu[i].classList.remove('menu-active');}
                      //Open Clicked Menu
                      var menuData = el.getAttribute('data-menu');
                      document.getElementById(menuData).classList.add('menu-active');
                      document.getElementById(menuData).style.display = "block"
                      document.getElementsByClassName('menu-hider')[0].classList.add('menu-active');
                      //Check and Apply Effects
                      var menu = document.getElementById(menuData);
                      var menuEffect = menu.getAttribute('data-menu-effect');
                      var menuLeft = menu.classList.contains('menu-box-left');
                      var menuRight = menu.classList.contains('menu-box-right');
                      var menuTop = menu.classList.contains('menu-box-top');
                      var menuBottom = menu.classList.contains('menu-box-bottom');
                      var menuWidth = menu.offsetWidth;
                      var menuHeight = menu.offsetHeight;
              
                      if(menuEffect === "menu-push"){
                          var menuWidth = document.getElementById(menuData).getAttribute('data-menu-width');
                          if(menuLeft){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX("+menuWidth+"px)"}}
                          if(menuRight){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX(-"+menuWidth+"px)"}}
                          if(menuBottom){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY(-"+menuHeight+"px)"}}
                          if(menuTop){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY("+menuHeight+"px)"}}
                      }
                      if(menuEffect === "menu-parallax"){
                          var menuWidth = document.getElementById(menuData).getAttribute('data-menu-width');
                          if(menuLeft){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX("+menuWidth/10+"px)"}}
                          if(menuRight){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX(-"+menuWidth/10+"px)"}}
                          if(menuBottom){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY(-"+menuHeight/5+"px)"}}
                          if(menuTop){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY("+menuHeight/5+"px)"}}
                      }
                  }));
              
                  //Closing Menus
                  const menuClose = document.querySelectorAll('.close-menu, .menu-hider');
                  menuClose.forEach(el => el.addEventListener('click',e =>{
                      const activeMenu = document.querySelectorAll('.menu-active');
                      for(let i=0; i < activeMenu.length; i++){activeMenu[i].classList.remove('menu-active');}
                      //for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX(-"+0+"px)"}
                      var iframes = document.querySelectorAll('iframe');
                      iframes.forEach(el => {var hrefer = el.getAttribute('src'); el.setAttribute('newSrc', hrefer); el.setAttribute('src',''); var newSrc = el.getAttribute('newSrc');el.setAttribute('src', newSrc)});
                  }));
                  
                })
             
    }, [newCategoryName, updateNow])    
    useEffect(() => {
      if (!selectedFile) {
          setPreview(undefined)
          return
      }
      if(typeof selectedFile != "string"){
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
      }
  }, [selectedFile])
    var timeout2
    var timeout3
    useEffect(() => {
      document.getElementById("newCategory").addEventListener("keyup", (e) => {
        clearTimeout(timeout2)
        timeout2 = setTimeout(() => {
          setNewCategory(e.target.value.toString())
        }, 1000)
      })
      if(document.getElementById("menuTitle")){
      document.getElementById("menuTitle").addEventListener("keyup", (e) => {
        clearTimeout(timeout2)
        timeout2 = setTimeout(() => {
          setTitle(e.target.innerText)
          setUpdateNow(!updateNow)
        }, 1000)
      })
    }
      document.getElementById("categoriesList").addEventListener("change", (e) => {
        setNewProductCategory(e.target.value)
      })
      document.getElementById("fontFamily").addEventListener("change", (e) => {
        setFont(e.target.value)
        document.getElementById("menuTitle").className = ""
        document.getElementById("menuTitle").classList.add(e.target.value)
        document.getElementById("menuTitle").setAttribute('style', `text-align : center`)
      })
      document.getElementById("newProductName").addEventListener("keyup", (e) => {
        setName(e.target.value)
      })
      document.getElementById("newProductPrice").addEventListener("keyup", (e) => {
        setPrice(e.target.value)
      })
    }, [])
    useEffect(() => {
      if(colorUpdated != undefined){
          setMenuColor(colorUpdated)
          var data = new FormData()
          data.append("color", colorUpdated)
          fetch("/admin/session/menu/updatecolor", {method: 'POST', credentials: 'include', body:data}).then(r => r.json()).then((data) => {
            if(data.status != true){
              return
            }
            return
          })
        }
    }, [colorUpdated])
    useEffect(() => {
      var data = new FormData()
      data.append("font", font)
      if(font != "SourceSansPro"){
        if(document.getElementById("menuTitle")){
          document.getElementById("menuTitle").className = ""
          document.getElementById("menuTitle").classList.add(font)  
        }
        document.getElementById("fontFamily").defaultValue = font
      fetch("/admin/session/menu/updatefont", {method: 'POST', credentials: 'include', body:data}).then(r => r.json()).then((data) => {
        if(data.status != true){
          toast.error("Algo ha ido mal, porfavor vuelvelo a intentar.")
          return
        }
        return
      })
    }
    }, [font])
    function deleteProduct(event){
      event.preventDefault()
      var productName = actualEditingProduct
      var productCategory = actualEditingCategory
      console.log(productName)
      fetch("/admin/session/menu/deleteproduct", {method: 'POST', credentials: 'include',headers:{'Content-Type': 'application/json'}, body: JSON.stringify({name: productName, category: productCategory})}).then(response => response.json()).then((data) => {
        if(data.status == true){
          setUpdateNow(!updateNow)
          return
        }
        toast.error(data.err)
      })
    }
    function editProduct(){
      var oldTitle = actualEditingProduct
      var category = actualEditingCategory
      var newTitle = document.getElementById("productToEditTitle").value
      var newPrice = document.getElementById("productToEditPrice").value 
      var newImage = selectedFile
      var newPrice = newPrice.replace("€", "").toString()
      const data = new FormData()
      data.append("additives", present)
      data.append("title", newTitle)
      data.append("price", newPrice)
      data.append("img", newImage)
      data.append("oldTitle", oldTitle)
      data.append("category", category)
      data.append("productId", actualEditingId)
      fetch("/admin/session/menu/editproduct", {method: 'POST', credentials: 'include', body:data}).then(response => response.json()).then((data) => {
        if(data.status != false){
          setSelectedFile(undefined)
          setUpdateNow(!updateNow)
          return
        }
      })
    }
    function newCategory(){
      if(newCategoryName == undefined | newCategoryName == null | newCategoryName == ""){
        toast.error("¡El nombre de la categoría no puede estar vacío!")
        return
      }
      const checkImg = () => {try{if(selectedFile['type'].includes('image')) return true}catch{return false}}
      if(!checkImg() || selectedFile == undefined){
          document.getElementById("img-error").style.color = "red"
          document.getElementById("img-error").innerText = "Porfavor, sube una imagen."
          toast.error("Porfavor sube una imagen de tu producto")
          return
      }  
      const data = new FormData();
      data.append("categoryName", newCategoryName)
      data.append("img", selectedFile)
      fetch("/admin/session/menu/newcategory", {method: 'POST', credentials: 'include', body: data}).then(response => response.json).then((data) => {if(data.status != false){setNewCategory(""); setSelectedFile(undefined); }})
    }
    function addProduct(){
      const checkImg = () => {try{if(selectedFile['type'].includes('image')) return true}catch{return false}}
      if(!checkImg() || selectedFile == undefined){
          document.getElementById("img-error").style.color = "red"
          document.getElementById("img-error").innerText = "Porfavor, sube una imagen."
          toast.error("Porfavor sube una imagen de tu producto")
          return
      }  
      const formData = new FormData();
      var selectorAllergiesUnchecked = document.querySelectorAll(".allergie")
      var additivesListToSend = []
      selectorAllergiesUnchecked.forEach((unchecked) => {
        if(unchecked.checked){
          var aditive = {presence: true, name: unchecked.value}
          additivesListToSend.push(aditive)  
        }
        else{
          var aditive = {presence: false, name: unchecked.value}
          additivesListToSend.push(aditive)  
        }
      })
      if(document.getElementById("allergensOn").checked){
        var present = true
      }
      else{
        var present = false
      }
      var priceOfProduct = newProductPrice.replace(/\D/g,'');
      formData.append("category", document.getElementById("categoriesList").value)
      formData.append("additivesPresent", present)
      if(present){
        formData.append("additives", JSON.stringify(additivesListToSend))
      }
      formData.append("name", newProductName)
      formData.append("price", parseFloat(priceOfProduct))
      formData.append("img", selectedFile)
      fetch("/admin/session/menu/newproduct", {method: 'POST', credentials: 'include', body: formData}).then(response => response.json).then((data) => {if(data.status != false){ setUpdateNow(!updateNow); setSelectedFile(undefined)}})
    }
    const onSelectFile = e => {
      if (!e.target.files || e.target.files.length === 0) {
          setSelectedFile(undefined)
          return
      }
      setSelectedFile(e.target.files[0])
  }
  const onSelectFileEdit  = e => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }
    setSelectedFile(e.target.files[0])

}
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const allergens = (ev) => {
  var selectorElement = document.getElementById("selectorAllergies")
  if(ev.target.checked){
    const listOfAllergies = ["Gluten", "Crustáceos", "Huevos", "Pescado", "Cacahuetes", "Soja", "Lácteos", "Frutos con cáscara", "Apio", "Mostaza", "Sésamo", "Sulfitos", "Altramuces", "Moluscos"]
    listOfAllergies.forEach((allergie) => {
      var id = makeid(5)
      const inputContainer = document.createElement("label")
      const input = document.createElement("input")
      input.type = "checkbox" 
      input.id = id
      input.className = "allergie"
      input.value = allergie
      inputContainer.innerText = allergie + " "
      inputContainer.htmlFor = id
      inputContainer.append(input)
      inputContainer.style.margin = "2%"
      selectorElement.append(inputContainer)
    })
  }
  else{
    selectorElement.innerHTML = ""
  }
}
    return(<>
    <Sidebar element = {   
      
        <div>
        <div>
        <div class="menu-hider"></div>
        <div class="page-content" style={{maxWidth: "400px", bottom: "140px",position: "relative"}}>
  <div className="card card-style">
    <div className="content">
      <h1 className="font-21">Crea el menú de tu restaurante</h1>
      <p className="color-highlight font-12 mt-n3 pt-1 mb-2">Crea tu menú ahora!</p>
      <p>
        Los usuarios verán este menu y podrán interactuar con este.
      </p>
    </div>
  </div>
  <div className="card card-style">
    <div className="content mb-0" id="tab-group-1">
      <div data-bs-parent="#tab-group-1" className="collapse show" id="tab-1">
        <div className="list-group list-custom-small">
          <a href="#" data-menu="menu-modal-reservation"><i className="fa fa-calendar color-blue-dark" /><span>Nueva categoría</span><i className="fa fa-angle-right" /></a>
          <a href="#" data-menu="menu-modal-cart"><i className="fa fa-shopping-bag color-green-dark" /><span>Nuevo producto</span><i className="fa fa-angle-right" /></a>
          <a href="#" data-menu="menu-modal-allergies"><i className="fa fa-allergies color-red-dark" /><span>Alérgenos</span><i className="fa fa-angle-right" /></a>
          <p style={{marginBottom: "0 !important", textAlign: 'center'}}>Selecciona un color de fondo para tu menú</p>
          <HexColorPicker className="colorSelector" id="colorPicker" color={menuColor} onChange={setUpdatedColor}/>
          <p style={{marginTop: "-5%", textAlign: "center"}}>Selecciona una tipografía para el titulo de tu menú</p>
          <select defaultValue={font} id="fontFamily" style={{marginBottom: "10%", marginTop: '-12%'}}>
            <option value={'Athletics'}>Athletics</option>
            <option value={'Ropers'}>Ropers</option>
            <option value={'Personal'}>Personal</option>
            <option value={'SourceSansPro'}>Source Sans Pro</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div id="menu-modal-reservation" className="menu menu-box-modal menu-box-detached">
    <div className="menu-title"><h1>Nueva categoría</h1><a href="#" className="close-menu"><i className="fa fa-times" /></a></div>
    <div className="divider divider-margins mb-1" />
    <div className="content">
      <div className="input-style has-borders no-icon validate-field">
        <input type="name" className="form-control focus-blue validate-name" id="newCategory" placeholder="Nombre" />
        <label htmlFor="newCategory" className="color-highlight">Nombre</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(obligatorio)</em>
      </div>
      <div style={{padding: '10px'}}>
          <input type="file" id="actualBtn" onChange={onSelectFile} hidden/>
          <label style={{backgroundColor: "indigo", color: "white", padding: "0.5rem", borderRadius: "0.3rem", cursor: "pointer", marginTop: "1rem"}}for="actualBtn">Sube una imagen de la categoría</label>
          <img id="file-chosen" src={preview} style={{width: "100px", padding: "10px"}}></img>
          <p id="img-error"></p>
      </div>
      <a href="javascript:void(0);" onClick={newCategory} id="newCategoryButton" className="btn btn-m btn-full rounded-sm shadow-xl text-uppercase font-700 bg-red-dark mt-4 mb-3 close-menu">Crear categoría</a>
    </div>
  </div>
  <div id="menu-modal-cart" className="menu menu-box-modal menu-box-detached" style={{maxHeight: "100vh"}}>
    <div className="menu-title"><h1>Nuevo producto</h1><a href="#" className="close-menu"><i className="fa fa-times" /></a></div>
    <div className="divider divider-margins" />
    <div className="content mb-0">
      <div>
        <p className="selectCategoryTitle">Selecciona una categoría</p>
        <select id="categoriesList"></select>
      <div className="input-style has-borders no-icon validate-field">
        <input type="name" className="form-control focus-blue validate-name" id="newProductName" placeholder="Nombre" />
        <label htmlFor="newProductName" className="color-highlight">Nombre</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(obligatorio)</em>
      </div>
      <div className="input-style has-borders no-icon validate-field">
        <input type="text" className="form-control focus-blue validate-name" id="newProductPrice" placeholder="Precio" />
        <label htmlFor="newProductPrice" className="color-highlight">Precio</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(obligatorio)</em>
      </div>
      <input type="checkbox" id="allergensOn" onChange={allergens} />¿Este producto contiene alérgenos?
      <div id="selectorAllergies"></div>
      <div style={{padding: '10px'}}>
          <input type="file" id="actualBtn" onChange={onSelectFile} hidden/>
          <label style={{backgroundColor: "indigo", color: "white", padding: "0.5rem", borderRadius: "0.3rem", cursor: "pointer", marginTop: "1rem"}}for="actualBtn">Sube una imagen de tu producto</label>
          <img id="file-chosen" src={preview} style={{width: "100px", height: '100px', padding: "10px"}}></img>
          <p id="img-error"></p>
      </div>
    </div>
    <a href="#" onClick={addProduct}className="btn btn-fuºll btn-m font-800 rounded-sm text-uppercase bg-blue-dark close-menu">Añadir producto</a>
      <div className="row mb-3">
        <div className="col-6"></div>
      </div>
    </div>
  </div>
  <div id="menu-modal-cart-edit" className="menu menu-box-modal menu-box-detached" style={{maxHeight: '100vh'}}>
    <div className="menu-title"><h1>Editar producto</h1><div class="divider divider-margins"></div><p style={{marginRight: "50px"}}>Para cambiar la imagen simplemente presiona el botón "Cambiar imagen" y sube tu nueva imagen.</p><a href="#" className="close-menu"><i className="fa fa-times" /></a></div>
    <div className="divider divider-margins" />
    <div className="content mb-0">
      <div>
        <div className="d-flex mb-4">
          <div>
            <img id="productToEditImage" src={preview} className="rounded-m shadow-xl" width={120} />
            <div style={{padding: '10px'}}>
          <input type="file" id="actualBtn" onChange={onSelectFileEdit} hidden/>
          <label style={{backgroundColor: "#30302c", color: "white", padding: "5px", borderRadius: "0.3rem", cursor: "pointer", marginTop: "1rem"}}for="actualBtn">Cambiar imagen</label>
          <p id="img-error"></p>
        </div>
          </div>
          <div className="ms-3">
            <input className="font-600" id="productToEditTitle"></input>
            <input className="color-highlight" id="productToEditPrice"></input><br></br>
            <a href="javascript:void(0);" onClick={deleteProduct} style={{cursor: "pointer"}} className="color-theme opacity-50 font-10 close-menu"><i className="fa fa-times color-red-dark pe-2 pt-3" />Borrar producto</a>
          </div>
          <input type="checkbox" id="allergensEdit" />¿Este producto contiene alérgenos?
          <div id="selectorAllergiesEdit"></div>
        </div>
      </div>
      <a href="javascript:void(0);" onClick={editProduct} className="close-menu btn  btn-m font-800 rounded-sm btn-full text-uppercase bg-green-light">Guardar</a>
      <div className="row mb-3">
        <div className="col-5">
        </div>
      </div>
    </div>
  </div>
</div>
</div>
<div id="savedMenu" class="menuPreview" style={{backgroundColor: menuColor}}></div>
</div>}></Sidebar></>)
}