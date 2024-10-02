import type { Consola } from 'consola'

export function useLogger(tag?: string): Consola

export function useErrorHandler(): (error: Error) => void

export function handleDBErrors(error: Error): any | null
