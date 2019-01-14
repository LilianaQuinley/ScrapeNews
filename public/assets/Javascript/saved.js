//global bootbox
$(document).ready(function () {
//getting a reference to the article container div we will be rendering all articles inside of 
var articleContainer = $('.article-container');
// adding event listeners for dynamuically generated buttons for deleting articles,
// pulling up articles notes, saving article notes, and deleting article notes
$(document).on("click", ".btn.delete", handleArticleDelete);
$(document).on("click", ".btn.notes", handleArticleNotes);
$(document).on("click", ".btn.save", handleNoteSave);
$(document).on("click", ".btn.note-delete", handleNoteDelete);

//initPage kicks everything off when the page is loaded
initPage();

function initPage(){
    $.get("/api/article?saved=true").then(function(data){
        // If we have headlines, render them to the page
        console.log("data retrieved with length " + data.length)
        if (data && data.length) {
            renderArticles(data);
        }else {
            //otherwise render a message explaining we have no articles
            renderEmpty();
        }
    });
}

function renderArticles(articles){
    console.log("Rendering articles with " + articles.length)
    //This function handles appending HTML contianing our article data to the page 
    //we are passed an array of JSON containing all the available articles in our database
    var articlePanels = [];
    //we pass each article JSON object to the createPanel function which returns a bootstrap
    //panel with our article data inside
    for (var i=0; i < articles.length; i++){
        console.log("Now in my loop for ")
        console.log(articles[i])
        articlePanels.push(createPanel(articles[i]));
    }
    //once we have all the html for the article stored in our articePanels array 
    //append them to the articlePanels container
    articleContainer.append(articlePanels);
}

function createPanel (article) {
    //this function takes in a single JSON object for an article/headline
    //It constructs a jQuery element containing all the formatted HTML for tje 
    //article panel
    console.log("Creating panel for  ");
    console.log(article)
  
    var panel = 
      $(["<div class = 'panel panel-default'>",
      "<div class ='panel-heading'>",
      "<h3>",
      "<a href=",
      "https://reuters.com/",
      article.link,
      ">",
      article.title,
      "<a class = 'btn btn-danger delete'>",
      "Delete From Saved",
      "</a>",
      "<a class ='btn btn-info notes'>Article Notes</a>",
      "</h3>",
      "</div>",
      "<div class ='panel-body'>",
      "</div>",
      "</div>"
    ].join(""));
    // we attach the articles id to the jQuery element
    // we will use this when trying to figure out which article the user wants to remove or open
    //notes for
    panel.data("_id", article._id);
    //we return the constructed panel jQuery element
    return panel;
}
    
function renderEmpty (){
    // this function renders some HTML to the page explaining we don't have any article to view
    //using a joined array of HTML string data becausre it is easier to read/change than a 
    //concatenated string
    var emptyAlert =
    $(["<div class = 'alert alert-warning text-center'>",
    "<h4> Uhh oh,looks like we don't have any new articles.</h4>",
    "</div>",
    "<div class ='panel-default'>",
    "<div class ='panel-heading text center",
    "<h3> Would you like to Browse Available Articles?</h3>",
    "</div>",
    "</div class = 'panel-body text-center'>",
    "<h4><a href = '/'>Browse Articles</a></h4>",
    "</div>",
    "</div>"
  ].join(""));
  //Appending this data to the page
  articleContainer.append(emptyAlert);
  }

  function renderNotesList(data){
      //this function handles rendering note list items to our notes modal
      // setting up an array of notes to render after finished
      // also setting up a currentNote variable to temporarily store each note
    var notesToRender = [];
    var currentNote;
    if(!data.notes.lenght){
        // If we have no notes, jiust display a message explainig this
        currentNote = [
            "<li class = 'list-group-item'>",
            "No notes for this article yet.",
            "</li>"
        ].join("");
        notesToRender.push(currentNote);
    }
    else {
        // if we do have notes, go through each one
        for (var i = 0; i <data.notes.lenght; i++){
            // Constructs an li element contain our noteText and a delete button
            currentNote = $([
                "<li class = 'list-group-item note'>",
                data.notes[i].noteText,
                "<button class='btn btn-danger note-delete'>x</button>",
                "</li>"
            ].join(""));
            //store the note id on the delete button for easy access when trying to delete 
            currentNote.children("button").data("_id", data.notes[i]._id);
            //adding our currentNote to the notesToRender array
            notesToRender.push(currentNote);
        }
    }
    // now append the notesToRender to the note-container inside the note modal
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete(){
      // This function handles deleting article / healines 
      // we grab the id for the article to delete from the panel element the delete button sits inside
      $.ajax({
          method:"DELETE",
          url: "/api/article/" + articleToDelete._id
      }).then(function (data){
          // If this works out, run initPage again which will rerender our list of saved articles
          if (data.ok){
              initPage();
          }
      });
  }

  function handleArticleNotes(){
      //This function handles opening the notes modal and displaying our notes 
      //we grab the id of the article to het notes for from the panel element the delete
      //button sits inside
      var currentArticle = $(this).parents(".panel").data();
      // Grab any notes with this healine/article id
      $.get("/api/notes/" + currentArticle._id).then(function (data){
          //Constructing our initial HTML to add to the notes modal
          var modalText = [
            "<div class ='container-fluid text-center'>",
            "<h4> Notes For Article: ",
            currentArticle._id,
            "</h4>",
            "<hr />",
            "<ul class = 'list-group note-container'>",
            "</ul>",
            "<textarea placeholder = 'New Note' rows='4' cols='60'></textarea>",
            "<button class='btn btn-success save'>Save Note</button>",
            "</div>"
          ].join("");
          //Adding the formatted HTML to the note modal
          bootbox.dialog({
              message: modalText,
              closeButton: true
          });
          var noteData = {
              _id: currentArticle._id,
              notes: data || []
          };
          //adding some information about the article and article notes to the save button
          //for easy access
          // when trying to add a new note
          $(".btn.save").data("article", noteData);
          //renderNotesList will populate the actual note HTML inside of the modal we just 
          //created/opened 
          renderNotesList(noteData);
      });
  }

  function handleNoteSave() {
      // This function handles what happens when a user tries to save a new note for an article
      // Setting a variable to hold some formatted data about our note,
      // grabbing the note typed into the input box
      var noteData;
      var newNote = $(".bootbox-body textarea").val().trim();
      //If we actually have data typed into the note input field, format it
      // and post it to the "/api/notes" route and send the formatted as well
      if (newNote) {
          noteData = {
              _id: $(this).data("article")._id,
              noteText: newNote
          };
          $.post("/api/notes", noteData).then(function (){
              // when complete, close the modal
              bootbox.hideAll();
          });
      }
  }

  function handleNoteDelete(){
      //This function handles the deletion of notes
      //First we grab the id of the note we want to delete
      // We stored this data on the delete button when we create it
      var noteToDelete = $(this).data("_id");
      // perform a DELETE request to "/api/notes/" with the id of the note we're deleting as a 
      //parameter
      $.ajax({
          url:"api/notes/" + noteToDelete,
          method: "DELETE"
      }).then (function (){
          //when done, hide the modal
          bootbox.hideAll();
      });
  }

});