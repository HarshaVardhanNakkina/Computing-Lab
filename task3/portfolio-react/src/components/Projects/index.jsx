import React, { Component } from 'react';
import Projects from "./projects";
import Education from "./education";

export default class ExpAndProjects extends Component {
	render() {
		return (
			<React.Fragment>
				<Education />
				<Projects />
			</React.Fragment>
		)
	}
}
