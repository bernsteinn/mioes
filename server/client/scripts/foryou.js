document.addEventListener("DOMContentLoaded", () => {
    fetch("/posts").then(response => response.json()).then((data) =>{
        var firstPosts = ""
        var txt = "Seguir"
        var style = ""
        data.posts.forEach(post => {
            txt = "Seguir"
            style = ""
            var author = post.author
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
            var template= `
            <div class="card card-style">
        <div class="content mb-3">
            <!-- Avatar and Title -->
            <div class="d-flex">
                <div class="align-self-center">
                    <img src="${post.profile_pic}" width="35" class="rounded-xl me-2">
                </div>
                <div class="align-self-center ps-1">
                    <h5 class="font-600 font-14 line-height-s pe-2 mb-0">${post.author}<a href="#" class="ps-2" id="${id}" style="${style}" onclick="follow('${author}', '${id.toString()}')">${txt}</a></h5>
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
                        ${post.stars}
                        <span class="color-theme font-13">${post.rating}</span>
                    </a>
                </div>
            </div>        
        </div>
        </div>
            `
            firstPosts = firstPosts + template
        });
        var container = document.getElementById("mainContainer")
        container.innerHTML = container.innerHTML + firstPosts
    })

})
function follow(user, id){
    document.getElementById(id).style.color = "gray"
    document.getElementById(id).innerText = "Siguiendo"
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


  