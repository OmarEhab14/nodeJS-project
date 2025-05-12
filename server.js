const mongoose = require('mongoose')
const app = require('./app')

require('dotenv').config();

mongoose.connect(process.env.connect_DB).then(() => {
    app.listen(process.env.PORT, () => console.log('Server started...'));
}).catch((err) => {
    console.log(err);
});