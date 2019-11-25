let PORT = process.env.PORT || 8080
let DB = process.env.MONGO_URI || 'mongodb+srv://nova:st18chenh@cluster0-ztrfz.azure.mongodb.net/ngpdb?retryWrites=true&w=majority'

const app = require('express')()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const shortid = require('shortid')
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(morgan('dev'))

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
    const cors = require('cors')
    app.use(cors())
}

let symptomSchema = new mongoose.Schema({
    symptom: {type: String, required: true},
    timestamp: { type: Date, default: new Date(), required: true},
    notes: String,
    location: String,
    count: {type:Number, default:0, required:true},
    severity: Number,
    recording_id: String,
    shortid: String
})

let recordingSchema = new mongoose.Schema({
    shortid: String,
    timestamp: { type: Date, default: new Date(), required: true},
    notes: [String]
})

let overallSchema = new mongoose.Schema({
    overall: Number,
    abdPain: Number, 
    bloating: Number,
    wind: Number,
    notes: String,
    recording_id: String
})

let Overall = new mongoose.model('Overall', overallSchema)
let Recording = new mongoose.model('Recording', recordingSchema)
let Symptom = new mongoose.model('Symptom', symptomSchema)
let connection = mongoose.connect(DB, {useNewUrlParser:true, useUnifiedTopology:true})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.route('/overall')
    .post( async(req,res) => {
        console.log(req.body.recording_id)
        const exists = await Overall.findOne({recording_id:req.body.recording_id})
        if (exists) {
            let updatedOverall = await exists.set({...req.body})
            res.json(updatedOverall)
        } else {
            let newOverall = await new Overall({...req.body}).save()
            res.json(newOverall)
        }
    })
    .get( async(req,res) => {
        const docs = await Overall.find()
        res.json(docs)
    })

app.route('/overall/:id')
    .delete(async(req,res) => {
        const exists = await Overall.findOne({shortid:req.params.id})
        if (exists) await exists.remove()
        res.json(exists ? 'deleted overall rating...' : 'couldnt find it bruv')
    })

app.route('/overall/:recording_id')
    .get( async(req,res) => {
        const docs = await Overall.find({recording_id: req.params.recording_id})
        res.json(docs)
    } )

app.route('/recording')
    .post( async(req,res) => {
        newRecording = new Recording({
            shortid: `recording_${shortid.generate()}`,
        })
        saved = await newRecording.save()
        res.json(saved)
    } )
    .get( async(req,res) => {
        res.json('hello world')
    })

app.route('/symptom')
    .post( async(req,res) => {
        let {symptom, notes, location, count, recording_id, severity} = req.body
        
        if (symptom === '') symptom=undefined
        if (notes === '') notes=undefined
        if (location === '') location=undefined
        if (count === '') count=undefined
        if (recording_id === '') recording_id=undefined
        if (severity === '') severity=undefined

        console.log(symptom, notes, location)

        newData = new Symptom({
            symptom:symptom, 
            notes:notes, 
            location:location, 
            count:count||1, 
            shortid:`symptom_${shortid.generate()}`,
            recording_id: recording_id,
            severity:severity,
        })

        console.log(newData)
        
        saved = await newData.save()
        res.json(saved)
    })

app.route('/symptom/:id')
    .get( async(req,res) => {
        const doc = await Symptom.findOne({shortid:req.params.id})
        res.json(doc)
    })
    .put( async(req,res) => {
        let {symptom, notes, location, count, recording_id} = req.body
        let update = {symptom:symptom, notes:notes, location:location, count:count, recording_id:recording_id}
        
        let updatedDoc = await Symptom.updateOne({shortid:req.params.id}, { $set:update })
        let docOutput = await Symptom.findOne({shortid:req.params.id})
        
        res.json(docOutput)
    })
    .delete( async(req,res) => {
        let docOutput = await Symptom.findOne({shortid:req.params.id})
        if (docOutput) await docOutput.remove()
        res.json(docOutput ? 'deleted' : 'nothing to delete')
    })

app.listen(PORT, () => console.log('new user connected'))