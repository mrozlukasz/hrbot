module.exports = function(router, Offer) {
    router
        .get('/', function (req, res) {
            res.json(200, 'it\'s alive');
        })
        .get('/offers', function (req, res) {
            // http://mongoosejs.com/docs/api.html#query_Query-find
            Offer.find( function (err, items ){
                res.json(200, {offers: items});
            });
        })
        .post('/offers', function (req, res) {
            var item = new Offer( req.body );
            console.log(req.body);
            // http://mongoosejs.com/docs/api.html#model_Model-save
            item.save(function (err) {
                res.json(200, {offer: item});
            });
        })

        .delete('/offers', function (req, res) {
            // http://mongoosejs.com/docs/api.html#query_Query-remove
            Offer.remove({ completed: true }, function (err ) {
                res.json(200, {msg: 'OK'});
            });
        })

        .get('/offers/:id', function (req, res) {
            // http://mongoosejs.com/docs/api.html#model_Model.findById
            Offer.findById( req.params.id, function (err, item ) {
                res.json(200, {offer: item});
            });
        })

        .put('/offers/:id', function (req, res) {
            // http://mongoosejs.com/docs/api.html#model_Model.findById
            Offer.findById( req.params.id, function (err, item ) {
                console.log(req.body);
                item.id = req.body.id;
                item.title = req.body.title;
                item.lat = req.body.lat;
                item.lon = req.body.lon;
                // http://mongoosejs.com/docs/api.html#model_Model-save
                item.save( function ( err, item ){
                    res.json(200, {offer: item});
                });
            });
        })

        .delete('/offers/:id', function (req, res) {
            // http://mongoosejs.com/docs/api.html#model_Model.findById
            Offer.findById( req.params.id, function (err, item ) {
                // http://mongoosejs.com/docs/api.html#model_Model.remove
                item.remove( function ( err, item ){
                    res.json(200, {msg: 'OK'});
                });
            });
        });


    return router
};
