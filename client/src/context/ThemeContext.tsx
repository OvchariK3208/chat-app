import type { ReactNode } from 'react'
import React, { createContext, useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextProps {
	theme: Theme
	toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
	undefined
)

interface ThemeProviderProps {
	children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	// Определяем начальную тему из localStorage или системной
	const getInitialTheme = (): Theme => {
		const saved = localStorage.getItem('theme-preference') as Theme | null
		if (saved) return saved
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light'
	}

	const [theme, setTheme] = useState<Theme>(getInitialTheme)

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		setTheme(newTheme)
		localStorage.setItem('theme-preference', newTheme)
	}

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}
