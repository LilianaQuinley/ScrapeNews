// Global bootbox 
$(document).ready(function (){
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
        console.log(articles.length);
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
      console.log(article);
    
      var panel = 
        $(["<div class = 'panel panel-default'>",
        "<div class ='panel-heading'>",
        "<h3>",
        "<a href=",
        "https://reuters.com/",
        article.link,
        ">",
        article.title,
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
    
      function handleArticleSave() {
        // this function is triggered when the user wants to save an article
        // when we rendered the article initally, we attatched a javascript object containing the 
        // headline id
        // to the element using the .data method. Here we retrieve that.
        var articleToSave = $(this).parents(".panel").data();
        console.log("ARtile to safve is ");
        console.log(articleToSave);
        articleToSave.saved = true ;
        // using a patch method to be semantic since this is an update to an existing record in our
        //collection
        $.ajax ({
          method: "PATCH",
          url: "/api/article",
          data: articleToSave
        })
        .then(function (data){
          // If successful, mongoose will send back an object containing a key  of "ok" with the value
          //of 1 (wich casts to 'true')
          if (data.ok) {
            // Run the initPage function again. This will reliad the entire list of articles
            initPage();
          }
        });
      }
    
      function handleArticleScrape (){
        //this function jandles the user clicking any "scrape nre article" buttons
        console.log("Fetch new articles.")
        $.get("/api/fetch")
        .then(function (data){
          //if we are able to succesfully scrape the NEWS and compare the article to those
          //already in our collection, re render the articles on the page
          // and let the user know how many unique articles we were able to save
          initPage();
          bootbox.alert("<h3 class ='text-center m-top-80'>" + data.message + "</h3>");
        });
      }
    });