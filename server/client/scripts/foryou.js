setTimeout(function(){
    var preloader = document.getElementById('preloader')
    var imgLoaderContainer = document.getElementById("imgLoaderContainer")
    if(preloader){preloader.classList.add('preloader-hide'); imgLoaderContainer.hidden = true}
    if(localStorage.getItem("followed") == null || localStorage.getItem("followed") == undefined){
        localStorage.setItem("followed", JSON.stringify([]))
    }
},250);

function fetchPostsForMe(){
    document.querySelector(":root").style.setProperty('--option-left', "0px")
    fetch("/posts").then(response => response.json()).then((data) =>{
        var firstPosts = ""
        var txt = "Seguir"
        var style = ""
        var postArray = data.posts
        var used = []
        var template
        var ids = []
        while(used.length < postArray.length){
            const random = Math.floor(Math.random() * postArray.length)
            if(!used.includes(random)){
            var post = postArray[random]
            if(used.length == 0){
                txt = "Seguir"
                style = ""
                var author = post.author
                var authorForId = (author != null ? author.replace(/\s/g, '').toLowerCase(): null)
                id=post.id
                var followed = JSON.parse(localStorage.getItem("followed"))
                if(followed == null){
                    var a = [];
                    localStorage.setItem('followed', JSON.stringify(a));            
                }
                followed = JSON.parse(localStorage.getItem("followed"))
                if(followed.includes(author)){
                    txt = "Siguiendo"; 
                    style = "color: gray;"
                }
    
                var author = post.author
                var authorForId = (author != null ? author.replace(/\s/g, '').toLowerCase(): null)
                id=post.id    
                ids.push(id)
                if(!post.video){
                template= `
                <div class="card card-style" style="margin-top: 3%;">
            <div class="content mb-3">
                <!-- Avatar and Title -->
                <div class="d-flex">
                    <div class="align-self-center">
                        <img src="${post.profile_pic}"onclick="window.location = '${post.url}'" width="35" height="35" class="profileImg  rounded-xl me-2">
                    </div>
                    <div class="align-self-center ps-1">
                        <a href="${post.url}" class="font-600 font-14 line-height-s pe-2 mb-0" style="text-decoration: none; color: #6c6c6c !important;">${post.author}<a href="#"class="ps-2 ${authorForId}" id="${id}" style="${style}" onclick="follow('${author}', '${id.toString()}', '${authorForId}')">${txt}</a></a>
                        <h6 class="font-400 opacity-50 font-12 mb-0">${post.date}</h6>
                    </div>
                </div>
                <!-- Text and Question -->
                <h4 class="font-17 pt-2">${post.title}</h4>
                <p class="font-14 line-height-m pt-2 mb-3">
                    ${post.body}
                </p>
            </div>
            <img src="${post.img}" class="img-fluid mb-n2 mt-n3" id="postImg">
            <div id="${id}like-container"></div>
            <div class="content mb-3">
                <!-- Stats-->
                <!-- Controls-->
                <div class="d-flex pt-1">
                    <!-- Like & Dislike-->
                    <div class="d-flex border-theme rounded-l px-2 py-1">
                        <a href="#" class="theme pe-2">
                            <div class="rating">
                            </div>
                        </a>
                    </div>
                </div>        
            </div>
            </div>
                `
     
            }
            else{
                template= `
                <div class="card card-style" style="margin-top: 3%;">
            <div class="content mb-3">
                <!-- Avatar and Title -->
                <div class="d-flex">
                    <div class="align-self-center">
                        <img src="${post.profile_pic}"onclick="window.location = '${post.url}'" width="35" height="35" class="profileImg  rounded-xl me-2">
                    </div>
                    <div class="align-self-center ps-1">
                        <a href="${post.url}" class="font-600 font-14 line-height-s pe-2 mb-0" style="text-decoration: none; color: #6c6c6c !important;">${post.author}<a href="#"class="ps-2 ${authorForId}" id="${id}" style="${style}" onclick="follow('${author}', '${id.toString()}', '${authorForId}')">${txt}</a></a>
                        <h6 class="font-400 opacity-50 font-12 mb-0">${post.date}</h6>
                    </div>
                </div>
                <!-- Text and Question -->
                <h4 class="font-17 pt-2">${post.title}</h4>
                <p class="font-14 line-height-m pt-2 mb-3">
                    ${post.body}
                </p>
            </div>
            <video autoplay="" controls="" src="${post.img}" class="img-fluid mb-n2 mt-n3" id="postImg"></video>
            <div id="${id}like-container"></div>
            <div class="content mb-3">
                <!-- Stats-->
                <!-- Controls-->
                <div class="d-flex pt-1">
                    <!-- Like & Dislike-->
                    <div class="d-flex border-theme rounded-l px-2 py-1">
                        <a href="#" class="theme pe-2">
                            <div class="rating">
                            </div>
                        </a>
                    </div>
                </div>        
            </div>
            </div>
                `
     
            }
        }
            else{
                txt = "Seguir"
                style = ""
                var author = post.author
                var authorForId = (author != null ? author.replace(/\s/g, '').toLowerCase(): null)
                id=post.id
                var followed = JSON.parse(localStorage.getItem("followed"))
                if(followed == null){
                    var a = [];
                    localStorage.setItem('followed', JSON.stringify(a));            
                }
                followed = JSON.parse(localStorage.getItem("followed"))
                if(followed.includes(author)){
                    txt = "Siguiendo"; 
                    style = "color: gray;"
                }
    
                var author = post.author
                var authorForId = (author != null ? author.replace(/\s/g, '').toLowerCase(): null)
                id=post.id    
                ids.push(id)
                template= `
                <div class="card card-style">
            <div class="content mb-3">
                <!-- Avatar and Title -->
                <div class="d-flex">
                    <div class="align-self-center">
                        <img src="${post.profile_pic}" onclick="window.location = '${post.url}'"width="35" height="35" class="profileImg  rounded-xl me-2">
                    </div>
                    <div class="align-self-center ps-1">
                        <a href="${post.url}" class="font-600 font-14 line-height-s pe-2 mb-0" style="text-decoration: none; color: #6c6c6c !important;">${post.author}<a href="#"class="ps-2 ${authorForId}" id="${id}" style="${style}" onclick="follow('${author}', '${id.toString()}', '${authorForId}')">${txt}</a></a>
                        <h6 class="font-400 opacity-50 font-12 mb-0">${post.date}</h6>
                    </div>
                </div>
                <!-- Text and Question -->
                <h4 class="font-17 pt-2">${post.title}</h4>
                <p class="font-14 line-height-m pt-2 mb-3">
                    ${post.body}
                </p>
            </div>
            <img src="${post.img}" class="img-fluid mb-n2 mt-n3" id="postImg">
            <div id="${id}like-container"></div>          
            <div class="content mb-3">
                <!-- Stats-->
                <!-- Controls-->
                <div class="d-flex pt-1">
                    <!-- Like & Dislike-->
                    <div class="d-flex border-theme rounded-l px-2 py-1">
                        <a href="#" class="theme pe-2">
                            <div class="rating">
                            </div>
                        </a>
                    </div>
                </div>        
            </div>
            </div>
                `
    
            }
            used.push(random)
            firstPosts = firstPosts + template
        }
        }
        var container = document.getElementById("mainContainer")
        container.innerHTML = ""
        container.innerHTML = container.innerHTML = `<span id="followingSelected" style="position: relative;z-index: 10;
        top: -10px; cursor:pointer; margin-left: 28%;font-size: 15px;">Siguiendo</span>
        <span class="activeOption" id="formeSelected"style=" position: relative;
        top: -10px;cursor:pointer; z-index: 10;font-size: 15px;margin-left: 15%;">Para ti</span>
`       
        container.innerHTML = container.innerHTML + firstPosts
        var postsImages = document.querySelectorAll("#postImg")
        postsImages.forEach((image, i) => {
            image.addEventListener("dblclick", (e) => {
            document.getElementById(`${ids[i]}like-container`).classList.add("instagram-heart")
            console.log(e)
            setTimeout(() => {
                document.getElementById(`${ids[i]}like-container`).classList.remove("instagram-heart")
            }, 1100)
            })
        })
        setTimeout(() => {
            document.getElementById("formeSelected").addEventListener("click", (e) => {
                document.getElementById("followingSelected").classList.remove("activeOption")
                document.getElementById("formeSelected").classList.add("activeOption")
                fetchPostsForMe()
            })
            document.getElementById("followingSelected").addEventListener("click", (e) => {
                document.getElementById("formeSelected").classList.remove("activeOption")
                document.getElementById("followingSelected").classList.add("activeOption")
                fetchPostsFollowing()

        
            })    
        }, 200)
        

})
}
fetchPostsForMe()
function follow(user, id, clas){
    if(JSON.parse(localStorage.getItem('followed')).includes(user)){
        var arrayL = []
        JSON.parse(localStorage.getItem("followed")).every((followed) => {
            if(user == followed){
                var toFollow = document.getElementsByClassName(clas)
                document.getElementById(id).style.color = "#0a58ca"
                document.getElementById(id).innerText = "Seguir"          
                for(i = 0; i<toFollow.length; i++){
                    toFollow[i].style.color = "#0a58ca"
                    toFollow[i].innerText = "Seguir"
                }              
                return false
            }
            arrayL.push(followed)
            return true
        })
        localStorage.setItem("followed", JSON.stringify(arrayL))
        return
    }
    document.getElementById(id).style.color = "gray"
    document.getElementById(id).innerText = "Siguiendo"
    var toFollow = document.getElementsByClassName(clas)
    for(i = 0; i<toFollow.length; i++){
        toFollow[i].style.color = "gray"
        toFollow[i].innerText = "Siguiendo"
    }
    if(localStorage.getItem('followed') == null){
        var a = [];
        a.push(JSON.parse(localStorage.getItem('followed')));
        localStorage.setItem('followed', JSON.stringify(a));    
    }
    var followed = JSON.parse(localStorage.getItem('followed'))
    var n = []
    followed.push(user)
    localStorage.setItem("followed", JSON.stringify(followed))
}


function fetchPostsFollowing(){
    document.querySelector(":root").style.setProperty('--option-left', "-11px")
    var container = document.getElementById("mainContainer")
    container.innerHTML = ""
    container.innerHTML = container.innerHTML + `<span id="followingSelected" class="activeOption" style="position: relative;z-index: 10;
    top: -10px;cursor:pointer; margin-left: 28%;font-size: 15px;">Siguiendo</span>
    <span  id="formeSelected"style="position: relative;
    top: -10px; cursor:pointer; z-index: 10;font-size: 15px;margin-left: 15%;">Para ti</span>
`           
setTimeout(() => {
    document.getElementById("formeSelected").addEventListener("click", (e) => {
        document.getElementById("followingSelected").classList.remove("activeOption")
        document.getElementById("formeSelected").classList.add("activeOption")
        fetchPostsForMe()

    })
    document.getElementById("followingSelected").addEventListener("click", (e) => {
        document.getElementById("formeSelected").classList.remove("activeOption")
        document.getElementById("followingSelected").classList.add("activeOption")
        fetchPostsFollowing()
    })    
}, 400)        

    var data = new FormData()
    data.append("following", localStorage.getItem("followed"))
    fetch("/posts/following", {method: 'POST', body:data}).then(response => response.json()).then((data) =>{
        var firstPosts = ""
        var txt = "Seguir"
        var style = ""
        var postArray = data.posts
        var used = []
        var template
        if(postArray.length == 0){
            const container = document.getElementById("mainContainer")
            container.innerHTML = `<span id="followingSelected" class="activeOption" style="position: relative;z-index: 10;
    top: -10px;cursor:pointer; margin-left: 28%;font-size: 15px;">Siguiendo</span>
    <span  id="formeSelected"style="position: relative;
    top: -10px; cursor:pointer; z-index: 10;font-size: 15px;margin-left: 15%;">Para ti</span>

<img src="/images/social/startnow.png" style="width: 100vw;">`
            return
        }
        while(used.length < postArray.length){
            const random = Math.floor(Math.random() * postArray.length)
            if(!used.includes(random)){
            var post = postArray[random]
            if(used.length == 0){
                var author = post.author
                var authorForId = (author != null ? author.replace(/\s/g, '').toLowerCase(): null)
                id=post.id    
                template= `
                <div class="card card-style" style="margin-top: 3%;">
            <div class="content mb-3">
                <!-- Avatar and Title -->
                <div class="d-flex">
                    <div class="align-self-center">
                        <img src="${post.profile_pic}"onclick="window.location = '${post.url}'"width="35" height="35" class="profileImg  rounded-xl me-2">
                    </div>
                    <div class="align-self-center ps-1">
                        <a href="${post.url}" class="font-600 font-14 line-height-s pe-2 mb-0" style="text-decoration: none; color: #6c6c6c !important;">${post.author}<a href="#"class="ps-2 ${authorForId}" id="${id}" style="color:gray;" onclick="follow('${author}', '${id.toString()}', '${authorForId}')">Siguiendo</a></a>
                        <h6 class="font-400 opacity-50 font-12 mb-0">${post.date}</h6>
                    </div>
                </div>
                <!-- Text and Question -->
                <h4 class="font-17 pt-2">${post.title}</h4>
                <p class="font-14 line-height-m pt-2 mb-3">
                    ${post.body}
                </p>
            </div>
            <img src="${post.img}" class="img-fluid mb-n2 mt-n3">
            <div class="content mb-3">
                <!-- Stats-->
                <!-- Controls-->
                <div class="d-flex pt-1">
                    <!-- Like & Dislike-->
                    <div class="d-flex border-theme rounded-l px-2 py-1">
                        <a href="#" class="theme pe-2">
                            <div class="rating">
                            </div>
                        </a>
                    </div>
                </div>        
            </div>
            </div>
                `
     
            }
            else{
                var author = post.author
                var authorForId = (author != null ? author.replace(/\s/g, '').toLowerCase(): null)
                id=post.id    
                template= `
                <div class="card card-style">
            <div class="content mb-3">
                <!-- Avatar and Title -->
                <div class="d-flex">
                    <div class="align-self-center">
                        <img src="${post.profile_pic}"onclick="window.location = '${post.url}'" width="35" height="35" class="profileImg  rounded-xl me-2">
                    </div>
                    <div class="align-self-center ps-1">
                        <a href="${post.url}" class="font-600 font-14 line-height-s pe-2 mb-0" style="text-decoration: none; color: #6c6c6c !important;">${post.author}<a href="#"class="ps-2 ${authorForId}" id="${id}" style="color:gray;" onclick="follow('${author}', '${id.toString()}', '${authorForId}')">Siguiendo</a></a>
                        <h6 class="font-400 opacity-50 font-12 mb-0">${post.date}</h6>
                    </div>
                </div>
                <!-- Text and Question -->
                <h4 class="font-17 pt-2">${post.title}</h4>
                <p class="font-14 line-height-m pt-2 mb-3">
                    ${post.body}
                </p>
            </div>
            <img src="${post.img}" class="img-fluid mb-n2 mt-n3">
            <div class="content mb-3">
                <!-- Stats-->
                <!-- Controls-->
                <div class="d-flex pt-1">
                    <!-- Like & Dislike-->
                    <div class="d-flex border-theme rounded-l px-2 py-1">
                        <a href="#" class="theme pe-2">
                            <div class="rating">
                            </div>
                        </a>
                    </div>
                </div>        
            </div>
            </div>
                `
    
            }
            used.push(random)
            txt = "Seguir"
            style = ""
            var author = post.author
            var authorForId = (author != null ? author.replace(/\s/g, '').toLowerCase(): null)
            id=post.id
            var followed = JSON.parse(localStorage.getItem("followed"))
            if(followed == null){
                var a = [];
                localStorage.setItem('followed', JSON.stringify(a));            
            }
            followed = JSON.parse(localStorage.getItem("followed"))
            if(followed.includes(author)){
                txt = "Siguiendo"; 
                style = "color: gray;"
            }
            firstPosts = firstPosts + template
        }
        }
        setTimeout(() => {
            document.getElementById("formeSelected").addEventListener("click", (e) => {
                document.getElementById("followingSelected").classList.remove("activeOption")
                document.getElementById("formeSelected").classList.add("activeOption")
                fetchPostsForMe()
        
            })
            document.getElementById("followingSelected").addEventListener("click", (e) => {
                document.getElementById("formeSelected").classList.remove("activeOption")
                document.getElementById("followingSelected").classList.add("activeOption")
                fetchPostsFollowing()
            })    
        }, 400)        
        const container = document.getElementById("mainContainer")
        container.innerHTML = container.innerHTML + firstPosts
    })
}



  