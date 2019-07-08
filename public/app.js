$("#scrape-btn").on("click", function (event) { // scrape articles
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        location.reload();
    });
});

$(".toggle-saved").on("click", function (event) { // save/delete articles
    event.preventDefault();
    var id = $(this).data("id");
    var newSaved = $(this).data("newsaved");
    var newSavedState = {
        saved: newSaved
    };

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: newSavedState
    }).then(function (data) {
        location.reload(); // reloads the page to get the updated list
    });
});

$(".view-notes").on("click", function (event) { // opens modal with notes of selected article
    var thisId = $(this).attr("data-id");
    $("#save-note").attr("data-id", thisId); // assigns article id to modal save note button
    $("#article-notes").attr("data-articleId", thisId); // assigns article id to modal notes div
    $("#note-title").text("Notes for article " + $("#save-note").data("id"));
    $.ajax({
        method: "GET",
        url: "/notes/" + thisId
    }).then(function (data) {
        displayNotes(data);
    });
});

$(document).on("click", "#save-note", function () { // saves note
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/notes/" + thisId,
        data: {
            text: $("#notes-form").val()
        }
    }).then(function (data) {
        refreshNotes(data);
    });

    $("#notes-form").val("");
});






function displayNotes(data) {
    $("#article-notes").empty();
    for (var i = 0; i < data.length; i++) {
        var cardBody = $(`<div class="card">
              <div class="card-body">
                  <span class="card-text text-center">${data[i].text}</span><button class="btn-danger delete-note" data-id="${data[i]._id}">x</button>
              </div>
            </div>`);
        $("#article-notes").append(cardBody);
    }
}

function refreshNotes(data) {
    var thisId = data._id;
    $.ajax({
        method: "GET",
        url: "/notes/" + thisId
    }).then(function (data) {
        displayNotes(data);
    });
}

function refreshNotesAfterDelete(data) {
    var thisId = data._id;
    $.ajax({
        method: "GET",
        url: "/notes/" + thisId
    }).then(function (data) {
        displayNotes(data);
    });
}


$("#article-notes").on("click", ".delete-note", function () { // deletes note
    var thisId = $(this).attr("data-id");
    var articleId = $("#article-notes").attr("data-articleId");
    $.ajax({
        method: "DELETE",
        url: "/notes/" + thisId
    }).then(function (data) {
        data._id = articleId;
        refreshNotes(data);
    });
});