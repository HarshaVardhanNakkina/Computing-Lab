import React, { Component } from 'react'
import "./footer.scss";


export default class Footer extends Component {
	render() {
		return (
			<footer class="footer">
				<div class="title">Contact / Follow me</div>
				<ul class="contact-list">
					<li>twitter</li>
					<li>medium</li>
					<li>github</li>
					<li>gmail</li>
				</ul>
			</footer>
		)
	}
}
