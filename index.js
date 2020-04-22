const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const Joi = require('joi');

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(cors({origin:true}));
app.use(express.json());

TICKETS_COLLECTION = 'tickets'

// GET
// get all tickets from given event
app.get('/api/tickets', async (req, res) => {
    try {
        const userQuerySnapshot = await db.collection(TICKETS_COLLECTION).get();
        const tickets = [];
        userQuerySnapshot.forEach(
            (doc)=>{
                tickets.push({
                    id: doc.id,
                    data: doc.data()
            });
            }
        );
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).send(error);
    }
});

// get ticket with given id
app.get('/api/tickets/:ticketId', (req, res) => {
    const ticketId = req.params.ticketId;
    db.collection(TICKETS_COLLECTION).doc(ticketId).get()
    .then(ticket => {
        if (!ticket.exists) return res.status(401).send('ticket not found!');
        return res.status(200).json({id:ticket.id, data:ticket.data()})})
    .catch(error => res.status(500).send(error));

});

//POST
// Create new ticket
// app.post('/api/tickets', async (req, res) => {
//     try {
//         const ticket = {
//             eventId: req.body['event_id'],
//             firstName: req.body['firstName'],
//             lastName: req.body['lastName'],
//             email: req.body['email'],
//         };

//         const current_size = getSize();
//         const newDoc = await db.collection(TICKETS_COLLECTION).doc(current_size).set(ticket);
//         res.status(201).send(`Created a new ticket: ${newDoc.id}`);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// Delete a ticket
// app.delete('api/users/:ticketId', (req, res) => {
//     db.collection(TICKETS_COLLECTION).doc(req.params.ticketId).delete()
//     .then(()=>res.status(204).send("Document successfully deleted!"))
//     .catch(error => {
//             res.status(500).send(error);
//     });
// })
// function validateInput(course){
//     const schema = {
//         name: Joi.string().min(3).required()
//     };

//     return Joi.validate(course, schema);
// }


//export cloud function
exports.testFunc = functions.https.onRequest(app);
