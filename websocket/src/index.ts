import { app } from "./utils/app.js";
import {server} from "./utils/hocuspocus.js"
import { io } from "./utils/socket.js";

server.listen();

app.listen(8282, 'localhost', () => {
    console.log('Backend is online')
})

io.listen(8008);