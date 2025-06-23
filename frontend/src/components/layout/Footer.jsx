import React from "react"
import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
	const year = new Date().getFullYear()
	return (
		<footer className="bg-dark text-light py-3 text-center mt-auto">
			<Container>
				<Row>
					<Col>
						<p className="mb-0">&copy; {year} Paradise Hotel</p>
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
