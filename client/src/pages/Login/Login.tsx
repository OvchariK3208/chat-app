import cn from 'classnames'
import React from 'react'
import { Link } from 'react-router'
import ThemeToggle from '@/components/ThemeToggle'
import LoginForm from '@/components/LoginForm'
import { UserProvider } from '@/context/UserContext'
import styles from './Login.module.scss'

const Login: React.FC = () => {
	return (
		<UserProvider>
			<div className={styles['float-toggle']}>
				<ThemeToggle />
			</div>
			<div className={styles.wrapper}>
				<div className={styles.form}>
					<h1 className={cn('h1', styles.form__title)}>
						Login to your account
					</h1>
					<LoginForm className={styles['form__form-content']} />
					<div className={styles.form__actions}>
						<span className={cn('p', styles['form__actions-text'])}>
							Don’t have an account?
						</span>
						<Link
							className={cn('p', styles['form__actions-link'])}
							to='/registration'
						>
							sign up
						</Link>
					</div>
				</div>
			</div>
		</UserProvider>
	)
}

export default Login
