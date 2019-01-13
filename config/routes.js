// Bring in the scrape function from out scripts directory
var scrape = require ("../scripts/scrape");

// Bring headlines and notes frin the controller
var headlinesController = require ("../controllers/headlines");
var notesController = require ("../controllers/notes");

module.exports = function (router) {
    //this route renders the home page
    router.get('/' ,function(req, res){
        res.render('home');
    } );
    //this toute renders the saved handledbars page
    router.get("/saved" , function (req, res){
        res.render("saved");
    });
    //scrape working
    router.get("/scrape", function (req, res){
      
        console.log("I got scrape")
        scrape(res, function(results) {
            console.log(results)
            res.send( JSON.stringify(results) )
        });
    });

    router.get("/api/fetch", function (req, res){
        headlinesController.fetch(function (err, docs){
            if(!docs || docs.insertedCount === 0){
                res.json({
                    message: "No new articles today. Check back tomorrow"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });

    router.get("/api/article", function (req, res){
        var query = {};
        if (req.query.saved){
            query = req.query;
        }
        headlinesController.get(query, function (data){
            res.json(data);
        });
    });

    router.delete("/api/article/:id", function (req, res){
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function(err, data){
            res.json(data)
        });
    });

    router.patch ("/api/article", function (req, res){
        headlinesController.update(req.body, function (err, data){
            res.json(data);
        });
    });
    
    router.get ("/api/notes/:article_id?", function (req, res){
        var query = {};
        if (req.params.article_id){
            query._id = req.params.article_id;
        }
        notesController.get(query, function (err, data){
            res.json(data);
        });
    });
    router.delete("/api/notes/:id", function (req, res) {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function (err, data){
            res.json (data);
        });
    });
    router.post("/api/notes" , function (req, res){
        notesController.save(req.body, function (data){
            res.json(data);
        });
    });
}