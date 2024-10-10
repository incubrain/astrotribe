import type { Consola } from 'consola'

export function useLogger(tag?: string): Consola

export function handleDBErrors(error: Error): any | null
