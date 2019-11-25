import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import axios from 'axios'
import { Link } from 'react-router-dom' 

const initialState = {}

class Recording extends Component {

    constructor(props){
        super(props)
        this.toggleRecording = this.toggleRecording.bind(this)
        this.onFormChange = this.onFormChange.bind(this)
    }

    componentDidMount(){
        this.setState(this.props.newLog)
    }

    toggleRecording = async e => {
        e.preventDefault()  
        if (this.props.recording.isRecording){
            this.props.STOP_RECORDING()
        } else {
            let {data} = await axios.post(`api/recording`)
            this.props.START_RECORDING(data)
        }

    }

    onFormChange = e => {
        let data = {[e.target.name]:e.target.value, recording_id:this.props.recording.recording_id}
        this.setState({[e.target.name]:e.target.value, recording_id:this.props.recording.recording_id})
        this.props.NEW_LOG(this.props.recording_id, data)
    }
    
    onSubmitSymptom = async e => {
        e.preventDefault()
        let { data } = await axios.post(`api/symptom`, this.props.newLog)
        data = {...data, recording_id:this.props.recording.recording_id}
        this.props.APPEND_LOG(data)
    }

    render(){
        return(
            <div>
                <h1>Recording Station 🎙</h1>
                <button onClick={this.toggleRecording}>{this.props.recording.isRecording ? '🛑 Stop Recording': '⏺ Start Recording'}</button>
                <p>RECORDING ID: {this.props.recording.isRecording ? this.props.recording.recording_id : 'not recording'}</p>
                <form onSubmit={this.onSubmitSymptom}>
                    <label>Symptom: </label> <input onChange={this.onFormChange} name='symptom' type='text' value={this.props.newLog.symptom}></input> <br/>
                    <label>Severity: </label> <input onChange={this.onFormChange} name='severity' type='range' value={this.props.newLog.severity} min='0' max='10'></input> <br/>
                    <label>Location: </label> <input onChange={this.onFormChange} name='location' type='text' value={this.props.newLog.location} /> <br/>
                    <label>Notes: </label> <input onChange={this.onFormChange} name='notes' type='text' value={this.props.newLog.notes} /> <br/>
                    <input type='submit'/>
                </form>
                <div>
                    { !this.props.recording.isRecording ? <Link to='/overall'>Rate Overall Feelings</Link> : 'look here when you finish recording!' }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
})

const mapDispatchToProps = dispatch => ({
    START_RECORDING: recording_id => dispatch({type:'START_RECORDING', payload:recording_id}),
    STOP_RECORDING: () => dispatch({type:'STOP_RECORDING'}),
    NEW_LOG: (recording_id, logObject) => dispatch({type:'NEW_LOG', payload:{recording_id:recording_id, ...logObject}}),
    APPEND_LOG: data => dispatch({type:'APPEND_LOG', payload:data}),
})

export default connect(mapStateToProps, mapDispatchToProps)(Recording)