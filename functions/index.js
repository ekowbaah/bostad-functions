const functions = require("firebase-functions");
const getApartments = require("./script");

module.exports.getApartments = functions
    .runWith({memory: "128MB"})
    .pubsub.schedule("*/59 * * * *")
    .timeZone("GMT")
    .onRun(getApartments);
