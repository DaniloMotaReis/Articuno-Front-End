const url = 'http://localhost:8080/';

function userCreate() {
    const email = $("#email-ca").val();
    const senha = $("#senha-ca").val();
    const nick = $("#nick-ca").val();
    const status = $("#status-ca").val();
    const body = `{"email": "${email}", "password": "${senha}", "nickname": "${nick}", "status": "${status}"}`;
    $.ajax({
        type: "POST",
        url: url+'users',
        data: body,
        success: function (data) {
            window.location.href = "index.html";
        },
        contentType: "application/json",
        dataType: "json"
    });
}

function loginUser() {
    const email = $("#email-ca").val();
    const senha = $("#senha-ca").val();
    const body = `{"email": "${email}", "password": "${senha}"}`;
    if(email != "" && senha != "") {
        $.ajax({
            type: "POST",
            url: url+"users/login",
            data: body,
            success: function (data) {
                console.log(data);
                sessionStorage.setItem("email", email);
                window.location.href = "home.html";
            },
            error: (err) => {
                document.getElementById('invalido-span').innerHTML ="E-mail ou senha errados!!";
            },
            contentType: "application/json",
            dataType: "json"
        });
    } else {
        document.getElementById('invalido-span').innerHTML  = "Preencha os campos!!";
    }
}

function postsGetAll() {
    $("#posts-list").empty();
    $.getJSON(url+"/posts", function(data) {
        const ul = $("<ul>");
        data.forEach(e => {
            const li = $("<li>");
            const desc = $(`<label>${e.post}</label>`)
            ul.append(li.append(desc));
        });
        $("#posts-list").append(ul);
    });
}
