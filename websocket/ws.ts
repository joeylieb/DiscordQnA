//TODO: Make a websocket endpoint to show your live UID as signing up
//TODO: Add some heartbeat so AFK users will be kicked until they continue typing on page
import {WebSocketServer} from "ws";
import {EventEmitter} from "node:events";

const wsServer = new WebSocketServer({
    port: 8080
});

interface JWebsocket extends WebSocket, EventEmitter {
    nextTime?: number,
    debug: boolean
}

function heartbeat(websocket: JWebsocket) {
    const expectedTime = Math.round(Math.random() * 2000) + 1000;
    websocket.nextTime = expectedTime + Date.now();
    websocket.send(JSON.stringify({op: 1, d: expectedTime}));
}

wsServer.on("connection", (websocket: JWebsocket) => {
    websocket.debug = false;
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
                if ((websocket.nextTime - Date.now()) > 500 || (websocket.nextTime - Date.now()) < 500){
                    response = {op: 1, d: "Pong"}
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
