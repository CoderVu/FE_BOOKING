import React, { useContext } from "react"
import { AuthContext } from "../auth//AuthProvider"
import { Link, useHistory} from "react-router-dom"

const Logout = () => {
	const auth = useContext(AuthContext)
	const history = useHistory()

	const handleLogout = () => {
		auth.handleLogout()
		history.push("/", { state: { message: " You have been logged out!" } })
	}

	return (
		<>
			<li>
				<Link className="dropdown-item" to={"/profile"}>
					Profile
				</Link>
			</li>
			<li>
				<hr className="dropdown-divider" />
			</li>
			<button className="dropdown-item" onClick={handleLogout}>
				Logout
			</button>
		</>
	)
}

export default Logout
