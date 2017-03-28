module.exports = function(mongoose) {

    // Mongoose ItemsSchema definition
    var ItemsSchema = new mongoose.Schema({
            id       : String,
            title    : String,
            lat: String,
            lon: String
        }),
        Item = mongoose.model('Item', ItemsSchema),
        PharmacySchema = new mongoose.Schema({
            id: String,
            title: String,
            address: String,
            lat: String,
            lon: String
        }),
        Pharmacy = mongoose.model('Pharmacy', PharmacySchema);

    return {
        Item: Item,
        Pharmacy: Pharmacy
    }
};