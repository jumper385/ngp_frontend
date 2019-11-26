import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

const SliderInput = styled.input`
    width:100%
`
const NoteInput = styled.input`
    height:32pt
    border-radius:6pt
    padding: 0 8pt
    width:100%
    box-sizing:border-box
    border: 1px solid rgba(0,0,0,0.18)
`
const ActionBox = styled.div`
    width:100%
    background:pink
    height:32pt
    margin-top:24pt
    background: linear-gradient(to bottom, #64FFDA 0%, #1DE9B6 100%);
    border-radius: 16pt 
`
const SubmitButton = styled.input`
    width:100%
    height:100%
    border:none
    background:none
    display:flex
    align-items:center
    justify-content:center
    color:white
    font-weight:600
`
const StyledLink = styled(Link)`
    width:100%
    height:100%
    text-decoration:none
    background:none
    border:none
    display:flex
    align-items:center
    justify-content:center
    color:white
    font-weight:600
`
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
    
    componentDidMount(){
        this.setState({completed:false})
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
        const ActionButton = (props) => {
            let { completed } = props
            console.log(completed)
            if (!completed){
                return(
                    <ActionBox>
                        <SubmitButton type='submit'/> 
                    </ActionBox>
                )
            } else {
                return(
                    <ActionBox>
                        <StyledLink to='/'>Go Home 😇</StyledLink>
                    </ActionBox>
                )
            }
        }
        return(
            <div>
                <h1>😎 Overall 🎙</h1>
                <p>{this.props.recording.recording_id || 'NO ID ATM...'}</p>
                <form onSubmit={this.onSubmit}>
                    <label><p>Overall Symptoms</p></label> <SliderInput onChange={this.onChange} name='overall' type='range' min='0' max='10'/> <br/>
                    <label><p>Abdominal Pain</p></label> <SliderInput onChange={this.onChange} name='abdPain' type='range' min='0' max='10'/> <br/>
                    <label><p>Bloating</p></label> <SliderInput onChange={this.onChange} name='bloating' type='range' min='0' max='10'/> <br/>
                    <label><p>Wind</p></label> <SliderInput onChange={this.onChange} name='wind' type='range' min='0' max='10'/> <br/>
                    <label><p>Notes</p></label> <NoteInput onChange={this.onChange} name='notes' type='text'/> <br />
                    <ActionButton {...this.state}/>     
                </form>
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