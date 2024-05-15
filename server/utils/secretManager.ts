import * as uuid from 'uuid'

class SecretManager {
  private currentSecret: string
  private previousSecret: string
  private rotationInterval: number

  constructor() {
    this.currentSecret = this.generateSecret()
    this.previousSecret = this.currentSecret // Initially, they are the same
    this.rotationInterval = 604800000 // Rotate weekly, in milliseconds
    setInterval(() => this.rotateSecret(), this.rotationInterval)
  }

  private generateSecret(): string {
    return uuid.v4()
  }

  private rotateSecret() {
    this.previousSecret = this.currentSecret // Update previous secret
    this.currentSecret = this.generateSecret()
    console.log('Secret rotated')
  }

  getSecret() {
    return this.currentSecret
  }

  getPreviousSecret() {
    return this.previousSecret
  }
}

const secretManager = new SecretManager()

export function getCurrentSecret() {
  return secretManager.getSecret()
}

export function getPreviousSecret() {
  return secretManager.getPreviousSecret()
}
