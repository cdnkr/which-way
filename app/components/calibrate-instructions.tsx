import { CheckCircle } from 'lucide-react';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

export function CalibrateInstructions({
    needsCalibration,
    setNeedsCalibration,
}: {
    needsCalibration: boolean
    setNeedsCalibration: (value: boolean) => void
}) {
    return (
        <Dialog open={needsCalibration} onOpenChange={setNeedsCalibration}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Compass calibration required</DialogTitle>
                    <DialogDescription>
                        <hr className="border-gray-700 my-2" />
                        <div className="space-y-4">
                            <ol className="text-left list-decimal pl-6 space-y-1">
                                <li>Hold your device upright</li>
                                <li>Move your device in a figure-8 pattern</li>
                                <li>Repeat this motion for about 10 seconds</li>
                            </ol>
                        </div>
                        <button
                            onClick={() => setNeedsCalibration(false)}
                            className="mt-8 px-2 py-4 rounded-md w-full cursor-pointer flex items-center justify-center gap-2 bg-blue leading-none text-center"
                        >
                            <CheckCircle className="size-4" />
                            Done calibrating
                        </button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
