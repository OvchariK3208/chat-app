import { Routes, Route, Navigate } from 'react-router'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Layout from '@/components/Layout'
import Chat from '@/pages/Chat'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Registration from '@/pages/Registration'

function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<Routes>
					<Route
						path='/'
						element={<Layout />}
					>
						<Route
							index
							element={
								<Navigate
									to='/registration'
									replace
								/>
							}
						/>
						<Route
							path='/registration'
							element={<Registration />}
						/>
						<Route
							path='/login'
							element={<Login />}
						/>
						<Route
							path='/chat'
							element={<Chat />}
						/>
						<Route
							path='*'
							element={<NotFound />}
						/>
					</Route>
				</Routes>
			</AuthProvider>
		</ThemeProvider>
	)
}

export default App
