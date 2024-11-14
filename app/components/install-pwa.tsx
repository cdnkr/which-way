// components/InstallButton.tsx
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

const InstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event so it can be triggered later
            setDeferredPrompt(e);
            // Show the install button
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Show the install prompt
            (deferredPrompt as any).prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await (deferredPrompt as any).userChoice;
            // Reset the deferred prompt variable
            setDeferredPrompt(null);
            // Hide the install button after the prompt is shown
            setIsInstallable(false);
            console.log(`User response to the install prompt: ${outcome}`);
        }
    };

    return (
        <>
            {isInstallable && (
                <div className="absolute bottom-0 left-0 w-full">
                    <div className="max-w-screen-sm mx-auto py-4 border-t border-gray-700">
                        <button
                            onClick={handleInstallClick}
                            className="px-2 py-4 rounded-md w-full cursor-pointer flex items-center justify-center gap-2 bg-blue leading-none text-center"
                        >
                            <Download className="size-4" />
                            Install
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstallButton;
