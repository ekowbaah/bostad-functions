const rp = require("request-promise");
// var Table = require('cli-table');
// replace the value below with the Telegram token you receive from @BotFather
const token = "1750061258:AAHphqzXsZWjoSZrREN3wCrDxux6bErdC6g";
const chatId = "1723877882";
let message = "";

const getStoredApartments = {
  url: "https://api.jsonbin.io/v3/b/606c74606397691864749a75/1",
  headers: {
    "X-Master-Key": "",
  },
  json: true, // Automatically parses the JSON string in the response
};

let storedApartments = [];

const _ = require("underscore");

let apartments = [];

const options = {
  url: "https://bostad.stockholm.se/Lista/AllaAnnonser",
  json: true,
};

/* var table = new Table ({
 head:['id','address','expirydate','link'],
 colWidths:[10,50,15,60]
 }) */

function getNewApartments() {
  console.log("i run");
  rp(getStoredApartments)
      .then((data) => {
        storedApartments = data.record.apartments;
        rp(options).then((data) => {
          apartments = data;
          filterApartment();

          const newestAparmentList = [];
          const storedApartmentsIds = storedApartments.map(
              (element) => element.AnnonsId);
          const apartmentsIds = apartments.map((element) => element.AnnonsId);

          console.log(storedApartmentsIds, apartmentsIds);

          const newApartmentIds = _.difference(
              apartmentsIds, storedApartmentsIds);

          if (!_.isEmpty(newApartmentIds)) {
            newApartmentIds.forEach((id) => {
              newestAparmentList.push(apartments.filter(
                  (apartment) => apartment.AnnonsId == id)[0]);
            });

            const links = newestAparmentList.map(
                (element) => "https://bostad.stockholm.se" + element.Url);
            message =
                  `Hello Ekow, there are new apartments, ${ links.join(", ") }`;
            const sendMessage = {
              url: `https://api.telegram.org/bot${ token }/sendMessage?chat_id=${ chatId }&text=${ message }`,
            };
            rp(sendMessage);
            const updatedStoredApartments = {
              method: "PUT",
              url: "https://api.jsonbin.io/v3/b/606c74606397691864749a75",
              headers: {
                "X-Master-Key": "$2b$10$iSeXo4/on2EgNGtpDOZfBewRE30J/x4aqzNMhpGMvdM59YLn7tBWG",
                "Content-Type": "application/json",
              },
              body: {
                apartments: newestAparmentList.concat(storedApartments),
              },
              json: true,

            };
            rp(updatedStoredApartments)
                .then(function(parsedBody) {
                  // POST succeeded...
                })
                .catch(function(err) {
                  // POST failed...
                });
          }
        }).catch((err) => {
          console.log(err);
        });
      }
      )
      .catch(function(err) {
        console.log(err, "could not get stored apartments");
      });
}

function filterApartment() {
  apartments.forEach((element, i) => {
    if (element.Senior || element.Student || element.Korttid ||
          element.Ungdom) {
      apartments.splice(i, 1);
    }
  });
  apartments.forEach((element, i) => {
    if (!compareDates(element.AnnonseradTill)) {
      apartments.splice(i, 1);
    }
  });
  //  apartments.forEach((element)=>{
  //    table.push([element.AnnonsId,element.Gatuadress+ ' '+element.Stadsdel
  // + ' '+element.Kommun,element.AnnonseradTill,
  // 'https://bostad.stockholm.se'+element.Url]);

  //  });
  //  apartments.push(tester)

  // console.log(table.toString())
}

function compareDates(expireDate) {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  const todayParsed = Date.parse(today);
  const expireDateParsed = Date.parse(expireDate);

  const notExpired = expireDateParsed > todayParsed;

  return notExpired;
}

module.exports = getNewApartments;
