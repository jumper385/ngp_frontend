import React, {Component} from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Recording from './pages/Recording';
import Overall from './pages/Overall';

class App extends Component {

  componentDidMount(){
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'development') {
      let DEV_URL = 'http://localhost:8080'
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
        <div className="App">
          <h1>Hello World</h1>
  
          <nav>
            <Link to='/'>Home</Link>
            <Link to='/recording'>Start Recording</Link>
          </nav>
  
          <Switch>
            <Route exact path='/'><h1>START RECORDING</h1></Route> 
            <Route exact path='/recording'> <Recording /></Route> 
            <Route exact path='/overall'> <Overall /></Route>
          </Switch>
  
        </div>
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
