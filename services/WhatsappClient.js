const { LocalAuth, Client } = require("whatsapp-web.js");
const qrcoder = require("qrcode-terminal");

const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
});

whatsappClient.on("qr", (qr) => qrcoder.generate(qr, { small: true }));

whatsappClient.on("ready", () => console.log("Client is ready"));
whatsappClient.on("message", async (msg) => {
  try {
    if (msg.from != "status@broadcast") {
      const contact = await msg.getContact();
      // console.log(contact, msg.body);
    }
  } catch (error) {
    console.log("Whatsapp error occured +++++");
    console.log(error);
    console.log("Whatsapp error occured ------");
  }
});
module.exports = whatsappClient;
