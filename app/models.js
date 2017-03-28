module.exports = function(mongoose) {

    // Mongoose ItemsSchema definition
    var OffersSchema = new mongoose.Schema({
            id              : String,
            title           : String,
            city            : String,
            country         : String,
            photo           : String,
            salary          : String,
            technologies    : String,
            webpage         : String
        }),
        Offer = mongoose.model('Offer', OffersSchema);

    return {
        Offer: Offer
    }
};