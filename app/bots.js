module.exports = function(request, router, Offers, PAGE_ACCESS_TOKEN, VERIFY_TOKEN) {
    if (typeof String.prototype.contains === 'undefined') { String.prototype.contains = function(it) { return this.indexOf(it) !== -1; }; }

    function receivedAuthentication(event) {
        var senderID = event.sender.id;
        // var recipientID = event.recipient.id;
        // var timeOfAuth = event.timestamp;

        // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
        // The developer can set this to an arbitrary value to associate the
        // authentication callback with the 'Send to Messenger' click event. This is
        // a way to do account linking when the user clicks the 'Send to Messenger'
        // plugin.
        // var passThroughParam = event.optin.ref;

        // console.log("Received authentication for user %d and page %d with pass " +
        //     "through param '%s' at %d", senderID, recipientID, passThroughParam,
        //     timeOfAuth);

        // When an authentication is received, we'll send a message back to the sender
        // to let them know it was successful.
        sendTextMessage(senderID, "Authentication successful");
    }


    function filter(items, filterFn) {
        return items
            .filter(filterFn)
            .map(function (offer) {
                return {
                    title: offer.title,
                    subtitle: offer.technologies,
                    item_url: "www.j-labs.pl",
                    image_url: offer.photo,
                    buttons: [{
                        type: "web_url",
                        url: offer.webpage,
                        title: "Szczegóły"
                    },
                    {
                        type: "web_url",
                        url: "https://www.facebook.com/groups/jlabsjobs/",
                        title: "Więcej ofert of J-Labs"
                    }]
                }
            });
    }

    function sendTextMessage(recipientId, messageText) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText
            }
        };

        callSendAPI(messageData);
    }

    function sendButtonMessage(recipientId, text) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text || "W czym Ci mogę pomóć? Wybierz opcję",
                        buttons:[{
                            type: "postback",
                            title: "Szukam projektu",
                            payload: "PROJECTS"
                        }, {
                            type: "postback",
                            title: "Szukam specjalisty",
                            payload: "SPECIALISTS"
                        }]
                    }
                }
            }
        };

        callSendAPI(messageData);
    }

    function sendBackend(recipientId) {
        Offers.find( function (err, items ){
            console.log(items);
            var elements = filter(items, function (offer) {
                return offer.title.contains('Java') || offer.title.contains('Backend');
            }) || [];

            var messageData = {
                recipient: {
                    id: recipientId
                },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "generic",
                            elements: elements
                        }
                    }
                }
            };
            callSendAPI(messageData);
        });
    }

    function sendFrontend(recipientId) {
        Offers.find( function (err, items ){
            console.log(items);
            var elements = filter(items, function (offer) {
                return offer.title.contains('Frontend');
            }) || [];
            var messageData = {
                recipient: {
                    id: recipientId
                },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "generic",
                            elements: elements
                        }
                    }
                }
            };
            callSendAPI(messageData);
        });
    }

    function callSendAPI(messageData) {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: messageData

        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                console.log("Successfully sent generic message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.error("Unable to send message.");
                // console.error(response);
                // console.error(error);
            }
        });
    }

    function receivedDeliveryConfirmation(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var delivery = event.delivery;
        var messageIDs = delivery.mids;
        var watermark = delivery.watermark;
        var sequenceNumber = delivery.seq;

        if (messageIDs) {
            messageIDs.forEach(function(messageID) {
                console.log("Received delivery confirmation for message ID: %s",
                    messageID);
            });
        }

        console.log("All message before %d were delivered.", watermark);
    }

    function receivedMessage(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;

        console.log("Received message for user %d and page %d at %d with message:",
            senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        var messageId = message.mid;

        // You may get a text or attachment but not both
        var messageText = message.text;
        var messageAttachments = message.attachments;

        if (messageText) {

            // If we receive a text message, check to see if it matches any special
            // keywords and send back the corresponding example. Otherwise, just echo
            // the text we received.
            switch (messageText) {
                case 'image':
                    // sendImageMessage(senderID);
                    break;

                case 'button':
                    sendButtonMessage(senderID);
                    break;

                case 'generic':
                    sendButtonMessage(senderID, "Witaj! W czym Ci mogę pomóć? Wybierz opcję");
                    break;

                default:
                    if (messageText !== null) {
                        var s = messageText.toLocaleLowerCase();
                        if (s.contains('Szukam projektu')) {
                            sendTextMessage(senderID, "Jakich projektów szukasz?");
                        } else if (s.contains('Szukam specialisty')) {
                            sendTextMessage(senderID, "Podaj nam swój adres e-mail, podeślemy Ci naszą ofertę.");
                        } else if (s.contains('API')
                            || s.contains('dynamiczny')
                            || s.contains('narkoty')
                            || s.contains('api')
                            || s.contains('uana')
                            || s.contains('koka')
                            || s.contains('her')
                            || s.contains('kok')
                            || s.contains('lsd')) {
                            sendTextMessage(senderID, 'Baśka potrafi robić API https://www.youtube.com/watch?v=USaxePzTmTs');
                        } else if (s.contains('@')) {
                            sendTextMessage(senderID, 'Dziękujemy. Oferta zostanie przygotowana dla Ciebie w przeciągu 24 godzin. Miłego dnia!');
                        } else {
                            if (s.contains('hej')
                                || s.contains('cześć')
                                || s.contains('witam') ) {
                                sendButtonMessage(senderID, "Witaj! W czym Ci mogę pomóć? Wybierz opcję");
                            } else if (s.contains('java') || s.contains('backend')) {
                                sendBackend(senderID);
                            } else if (s.contains('frontend') || s.contains('angular')) {
                                sendFrontend(senderID);
                            } else {
                                sendButtonMessage(senderID, "Nie rozumiem, spróbuj innych opcji.");
                            }
                        }
                    } else {
                        sendTextMessage(senderID, "Nie rozumiem, spróbuj jeszcze raz.");
                    }
            }
        } else if (messageAttachments) {
            sendTextMessage(senderID, "Message with attachment received");
        }
    }

    function receivedPostback(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfPostback = event.timestamp;

        // The 'payload' param is a developer-defined field which is set in a postback
        // button for Structured Messages.
        var payload = event.postback.payload;

        console.log("Received postback for user %d and page %d with payload '%s' " +
            "at %d", senderID, recipientID, payload, timeOfPostback);

        if (payload) {
            console.log(payload);
            if (payload == 'PROJECTS') {
                sendTextMessage(senderID, "Jakich projektów szukasz?");
            } else if (payload == 'SPECIALISTS') {
                sendTextMessage(senderID, "Podaj nam swój adres e-mail, podeślemy Ci naszą ofertę.");
            } else if (payload == 'HELP') {
                sendButtonMessage(senderID);
            }

        } else {
            // When a postback is called, we'll send a message back to the sender to
            // let them know it was successful
            sendTextMessage(senderID, "Przepraszam, ale nie rozumiem. Możesz wyjaśnić jeszcze raz?");
        }

    }

// for Facebook verification
    router
        .get('/', function(req, res) {
            if (req.query['hub.mode'] === 'subscribe' &&
                req.query['hub.verify_token'] === VERIFY_TOKEN) {
                // console.log("Validating webhook");
                res.status(200).send(req.query['hub.challenge']);
            } else {
                // console.error("Failed validation. Make sure the validation tokens match.");
                res.sendStatus(403);
            }
        })
// for sending messages
        .post('/', function (req, res) {
            var data = req.body;

            // Make sure this is a page subscription
            if (data.object === 'page') {
                // Iterate over each entry
                // There may be multiple if batched
                data.entry.forEach(function(pageEntry) {
                    var pageID = pageEntry.id;
                    var timeOfEvent = pageEntry.time;

                    // Iterate over each messaging event
                    pageEntry.messaging.forEach(function(messagingEvent) {
                        if (messagingEvent.optin) {
                            receivedAuthentication(messagingEvent);
                        } else if (messagingEvent.message) {
                            receivedMessage(messagingEvent);
                        } else if (messagingEvent.delivery) {
                            receivedDeliveryConfirmation(messagingEvent);
                        } else if (messagingEvent.postback) {
                            receivedPostback(messagingEvent);
                        } else {
                            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                        }
                    });
                });

                // Assume all went well.
                //
                // You must send back a 200, within 20 seconds, to let us know you've
                // successfully received the callback. Otherwise, the request will time out.
                res.sendStatus(200);
            }
        });
    return router;
};