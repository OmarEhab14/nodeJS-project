const mongoose = require('mongoose')
const app = require('./app')

require('dotenv').config();

mongoose.connect(process.env.connect_DB).then(() => {
    app.listen(4000, () => console.log('Server started on port 4000'));
}).catch((err) => {
    console.log(err);
});