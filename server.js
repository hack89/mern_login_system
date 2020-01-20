const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const db = require('./config/keys').mongoURI
const port = process.env.PORT || 5000
const passport = require('passport')
const users = require('./routes/api/users')
const path = require('path')


const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connected!'))
    .catch(err => console.log(err))



app.use(passport.initialize())
require('./config/passport')(passport);

app.use('/api/users', users)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
    })
}

app.listen(port, () => console.log(`server run on port ${port}`))