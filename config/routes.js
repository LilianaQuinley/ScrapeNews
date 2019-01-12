module.exports = function (router) {
    //this route renders the home page
    router.get('/' ,function(req, res){
        res.render('home');
    } );
    //this toute renders the saved handledbars page
    router.get("/saved" , function (req, res){
        res.render("saved");
    });

}