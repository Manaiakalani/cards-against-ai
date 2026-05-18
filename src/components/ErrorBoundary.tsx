'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex h-dvh flex-col items-center justify-center gap-6 px-6"
          style={{ backgroundColor: 'var(--theme-bg, #F4F4EE)' }}
        >
          <span style={{ fontSize: 64 }}>💀</span>
          <h1
            style={{
              fontFamily: 'var(--font-archivo, sans-serif)',
              fontSize: 'clamp(28px, 6vw, 48px)',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'var(--theme-text, #111)',
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            Something broke
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: 16,
              color: 'var(--theme-text-secondary, #595959)',
              textAlign: 'center',
              maxWidth: 360,
            }}
          >
            The game hit an unexpected error. Try again — your stats are safe.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              fontFamily: 'var(--font-archivo, sans-serif)',
              fontSize: 18,
              fontWeight: 900,
              textTransform: 'uppercase',
              backgroundColor: '#66FF00',
              color: '#111',
              padding: '14px 40px',
              borderRadius: 100,
              border: '3px solid #111',
              boxShadow: '0px 6px 0px #111',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
