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
        location.reload(); // reload the page to get the updated list
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
    })
});

// When you click the savenote button
$(document).on("click", "#save-note", function () {
// $("#save-note").on("click", function (event) {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/notes/" + thisId,
        data: {
            text: $("#notes-form").val()
        }
    }).then(function (data) {
        console.log(data);
    });

    $("#notes-form").val("");
});

// delete note
$(document).on("click", ".delete-note", function () {
// $(".delete-note").on("click", function (event) {
    console.log("delete btn clicked")
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/notes/" + thisId
    }).then(function (data) {
        location.reload(); // reload the page to get the updated list
    });
});