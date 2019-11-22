const app = require('express')()
let PORT = process.env.PORT || 8080

app.get('/', (req,res) => {
    res.json({message:'hello world')}
})

app.listen(PORT, () => console.log('new user connected'))