// Global bootbox 
$(document).ready(function (){

// // Exporting an object containing all of our models
// module.exports = {
//     article: require("./article"),
//     Note: require("./Note")
//   };

// Setting a reference to the article-container div where all the dynamic contect will go
// Adding event listeners to any dynamically generated "save article"
// and "scrape new article" buttons
var articleContainer = $(".article-container");
$(document).on('click', ".btn.save", handleArticleSave);
$(document).on('click', ".scrape-new", handleArticleScrape);

// Once the page is ready, run the initPage function to kick things off
initPage();

function initPage(){
  // Empty the article container, run an AJAX request for any unsaved headlines
  articleContainer.empty();
  $.get("/api/article?saved=false")
  .then(function (data){
    // If we have headlines, render them to the page
    if(data && data.length){
      renderArticles(data);
    }
    else {
      //otherwise render a message explaining we have no articles
      renderEmpty();
    }
  });
}

function renderArticles (articles) {
  //this function handles appending HTML containing our article data to the page
  //we are passed an array of JSON containing all available articles in our database
  var articlePanels = [];
  // we pass each article JSON object to the createPanel function which returns a bootstrap
  //panel with our article data inside
  for (var i = 0; i < articles.length; i++) {
    articlePanels.push (createPanel(articles[i]));
  }
  //once we have all of the html for the articles stored in our articlePanels array,
  //append them to the articlePanels container
  articleContainer.append(articlePanels);
}

function createPanel (article) {
  //this function takes in a single JSON object for an article/headline
  //It constructs a jQuery element containing all the formatted HTML for tje 
  //article panel

  var panel = 
    $(["<div class = 'panel panel-default'>",
    "<div class ='panel-heading'>",
    "<h3>",
    article.healine,
    "<a class = 'btn btn-sucess save'>",
    "Save Article",
    "</a>",
    "</h3>",
    "</div>",
    "<div class ='panel-body'>",
    article.summary,
    "</div>",
    "</div>"
  ].join(""));
  // we attach the articles id to the jQuery element
  // we will use this when trying to figure out which article the user wants tp save
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
    "<h4> UH oh,looks like we don't have any new articles.</h4>",
    "</div>",
    "<div class ='panel-default'>",
    ",div class ='panel-heading text center",
    "<h3> What would you Like to do?</h3>",
    "</div>",
    "</div class = 'panel-body text-center'>",
    "<h4><a class = 'scrape-new'> Try Scrapping New Articles</a></h4>",
    "<h4><a href = '/saved'>Go to Saved Articles</a></h4>",
    "</div>",
    "</div>"
  ].join(""));
  //Appending this data to the page
  articleContainer.append(emptyAlert);
  }
  
})