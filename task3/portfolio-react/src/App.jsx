import React, { Component } from "react";
// import "./App.scss";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home"
import Footer from "./components/Footer"

export default class App extends Component {
	render() {
		return (
			<Router>
				<Header />
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/home" component={Home} />
				</Switch>
				<Footer />
			</Router>
		)
	}
}

// 		/*

// 			<React.Fragment>
// 					{/* <Header /> */}
// {/* <Switch> */ }
// {/* <Route exact path="/" component={Home} /> */ }
// {/* <Route path="/home" component={Home} /> */ }
// {/* <Route path="/login" component={Login} /> */ }
// {/* </Switch> */ }
// {/* <Footer /> */ }
// {/* <Route path="/" component={Home}>
// 						<IndexRoute component={App} />
// 						<Route path="/sna/:country" component={SNA} />
// 						<Route path="*" component={FourOFour} />
// 					</Route> */}
// 				</React.Fragment >

// 				* /