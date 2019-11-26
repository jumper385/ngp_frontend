import React, {Component} from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Recording from './pages/Recording';
import Overall from './pages/Overall';

const AppDiv = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');
  font-family: 'Poppins', sans-serif;
`

const Banner = styled.div`
  margin:0
  padding:32pt
`

const Title = styled.h1`
  margin:0
  text-align:center
`

const NavBar = styled.nav`
  display:flex
  height:32pt;
  align-items:center
  justify-content:space-around
`

const StyleLink = styled(Link)`
  text-decoration:none
`

class App extends Component {

  componentDidMount(){
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'development') {
      let DEV_URL = 'http://localhost:8080/api'
      this.props.ADD_DEV_URL(DEV_URL)
    }
    if (process.env.NODE_ENV === 'production'){
      let URL = 'api'
      console.log(URL)
      this.props.ADD_DEV_URL(URL)
    }
  }
  
  render(){
    return (
      <Router>
        <AppDiv className="App">

          <Banner>
            <Title>The Noisy Guts Project</Title>
          </Banner>
  
          <NavBar>
            <StyleLink to='/'>Home</StyleLink>
            <StyleLink to='/recording'>Start Recording</StyleLink>
            <StyleLink to='/'>Some Random Link</StyleLink>
            <StyleLink to='/'>Like and Sub 👍</StyleLink>
          </NavBar>
  
          <Switch>
            <Route exact path='/'><h1>START RECORDING</h1></Route> 
            <Route exact path='/recording'> <Recording /></Route> 
            <Route exact path='/overall'> <Overall /></Route>
          </Switch>
  
        </AppDiv>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  ADD_DEV_URL: url => dispatch({type:'ADD_API_BASE_URL', payload:url})
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
