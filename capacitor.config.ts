
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bdafa2ce95c3440d8959bcbe9fd26b53',
  appName: 'button-bash-arena',
  webDir: 'dist',
  server: {
    url: 'https://bdafa2ce-95c3-440d-8959-bcbe9fd26b53.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1625',
      showSpinner: false
    }
  }
};

export default config;
