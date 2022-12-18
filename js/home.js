const url = 'http://localhost:8080/';
const email = sessionStorage.getItem("email");

document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        if(email.valueOf){
            postsGetAll();
        }
    }
}

function postCreate() {
    const post = $("#pos-ca").val();
    const body = `{"post": "${post}", "email": "${email}"}`;
    if(post != "") {
        $.ajax({
            type: "POST",
            url: url+"posts",
            data: body,
            success: (res) => {
                postsGetAll();
            },
            contentType: "application/json",
            dataType: "json"
        });
    }
}

function answerCreate(postId) {
    const answer = $("#res-ca"+postId).val();
    const body = `{"answer" : "${answer}", "email" : "${email}", "idPost" : "${postId}"}`
    if(answer != "") {
        $.ajax({
            type: "POST",
            url: url+"answer",
            data: body,
            success: (res) => {
                postsGetAll();
            },
            contentType: "application/json",
            dataType: "json"
        });
    }
}

function answerGetPost() {
    $.getJSON(url+"posts", function(data) {
        data.forEach(e => {
            $.getJSON(url+"answer/"+e.idPost,  function(res) {
                const divAnswer = $(`<div class="text-answer">`);
                res.forEach(r => {
                    const imgRes = `
                    <img class="img-post" src="${r.user.picture}" height="35" width="35">`;
                    const h3res = `
                    <h3>${r.user.nickname}</h3>`;
                    const pRes =`
                    <p>${r.answer}</p>`;
                    const dataRes = `<p><small>${r.dtAnswer}</small></p>`
                    divAnswer.append(imgRes, h3res, pRes, dataRes);
                });
                $(`#posts${e.idPost}`).append(divAnswer);
            });
        });
    });
}

function checkBoxL(checkId) {
    const body = `{"email": "${(email)}", "tpReaction": "TRUE"}`;
    $.ajax({
        type: "PUT",
        url: `${url}reactions/${checkId}`,
        data : body,
        success : function(data){instReactions(checkId)},
        contentType: "application/json",
        dataType: "json"
    });
};

function checkBoxD(checkId) {
    const body = `{"email": "${(email)}", "tpReaction": "FALSE"}`;
    $.ajax({
        type: "PUT",
        url: `${url}reactions/${checkId}`,
        data : body,
        success : function(data){instReactions(checkId)},
        contentType: "application/json",
        dataType: "json"
    });
};

function instReactions(checkId){
    const labelD = $(`#D${checkId}`);
    const labelL = $(`#L${checkId}`);
    var tes;
    $.ajax({
        type: "GET",
        url: `${url}reactions/${checkId}`,
        async: false,
        success: function(data) {
            labelL.html(data.like);
            labelD.html(data.deslike);
        },
        contentType: "application/json",
        dataType: "json"
    });
    return tes;
}

function statusReactions(id) {
    var tes;
    $.ajax({
        type: "PUT",
        url: `${url}reactions/status/${id}`,
        data : `{"email": "${email}"}`,
        async: false,
        success: function(data) {
           if(data != null){
            tes = data;
           } else {
            tes = '';
           }
        },
        contentType: "application/json",
        dataType: "json"
    });
    return tes;
}

function contReactions(checkId, n){
    var tes;
    $.ajax({
        type: "GET",
        url: `${url}reactions/${checkId}`,
        async: false,
        success: function(data) {
            if(n == 0) {
                tes = data.like;
            } else {
                tes = data.deslike;
            }
        },
        contentType: "application/json",
        dataType: "json"
    });
    return tes;
}

function postsGetAll() {
    $("#posts-list").empty();
    $.getJSON(url+"posts", function(data) {
        var id;
        const divFedd = $(`<div class="feed">`)
        data.forEach(e => {
            id = e.idPost;
            const divs = $(
            `<div class="posts" id="posts${e.idPost}">
                <div class="info">
                    <img class="img-post" src="${e.user.picture}" height="100" width="100">
                    <h2>${e.user.nickname}</h2>
                    <p><small>${e.dtPost}</small></p>
                </div>
                <div class="post">
                    <p><big>${e.post}</big></p>
                </div>
                <div class="btn-group" role="group" aria-label="Basic radio toggle button group">    
                    <input type="radio" class="btn-check" name="btnradio${e.idPost}" ${(statusReactions(e.idPost) == true) ? 'checked' : ''} id="btncheckL${e.idPost}" onclick="checkBoxL(${e.idPost})" autocomplete="off" >
                    <label class="btn btn-outline-primary" for="btncheckL${e.idPost}" ><i class="bi bi-emoji-smile" id="L${e.idPost}">${contReactions(e.idPost, 0)}</i></label>
                    <input type="radio" class="btn-check" name="btnradio${e.idPost}" ${(statusReactions(e.idPost) == false) ? 'checked' : ''} id="btncheckD${e.idPost}" onclick="checkBoxD(${e.idPost})" autocomplete="off">
                    <label class="btn btn-outline-primary" for="btncheckD${e.idPost}" ><i class="bi bi-emoji-angry" id="D${e.idPost}">${contReactions(e.idPost, 1)}</i></label>
                </div>
                <div class="answer">
                    <input type="text" class="res-ca" id="res-ca${e.idPost}" placeholder="Responda a postagem"><button class="res-btn" id="res-btn${e.idPost}" onclick="answerCreate(${e.idPost})">Responder</button><br>
                </div>
            </div>`)
            divFedd.append(divs);
        });
        $("#posts-list").append(divFedd);
    });
    answerGetPost();
}