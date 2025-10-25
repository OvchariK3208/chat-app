import cn from 'classnames'
import { Formik, Form } from 'formik'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import * as Yup from 'yup'
import useAuth from '@/hooks/useAuth'
import Button from '@/shared/ui/Button'
import FieldForm from '@/shared/ui/FieldForm'
import styles from './LoginForm.module.scss'

const initialValues = {
	email: '',
	password: '',
}

const schemas = {
	login: Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Required'),
		password: Yup.string()
			.min(6, 'Password should be at least 6 characters')
			.required('Required'),
	}),
}

const LoginForm: FC<{ className?: string }> = ({ className }) => {
	const { isAuth, login, checkAuth, authError } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) checkAuth()
		if (isAuth) navigate('/chat', { replace: true })
	}, [isAuth])

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={schemas.login}
			onSubmit={async ({ email, password }) => {
				try {
					await login(email, password)
				} catch (err) {
					console.error('Login error', err)
				}
			}}
		>
			{({ isValid, dirty }) => (
				<Form className={cn(styles.form, className)}>
					<div className={styles.form__fields}>
						<FieldForm
							label='Email'
							name='email'
							id='email'
							placeholder='Enter your email'
							type='email'
							className={styles.form__field}
						/>
						<FieldForm
							label='Password'
							name='password'
							id='password'
							placeholder='Enter your password'
							type='password'
							className={styles.form__field}
						/>

						{authError && <div className={styles.form__error}>{authError}</div>}
					</div>

					<Button
						type='submit'
						disabled={!(isValid && dirty)}
					>
						Login
					</Button>
				</Form>
			)}
		</Formik>
	)
}

export default LoginForm
