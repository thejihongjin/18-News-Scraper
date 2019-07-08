// $(document).on("click", "#scrape-btn", function () {
$("#scrape-btn").on("click", function (event) { // scrape articles
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        //console.log(data);
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


////////// still needs finishing
// view notes button should also trigger get to get all notes
$(".view-notes").on("click", function (event) {
    var thisId = $(this).attr("data-id");
    $("#save-note").attr("data-id", thisId); // assigns article id to modal save note button
    $("#note-title").text("Notes for article " + $("#save-note").data("id"));
    $.ajax({
        method: "GET",
        // url: "/notes/" + thisId
        url: `/notes/${thisId}`
    }).then(function (data) {
        // console.log("displaynote " + JSON.stringify(data));
        displayNotes(data);
        // addNote(data);
    });
});

// When you click the savenote button
$(document).on("click", "#save-note", function () {
    // $("#save-note").on("click", function (event) {
    console.log("hi");
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/notes/" + thisId,
        data: {
            text: $("#notes-form").val()
        }
    }).then(function (data) {
        // console.log("addnote " + JSON.stringify(data));
        refreshNotes(data);
    });

    $("#notes-form").val("");
});






// function addNote(noteData) {
function displayNotes(data) {
    $("#article-notes").empty();
    for (var i = 0; i < data.length; i++) {
        var cardBody = $(`<div class="card">
              <div class="card-body">
                  <p class="card-text">${data[i].text}</p>
                  <button class="btn-danger delete-note" data-id="${
            data[i]._id
            }">x</button>
              </div>
            </div>`);
        $("#article-notes").append(cardBody);
    }
}

function refreshNotes(data) {
    var thisId = data._id;
    $.ajax({
        method: "GET",
        // url: "/notes/" + thisId
        url: `/notes/${thisId}`
    }).then(function (data) {
        //   console.log("displaynotes: ");
        //   console.log(data);
        displayNotes(data);
    });
}

// delete note
$("#article-notes").on("click", ".delete-note", function () {
    // $(".delete-note").on("click", function (event) {
    console.log("delete btn clicked")
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/notes/" + thisId
    }).then(function (data) {
        // location.reload(); // reload the page to get the updated list
        // refreshNotes(data);
        displayNotes(data);
        console.log("deleted?");
    });
});