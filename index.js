require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const mongo = require("./mongo.js")
const path = require("path")
const bodyParser = require("body-parser")

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.resolve(__dirname, 'client', 'build')));
app.get("/*", function (_, res) {
  res.sendFile(
    path.resolve(__dirname, 'client', 'build')
  );
});

const reminderSchema = new mongoose.Schema({
	reminderMsg: String,
	remindAt: String,
	isReminded: Boolean
}, {collection: "reminder-data"})

const Reminder = new mongoose.model("reminder", reminderSchema)


setInterval( async () => {
    Reminder.find({})
    .then((reminderList) => {
    	if(reminderList){
            reminderList.forEach(async (reminder) => {
                if(!reminder.isReminded){
                    const now = new Date()
                    if((new Date(reminder.remindAt) - now) < 0) {
                        const done = await Reminder.findByIdAndUpdate(reminder._id, {isReminded: true}); 
                            const accountSid = process.env.ACCOUNT_SID;
							const authToken = process.env.AUTH_TOKEN;
							const client = require('twilio')(accountSid, authToken);

							client.messages
    						.create({
    						    body: reminder.reminderMsg,
                                from: 'whatsapp:+14155238886',
                                to: 'whatsapp:+918839559738'
    						})
                    }
                }
            })
        }
    })
},1000);



app.get("/getAllReminder", async (req, res) => {
	await Reminder.find({}).then((rem) => {
		res.send(rem);
	}).catch((e) => {
		console.log(e);
	})

	// const ans = Reminder.find({});
	// ans.save();
	// res.send(ans);
})
app.post("/addReminder", async (req, res) => {
	const {reminderMsg, remindAt} = req.body
	const reminder = new Reminder({
		reminderMsg, remindAt, isReminded: false
	})
	await reminder.save();
	await Reminder.find({}).then((rem) => {
		res.send(rem);
	}).catch((e) => {
		console.log(e);
	})
})

app.post("/deleteReminder", async (req, res) => {
	await Reminder.deleteOne({_id: req.body.id})
	await Reminder.find({}).then((rem) => {
			res.send(rem);
		}).catch((e) => {
			console.log(e);
		})
})

app.listen(8080, () => {
	console.log("Chaliye Shuru Karte Hai...");
})

mongo();