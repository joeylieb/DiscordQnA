//TODO: Make a websocket endpoint to show your live UID as signing up
//TODO: Add some heartbeat so AFK users will be kicked until they continue typing on page

import {WebSocketServer} from "ws";
import {EventEmitter} from "node:events";
import {createServer} from "http"

const server = createServer();

const wsServer = new WebSocketServer({
    server
});

server.on("error", console.error);

interface JWebsocket extends WebSocket, EventEmitter {
    nextTime?: number,
    debug: boolean,
    active: boolean
}

function heartbeat(websocket: JWebsocket) {
    const expectedTime = Math.round(Math.random() * 2000) + 1000;
    websocket.nextTime = expectedTime + Date.now();
    websocket.send(JSON.stringify({op: 1, d: expectedTime}));
    console.log("You have to respond by " + websocket.nextTime);

    setTimeout(() => {
        if(!websocket.active) websocket.close();
    }, expectedTime + 500)
}

wsServer.on("connection", (websocket: JWebsocket) => {
    websocket.debug = false;
    websocket.active = false;
    websocket.on("error", (err) => console.error(err));

    heartbeat(websocket);
    setInterval(() => heartbeat(websocket), 30 * 1000)

    websocket.on("message", (data) => {
        const parsedData = JSON.parse(data.toString());

        let response: {op: number, d: any} = {
            op: 0,
            d: {}
        }

        switch (parsedData.op) {
            case 1:
                if(!websocket.nextTime) {
                    response = {op: 2, d: "Your websocket has improper data!"};
                    break;
                }
                if (Math.abs(websocket.nextTime - Date.now()) < 500){
                    response = {op: 1, d: "Pong"}
                    websocket.active = true;
                }
                break;
            case 3:
                if(!parsedData.d) {
                    response = {op: 2, d: "You did not specify a debug mode"};
                    break;
                }
                console.log(typeof parsedData.d)
        }
    })

});

server.listen(8080)