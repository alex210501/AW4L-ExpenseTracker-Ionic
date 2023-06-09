import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.expensestracker.app',
  appName: 'expenseTracker',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
