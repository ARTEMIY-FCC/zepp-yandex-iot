/**
 * Яндекс OAuth конфигурация
 * 
 * ⚠️  ВАЖНО: Перед использованием необходимо заменить placeholder'ы на реальные данные!
 * 
 * 📋 Инструкция по получению credentials:
 * 1. Перейдите на https://oauth.yandex.ru/client/new
 * 2. Создайте новое приложение
 * 3. В настройках приложения найдите "Client ID" и "Client Secret"
 * 4. Замените значения ниже на ваши реальные credentials
 * 
 * 🔐 Безопасность:
 * - Никогда не публикуйте этот файл с реальными credentials в открытом доступе
 * - Используйте переменные окружения в продакшене
 * - Регулярно ротируйте Client Secret
 */

// 🔑 Яндекс OAuth credentials
export const YANDEX_OAUTH_CONFIG = {
  // Client ID вашего приложения в Яндексе
  CLIENT_ID: 'bea1fcac295048088805144e06103bcb',
  
  // Client Secret вашего приложения в Яндексе
  CLIENT_SECRET: '5612c157176a444aa4aa4dd02d25e6ff', // так уж и быть, оставлю)
  
  // OAuth endpoints
  ENDPOINTS: {
    DEVICE_CODE: 'https://oauth.yandex.ru/device/code',
    TOKEN: 'https://oauth.yandex.ru/token',
    USER_INFO: 'https://api.iot.yandex.net/v1.0/user/info',
    SCENARIOS: 'https://api.iot.yandex.net/v1.0/scenarios',
    DEVICES: 'https://api.iot.yandex.net/v1.0/devices',
    DEVICE_ACTIONS: 'https://api.iot.yandex.net/v1.0/devices/actions'
  }
}

// 📱 URL для авторизации устройства
export const DEVICE_AUTH_URL = 'http://ya.ru/device'

// ⚠️ Проверка конфигурации
export function validateConfig() {
  if (YANDEX_OAUTH_CONFIG.CLIENT_ID === 'YOUR_CLIENT_ID_HERE' || 
      YANDEX_OAUTH_CONFIG.CLIENT_SECRET === 'YOUR_CLIENT_SECRET_HERE') {
    console.error('❌ ОШИБКА: Необходимо настроить Яндекс OAuth credentials в utils/config/yandex.js')
    console.error('📖 Следуйте инструкции в комментариях файла')
    return false
  }
  return true
}
