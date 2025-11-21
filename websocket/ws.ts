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
    setTimeout(() => {
        if(!websocket.active) websocket.close();
    }, expectedTime + 1000)
}

function debugCallback(websocket: JWebsocket){
    let memberCount = Math.floor(Math.random() * 1000) + 10;
    setInterval(() => {
        if(!websocket.debug) return;
        memberCount++;
        websocket.send(JSON.stringify({op:5, d: memberCount}))
    }, Math.floor(Math.random() * 500) + 2000)
}


wsServer.on("connection", (websocket: JWebsocket) => {
    websocket.debug = false;
    websocket.active = false;
    websocket.on("error", (err) => console.error(err));

    heartbeat(websocket);
    debugCallback(websocket);
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
                if (Math.abs(websocket.nextTime - Date.now()) < 1000){
                    response = {op: 1, d: "Pong"}
                    websocket.active = true;
                } else {
                    websocket.active = false;
                }
                break;
            case 3:
                if(parsedData.d.length === 0) {
                    response = {op: 2, d: "You did not specify a debug mode"};
                    break;
                }
                if(typeof parsedData.d !== "boolean") {
                    response = {op:2, d: "You did not give a valid data type for this operation"}
                    break;
                }
                websocket.debug = parsedData.d;
                websocket.send(JSON.stringify({op: 4, d: 1}));
        }
        if(response.op !== 0) websocket.send(JSON.stringify(response))
    })

});

server.listen(8080)