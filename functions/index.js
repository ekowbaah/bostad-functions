const functions = require("firebase-functions");
const getApartments = require("./script");

module.exports.getApartments = functions
    .region("europe-west2")
    .runWith({memory: "128MB"})
    .pubsub.schedule("*/15 * * * *")
    .timeZone("GMT")
    .onRun(getApartments);
