import Chessboard from "../components/chessboard"
import Button from "../components/button"
import { useSocket } from "../utils/useSocket"
import { useEffect, useState } from "react";
import { Chess } from 'chess.js'

export const INIT_GAME="init_game";
export const MOVE="move";
export const GAME_OVER="game_over";

export default function Game(){

    const socket=useSocket();

    let [chess,setChess]=useState(new Chess());
    let [board,setBoard]=useState(chess.board());

    // if(!socket) return( <div>connecting...</div> )

    useEffect(()=>{
        if(!socket){
            return;
        }
        socket.onmessage=(event)=>{
            let message=JSON.parse(event.data);
            console.log(message);

            switch(message.type){
                case INIT_GAME:
                    setBoard(chess.board());
                    break;
                case MOVE:
                    console.log(message);
                    let move=message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    break;
                case GAME_OVER:
                    console.log("Game Over");
                    break;    
            }
        }
    },[socket]);

    return(
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="h-4/6 w-5/12 border-2 border-black flex items-center justify-center">
                <div className="h-full w-full flex justify-around items-center">
                    <div className="">
                        <Chessboard setBoard={setBoard} chess={chess} socket={socket} board={board}/>
                    </div>
                    <div className="h-16 w-20 bg-green-700 flex justify-center border-2 border-black rounded-lg text-white text-lg">
                        <Button onClick={()=>{
                            socket.send(JSON.stringify({
                                type:INIT_GAME,
                            }));
                        }} text={"Play"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}