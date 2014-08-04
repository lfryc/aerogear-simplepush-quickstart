(function() {
    var mailEndpoint, mailRequest, SPClient,
        useNative = !!navigator.push;

    // onConnect callback function:
    function spConnect() {
        $("#connect").hide();
        getTextAreaElement().value = "Connection established!";

        // use 'PushManager' to request a new PushServer URL endpoint for 'mail' notifications:
        mailRequest = navigator.push.register();

        // the DOMRequest returns 'successfully':
        mailRequest.onsuccess = function( event ) {
            // extract the endpoint object from the event:
            mailEndpoint = event.target.result;

            // let's print the pushEndpoint URL.
            appendTextArea("Mail pushEndpoint URL: \n" + mailEndpoint);
        };

        // set the notification handler:
        navigator.mozSetMessageHandler( "push", function( message ) {
            // we got message for our 'mail' endpoint ?
            if ( message.pushEndpoint === mailEndpoint ) {
                // let's react on that mail....
                appendTextArea("Mail Notification - " + message.version);
            }
        });
    }

    function appendTextArea(newData) {
        var el = getTextAreaElement();
        el.value = el.value + '\n' + newData;
        console.log(newData);
    }

    function getTextAreaElement() {
        return document.getElementById('responseText');
    }

    // custom.....
    $("#reconnect").on("click", function(event) {
        // AeroGear add-on to allow a reconnect, if the WebSocket/SockJS connection is lost
            navigator.push.reconnect();
        });

    // onClose callback function:
    function spClose() {
        $("#reconnect").show();
        appendTextArea("\nConnection Lost!\n");
    }

    $("#connect").on("click", function(event) {
        SPClient = AeroGear.SimplePushClient({
            simplePushServerURL: "http://localhost:7777/simplepush",
            onConnect: spConnect,
            onClose: spClose,
            useNative: useNative
        });
    });
})();
