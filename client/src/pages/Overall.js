import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Overall extends Component {

    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillMount(){
        this.setState({
            overall:5,
            abdPain:5,
            bloating:5,
            wind:5,
        })
    }

    onChange = async e => {
        this.setState({[e.target.name]:e.target.value})
    }

    onSubmit = async e => {
        e.preventDefault()
        let recording_id = {recording_id:this.props.recording.recording_id}
        let overallSubmission = await axios.post(
            `${this.props.baseFunctions.base_url}/overall`,
            {...recording_id, ...this.state}
        )
        overallSubmission ? console.log('DONE', overallSubmission) : console.log('SOMETHING WENT WRONG...')
        this.setState({completed:true})
    }

    render(){
        return(
            <div>
                <h1>Overall Feeling</h1>
                <p>{this.props.recording.recording_id || 'NO ID ATM...'}</p>
                <form onSubmit={this.onSubmit}>
                    <label>Overall</label> <input onChange={this.onChange} name='overall' type='range' min='0' max='10'/> <br/>
                    <label>Abdominal Pain</label> <input onChange={this.onChange} name='abdPain' type='range' min='0' max='10'/> <br/>
                    <label>Bloating</label> <input onChange={this.onChange} name='bloating' type='range' min='0' max='10'/> <br/>
                    <label>Wind</label> <input onChange={this.onChange} name='wind' type='range' min='0' max='10'/> <br/>
                    <label>Notes</label> <input onChange={this.onChange} name='notes' type='text'/>   
                    <input type='submit'/>                 
                </form>
                <div>{this.state.completed ? <Link to='/'>Go Home 😇</Link> : 'plz submit your overall ratings...'}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
})

const mapDispatchToProps = dispatch => ({
    COMPLETE_RECORDING: () => dispatch({type:'COMPLETE_RECORDING'})
})

export default connect(mapStateToProps, mapDispatchToProps)(Overall)