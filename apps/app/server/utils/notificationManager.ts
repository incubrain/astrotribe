// src/utils/notificationService.ts

import axios from 'axios'

interface NotificationOptions {
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any>
}

class NotificationService {
  private whatsappApiUrl: string
  private whatsappApiToken: string

  constructor() {
    const config = useRuntimeConfig().public
    this.whatsappApiUrl = config.whatsappUrl
    this.whatsappApiToken = config.whatsappToken
  }

  async sendNotification(options: NotificationOptions): Promise<void> {
    const { message, severity, context } = options
    const log = useServerLogger()

    try {
      const formattedMessage = this.formatMessage(message, severity, context)
      await this.sendToWhatsApp(formattedMessage)
      // log.info('Notification sent successfully', { severity, context })
    } catch (error) {
      // log.error('Failed to send notification', { error, severity, context })
    }
  }

  private formatMessage(message: string, severity: string, context?: Record<string, any>): string {
    let formattedMessage = `[${severity.toUpperCase()}] ${message}`
    if (context) {
      formattedMessage += '\nContext: ' + JSON.stringify(context, null, 2)
    }
    return formattedMessage
  }

  private async sendToWhatsApp(message: string): Promise<void> {
    await axios.post(this.whatsappApiUrl, {
      message,
      token: this.whatsappApiToken,
    })
  }
}

export const notificationService = new NotificationService()
