import React, { Component } from 'react'

export default class Education extends Component {
	render() {
		return (
			<div class="projects-container">
				<h1>Education</h1>
				<div className="projects-list">
					<div className="list-item">
						<div className="type">S.S.C</div>
						<div className="inst-name">Gosthani Vidya Peeth High School	</div>
						<div className="duration">2011 - 2012</div>
						<div className="cgpa">10 / 10</div>
					</div>
					<div className="list-item">
						<div className="type">P.U.C.</div>
						<div className="inst-name">Rajiv Gandhi University of Knowledge Technologies</div>
						<div className="duration">2012 - 2014</div>
						<div className="cgpa"> 8.64 / 10 </div>
					</div>
					<div className="list-item">
						<div className="type">B.Tech</div>
						<div className="inst-name">Rajiv Gandhi University of Knowledge Technologies</div>
						<div className="duration">2014 - 2018</div>
						<div className="cgpa"> 8.14 / 10</div>
					</div>
					{/* <div className="list-item">
						<div className="type">Internship</div>
						<div className="inst-name">OpsRamp, Inc</div>
						<div className="duration">Dec 2017 - Apr 2019</div>
						<div className="cgpa">Front-end Developer</div>
					</div> */}
				</div>
			</div>

		)
	}
}
