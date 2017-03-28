module.exports = function(router, Item, Pharmacy) {
    router
        .get('/', function (req, res) {
            res.json(200, 'it\'s alive');
        })
        .get('/items', function (req, res) {
            // http://mongoosejs.com/docs/api.html#query_Query-find
            Item.find( function (err, items ){
                res.json(200, {items: items});
            });
        })
        .post('/items', function (req, res) {
            var item = new Item( req.body );
            console.log(req.body);
            // http://mongoosejs.com/docs/api.html#model_Model-save
            item.save(function (err) {
                res.json(200, {item: item});
            });
        })

        .delete('/items', function (req, res) {
            // http://mongoosejs.com/docs/api.html#query_Query-remove
            Item.remove({ completed: true }, function (err ) {
                res.json(200, {msg: 'OK'});
            });
        })

        .get('/items/:id', function (req, res) {
            // http://mongoosejs.com/docs/api.html#model_Model.findById
            Item.findById( req.params.id, function (err, item ) {
                res.json(200, {item: item});
            });
        })

        .put('/items/:id', function (req, res) {
            // http://mongoosejs.com/docs/api.html#model_Model.findById
            Item.findById( req.params.id, function (err, item ) {
                console.log(req.body);
                item.id = req.body.id;
                item.title = req.body.title;
                item.lat = req.body.lat;
                item.lon = req.body.lon;
                // http://mongoosejs.com/docs/api.html#model_Model-save
                item.save( function ( err, item ){
                    res.json(200, {item: item});
                });
            });
        })

        .delete('/items/:id', function (req, res) {
            // http://mongoosejs.com/docs/api.html#model_Model.findById
            Item.findById( req.params.id, function (err, item ) {
                // http://mongoosejs.com/docs/api.html#model_Model.remove
                item.remove( function ( err, item ){
                    res.json(200, {msg: 'OK'});
                });
            });
        });


    router
        .get('/pharmacies', function (req, res) {
            // http://mongoosejs.com/docs/api.html#query_Query-find
            Pharmacy.find( function (err, pharmacies ){
                res.json(200, {pharmacies: pharmacies});
            });
        })
        .get('/pharmacies/:id', function (req, res) {
            // http://mongoosejs.com/docs/api.html#model_Model.findById
            Pharmacy.findById( req.params.id, function (err, item ) {
                res.json(200, {pharmacy: item});
            });
        });

    return router
};
