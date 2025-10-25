import cn from 'classnames'
import React from 'react'
import { Link } from 'react-router'
import ThemeToggle from '@/components/ThemeToggle'
import RegistrationForm from '@/components/RegistrationForm'
import { UserProvider } from '@/context/UserContext'
import styles from './Registration.module.scss'

const Registration: React.FC = () => {
	return (
		<UserProvider>
			<div className={styles['float-toggle']}>
				<ThemeToggle />
			</div>
			<div className={styles.wrapper}>
				<div className={styles.form}>
					<h1 className={cn('h1', styles.form__title)}>Create an account</h1>
					<RegistrationForm />
					<div className={styles.form__actions}>
						<span className={cn('p', styles['form__actions-text'])}>
							Already have an account?
						</span>
						<Link
							className={cn('p', styles['form__actions-link'])}
							to='/login'
						>
							log in
						</Link>
					</div>
				</div>
			</div>
		</UserProvider>
	)
}

export default Registration
