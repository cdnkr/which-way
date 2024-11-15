'use client'

import useDeviceOrientation from '@/app/hooks/use-device-orientation'
import useGeolocation from '@/app/hooks/use-geolocation'
import { Compass as CompassIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { CalibrateInstructions } from './calibrate-instructions'
import Compass from './compass'
import GooglePlacesAutocomplete, {
  GooglePlace,
} from './google-places-autocomplete'
import InstallButton from './install-pwa'

export default function Main() {
  const {
    permission: geolocationPermission,
    position,
    requestPermission: requestGeolocationPermission,
  } = useGeolocation()
  const {
    permission: compassPermission,
    direction,
    setDirection,
    hasSupport: hasDeviceOrientationSupport,
    requestPermission: requestCompassPermission,
    magneticDeclination,
    needsCalibration,
    setNeedsCalibration,
  } = useDeviceOrientation({ userPosition: position })

  const [place, setPlace] = useState<GooglePlace | null>(null)

  async function onRequestPermission() {
    await requestCompassPermission()
    await requestGeolocationPermission()
  }

  return (
    <div className="md:pt-8">
      <div className="pt-4 pb-4 pl-4 pr-4 md:pt-4 md:pb-12 md:pl-8 md:pr-8 max-w-screen-sm mx-auto w-full space-y-4 bg-[#111111] rounded-lg">
        <div>
          <div className="flex justify-center items-center gap-4">
            <Image
              src="/icons/512.png"
              alt="Compass disabled"
              width={80}
              height={80}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">WhichWay</h1>
              <p className="text-gray-400 text-base leading-tight">
                Select a place, and see which direction it is from your current
                location.
              </p>
            </div>
          </div>
          {!hasDeviceOrientationSupport && (
            <div className="mt-2">
              <p className="text-orange-700">
                <b>Your device does not support the orientation API.</b>
                <br />
                You can manually input your heading by clicking on the heading
                indicator in the centre of the compass.
              </p>
            </div>
          )}
        </div>
        <hr className="border-gray-700" />
        {compassPermission !== 'granted' ? (
          <button
            onClick={onRequestPermission}
            className="px-2 py-4 rounded-md w-full cursor-pointer flex items-center justify-center gap-2 bg-blue leading-none text-center"
          >
            <CompassIcon className="size-4" />
            Enable Compass and Location
          </button>
        ) : (
          <div className="space-y-16">
            <div className="space-y-2">
              <GooglePlacesAutocomplete
                place={place}
                onPlaceSelected={setPlace}
                placeholder="Search for a place"
              />
            </div>
            <Compass
              geolocationPermission={geolocationPermission}
              position={position}
              compassPermission={compassPermission}
              direction={direction}
              setDirection={setDirection}
              hasDeviceOrientationSupport={hasDeviceOrientationSupport}
              toPlace={place}
              magneticDeclination={magneticDeclination}
            />
          </div>
        )}
        <InstallButton />
        <CalibrateInstructions
          needsCalibration={needsCalibration}
          setNeedsCalibration={setNeedsCalibration}
        />
      </div>
    </div>
  )
}
