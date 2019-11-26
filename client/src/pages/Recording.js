import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom' 
import styled from 'styled-components'

const PageHeader = styled.div`
    box-sizing:border-box
    padding:0 32pt
    margin:0
`

const PageTitle = styled.h1`
    font-size:30pt
    text-align:center
`

const RecordingId = styled.p`
    font-size:12pt
    color:rgba(0,0,0,.24);
    text-align:center
    margin:0
    margin-top:24pt
`

const PrimaryButton = styled.button`
    border:none
    background: linear-gradient(to bottom, #FF5252 0%, #F50057 100%);
    color:white
    height:32pt
    border-radius:16pt
    padding:0 32pt;
    display:flex
    justify-content:center
    box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.18);
    width:100%

    transition: 0.25s
    &:hover{
        box-shadow: 0px 8px 8px 0px rgba(0,0,0,0.18);
    }
`

const Icon = styled.i`
    margin:0
    padding:0
`

const FormInput = styled.form`
    padding:0 32pt
`

const TextInput = styled.input`
    height:32pt
    border-radius:6pt
    padding: 0 8pt
    width:100%
    box-sizing:border-box
    border: 1px solid rgba(0,0,0,0.18)
`

const SliderInput = styled.input`
    height:32pt
    box-sizing:border-box
    width:100%
`

const AddLog = styled.input`
    margin-top:24pt
    height:32pt
    border:none
    border-radius:16pt
    width:100%
    background: linear-gradient(to bottom, #00E676 0%, #1DE9B6 100%);
    color:white
    font-weight:600

    box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.18);
    transition: 0.25s
    &:hover{
        box-shadow: 0px 8px 8px 0px rgba(0,0,0,0.18);
    }
`

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
            let {data} = await axios.post(`${this.props.baseFunctions.base_url}/recording`)
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
        let { data } = await axios.post(`${this.props.baseFunctions.base_url}/symptom`, this.props.newLog)
        data = {...data, recording_id:this.props.recording.recording_id}
        this.props.APPEND_LOG(data)
    }

    render(){
        return(
            <div>
                <PageHeader>
                    <PageTitle>🎙🎧📑</PageTitle>
                    <PrimaryButton onClick={this.toggleRecording}>{this.props.recording.isRecording ? <Icon className="material-icons">stop</Icon>: <Icon className="material-icons">fiber_manual_record</Icon>}</PrimaryButton>
                    <RecordingId>Recording ID: {this.props.recording.isRecording ? this.props.recording.recording_id : 'not recording'}</RecordingId>
                </PageHeader>
                <FormInput onSubmit={this.onSubmitSymptom}>
                    <label><p>Symptom</p> </label> <TextInput onChange={this.onFormChange} name='symptom' type='text' value={this.props.newLog.symptom}/> <br/>
                    <label><p>Severity</p> </label> <SliderInput onChange={this.onFormChange} name='severity' type='range' value={this.props.newLog.severity} min='0' max='10' /> <br/>
                    <label><p>Location</p> </label> <TextInput onChange={this.onFormChange} name='location' type='text' value={this.props.newLog.location} /> <br/>
                    <label><p>Notes</p> </label> <TextInput onChange={this.onFormChange} name='notes' type='text' value={this.props.newLog.notes} /> <br/>
                    <AddLog type='submit' value='Add Log'/>
                </FormInput>
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