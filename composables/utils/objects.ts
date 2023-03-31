export const pluck = <T, K extends keyof T>(objs: T[], key: K): T[K][] => objs.map((obj) => obj[key])
