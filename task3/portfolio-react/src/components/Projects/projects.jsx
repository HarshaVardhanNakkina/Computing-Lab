import React, { Component } from 'react'
import "./projects.scss";
export default class Projects extends Component {
	render() {
		return (
			<div class="projects-container">
				<h1>Experience</h1>
				<div className="projects-list">
					<div className="list-item">
						<div className="type">Internship</div>
						<div className="company-name">iBuild Innovations India Ltd.	</div>
						<div className="duration">May 2017 - Dec 2018</div>
						<div className="role">Front-end Developer</div>
						{/* <div className="description">I had been be part of couple of projects. A lot of my work was to use Reactjs to develop views for the APIs, making API calls to the backend, managing the front-end state. It helped me in understanding front-end web development. Gained knowledge about tools like Git, NPM and new JavaScript features, functional programming. </div> */}
						<div className="description">I had been be part of couple of projects. Gained experience on Reactjs, tools like Git, NPM and new JavaScript features, functional programming. </div>
					</div>
					<div className="list-item">
						<div className="type">Internship</div>
						<div className="company-name">OpsRamp, Inc</div>
						<div className="duration">Dec 2017 - Apr 2019</div>
						<div className="role">Front-end Developer</div>
						<div className="description">Part of my job was to research about Vuejs, implement re-usable components like progress-bar, date-picker etc...</div>
					</div>
				</div>
			</div>
		)
	}
}
