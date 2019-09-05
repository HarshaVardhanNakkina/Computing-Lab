import React, { Component } from 'react'
import "./footer.scss";


export default class Footer extends Component {
	render() {
		return (
			<footer className="footer">
				<div className="title">Contact / Follow me</div>
				<ul className="contact-list">
					<li className="twitter-link"><a href="http://">twitter</a></li>
					<li className="medium-link"><a href="http://">medium</a></li>
					<li className="github-link"><a href="http://">github</a></li>
					<li className="email">gmail</li>
				</ul>
			</footer>
		)
	}
}
