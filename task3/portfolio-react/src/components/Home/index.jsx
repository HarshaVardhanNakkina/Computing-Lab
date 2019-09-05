import React, { Component } from 'react'
import "./home.scss";
export default class Home extends Component {
	render() {
		return (
			<main className="main-content">
				<section className="intro">
					<div>
						<h1>I am an</h1>
						<h1>Enthusiastic</h1>
						<h1>Web Developer,</h1>
						<h1>Programmer.</h1>
					</div>
					<div className="edu-details">
						<h2>Doing masters in</h2>
						<h2>Information Security</h2>
						<h2>at NITK, Surthkal.</h2>
					</div>
				</section>
			</main>
		)
	}
}
