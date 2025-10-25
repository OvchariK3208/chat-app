import React from 'react'
import { Link } from 'react-router'
import cn from 'classnames'
import styles from './NotFound.module.scss'

const NotFound: React.FC = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.notfound}>
				<h1 className={cn('h1', styles.notfound__title)}>404</h1>
				<p className={cn('p', styles.notfound__message)}>
					Oops! The page you’re looking for doesn’t exist.
				</p>

				<Link
					to='/registration'
					className={cn('p', styles.notfound__link)}
				>
					Go to Registration
				</Link>
			</div>
		</div>
	)
}

export default NotFound
