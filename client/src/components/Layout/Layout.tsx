import { Outlet } from 'react-router'
import styles from './Layout.module.scss'

const Layout = () => {
	return (
		<div className={styles.container}>
			<main>
				<Outlet />
			</main>
		</div>
	)
}

export default Layout
