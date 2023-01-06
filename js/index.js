
function setCookie(cname, cvalue) {
    // a function for saving cookies
    const d = new Date();
    const oneDay = 24*60*60*1000;
    d.setTime(d.getTime() + oneDay);
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    document.getElementById("response").innerHTML = "";
}

function getCookie(cname) {
    // a function for getting cookies
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function save_to_local(username, data){
    // save data to local
    localStorage.setItem(username, data);
}

function get_from_local(username){
    // get data from local
    let data = localStorage.getItem(username);
    return data;
}

async function fetch_user(){
    // fetch user data from github api

    let username = document.getElementById("username").value


    if (localStorage.getItem(username) != null) {
        // data is in local
        let s_data = get_from_local(username);
        var data = JSON.parse(s_data);
        document.getElementById("response").innerHTML = "Fetched from Local";
    } else if (getCookie(username) != "") {
        // data is in cookies
        let s_data = getCookie(username);
        var data = JSON.parse(s_data);
        document.getElementById("response").innerHTML = "Fetched from Cookies";
    } else {
        // should get data from api
        let response = await fetch(`https://api.github.com/users/${username}`);

        var data = await response.json();

        let s_data = JSON.stringify(data);
        save_to_local(username, s_data);
        setCookie(username, s_data);
        document.getElementById("response").innerHTML = "Fetched from API";
    }
    // checking the response
    if (data.response) {
        // user not found
        document.getElementById("data-section").style.opacity = 0.35;
        document.getElementById("response").innerHTML = "User Not Found | Try Again";
    } else {
        // user found
        if (document.getElementById("response").innerHTML == "User Not Found | Try Again"){
            document.getElementById("response").innerHTML = "User Found Successfully!";
        }
        document.getElementById("data-section").style.opacity = 1;
        if (data.avatar_url) {document.getElementById("avatar-img").src = data.avatar_url ;}
        if (data.name) {document.getElementById("account-name").innerHTML = data.name} else {document.getElementById("account-name").innerHTML = "unknown"}
        if (data.bio) {document.getElementById("bio").innerHTML = data.bio;} else {document.getElementById("bio").innerHTML = "No Bio"}
        if (data.blog) {document.getElementById("blog").innerHTML = "blog: " + data.blog.replace('https://','www.');} else {document.getElementById("blog").innerHTML = "No Blog"}

        if (data.location) {document.getElementById("loc").innerHTML = data.location} else {document.getElementById("loc").innerHTML = "location not specified"}
        if (data.followers) {document.getElementById("followers").innerHTML = data.followers} else {document.getElementById("followers").innerHTML = "unknown"}
        if (data.following) {document.getElementById("following").innerHTML = data.following} else {document.getElementById("following").innerHTML = "unknown"}
    }

    // if (data.repos_url) {
    //     let langs = [];
    //     const response = fetch(data.repos_url);
    //     response
    //     .then((response) => response.json())
    //     .then((repos) => {
    //         for (let index = 0;  index < repos.length; index++){
    //             let repo = repos[index];
    //             if (repo.language) {
    //                 langs.push(repo.language);
    //             }
    //         }
    //         let count = {};
    //         langs.forEach(function(i) { count[i] = (count[i]||0) + 1;});
    //         let max = 0;
    //         let fav_lang = null;
    //         for (lang in count) {
    //             if (count[lang] > max) {
    //                 max = count[lang];
    //                 fav_lang = lang;
    //             }
    //         }
    //         if (fav_lang) {
    //             document.getElementById("fav_lang").innerHTML = fav_lang;
    //         } else {
    //             document.getElementById("fav_lang").innerHTML = 'Not Specified';
    //         }
    //     });
    // }
}

// search by pressing enter
function key_down(element, e) {
    var charCode;
    if(e && e.which){
        charCode = e.which;
    }else if(window.event){
        e = window.event;
        charCode = e.keyCode;
    }

    if(charCode == 13) {
        fetch_user()
    }
}