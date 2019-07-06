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







// When you click the savenote button
// $(document).on("click", "#save-note", function () {
$("#save-note").on("click", function (event) {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/note/" + thisId,
        data: {
            // Value taken from title input
            // title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#notes-form").val()
        }
    }).then(function (data) {
        console.log(data);
        $("#notes-form").empty();
    });

    // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    // $("#notes-form").val("");
});

// delete note