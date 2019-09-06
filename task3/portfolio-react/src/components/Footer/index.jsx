import React, { Component } from 'react'
import "./footer.scss";


export default class Footer extends Component {
	render() {
		return (
			<footer className="footer">
				<div className="title">Contact / Follow me</div>
				<ul className="contact-list">
          <li className="twitter-link"><a href="https://twitter.com/Ganeshh___" target="_blank">twitter</a></li>
          <li className="medium-link"><a href="https://medium.com/@harshavardhan.n" target="_blank">medium</a></li>
          <li className="github-link"><a href="https://github.com/HarshaVardhanNakkina" target="_blank">github</a></li>
          <li className="email-link"><a href="mailto:ngshvardhan@gmail.com" target="_blank">mail</a></li>
					{/* <li className="email">gmail</li> */}
				</ul>
			</footer>
		)
	}
}
