import { useState, useEffect, useRef, useCallback } from 'react';


export function useInstallPrompt() {
  
  const promptRef = useRef(null);

  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled,   setIsInstalled]   = useState(false);
  const [isIOS,         setIsIOS]         = useState(false);

  useEffect(() => {
   
    const standaloneMedia = window.matchMedia?.('(display-mode: standalone)');
    const alreadyInstalled =
      standaloneMedia?.matches ||
      window.navigator.standalone === true; 

    if (alreadyInstalled) {
      setIsInstalled(true);
      return;
    }


    const ua = navigator.userAgent;
    const iosDevice = /iphone|ipad|ipod/i.test(ua);
    const safari    = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
    if (iosDevice && safari) {
      setIsIOS(true);
      setIsInstallable(true); 
      return;
    }

    const onBeforeInstall = (e) => {
      e.preventDefault();          
      promptRef.current = e;       
      setIsInstallable(true);
    };

    const onInstalled = () => {
      promptRef.current = null;
      setIsInstalled(true);
      setIsInstallable(false);
    };

    const onModeChange = (mq) => {
      if (mq.matches) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    standaloneMedia?.addEventListener('change', onModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      standaloneMedia?.removeEventListener('change', onModeChange);
    };
  }, []);


  const promptInstall = useCallback(async () => {
    if (isIOS) return { outcome: 'ios' };
    if (!promptRef.current) return { outcome: 'unavailable' };

    promptRef.current.prompt();
    const choice = await promptRef.current.userChoice;
    promptRef.current = null;
    setIsInstallable(false);
    if (choice.outcome === 'accepted') setIsInstalled(true);
    return choice;
  }, [isIOS]);

  return { isInstallable, isInstalled, isIOS, promptInstall };
}
