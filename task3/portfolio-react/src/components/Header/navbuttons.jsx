import React, { Component } from 'react'
import "./navbuttons.scss"
import { Link } from "react-router-dom";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";

export default class NavButtons extends Component {
	render() {
		return (
			<div className="nav-buttons-row">
				<Link className="nav-button" to="/home">
					home
				</Link>
				<Link className="nav-button" to="/exp">
					experience/projects
				</Link>
				{/* <div className="nav-button">contact</div> */}
        <ScrollLink 
          to="contact"
          spy={true}
          smooth={true}
          duration={500}
        ><div className="nav-button">contact</div></ScrollLink>
			</div>
		)
	}
}
