const express = require('express');
require('./db/mongoose'); // for connecting to database
const userRouter = require('./routers/user');  // loading the routers from another files
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT   // required when uploading on server side

app.use(express.json());           // allows the expess to parse the json data into js objects
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log("server is running on port " + port);
});








