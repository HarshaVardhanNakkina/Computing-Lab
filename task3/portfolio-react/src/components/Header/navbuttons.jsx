import React, { Component } from 'react'
import "./navbuttons.scss"
import { Link } from "react-router-dom";

export default class NavButtons extends Component {
	render() {
		return (
			<div class="nav-buttons-row">
				<Link class="nav-button" to="/home">
					home
				</Link>
				<div class="nav-button">experience/projects</div>
				<div class="nav-button">contact</div>
			</div>
		)
	}
}
