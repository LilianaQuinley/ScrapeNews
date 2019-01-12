module.exports = function (router) {
    //this route renders the home page
    router.get('/' ,function(res,req){
        res.render('home');
    } );
    //this toute renders the saved handledbars page
    router.get("/saved" , function (res, resp){
        res.render("saved");
    });

}