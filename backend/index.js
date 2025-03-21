import { WebSocketServer } from "ws";
import { GameManager } from "./gameManager.js";

const wss=new WebSocketServer({port:8080});

const gameManager=new GameManager();

wss.on('connection',(ws)=>{

    gameManager.addUser(ws);

    ws.on("disconnect",()=> GameManager.removeUser(ws))

    ws.send('connected');
});