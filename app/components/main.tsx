'use client'

import useDeviceOrientation from '@/app/hooks/use-device-orientation'
import useGeolocation from '@/app/hooks/use-geolocation'
import { Compass as CompassIcon } from 'lucide-react'
import Compass from './compass'
import GooglePlacesAutocomplete, {
  GooglePlace,
} from './google-places-autocomplete'
import { useState } from 'react'

export default function Main() {
  const {
    permission: compassPermission,
    direction,
    setDirection,
    hasSupport: hasDeviceOrientationSupport,
    requestPermission: requestCompassPermission,
  } = useDeviceOrientation()
  const {
    permission: geolocationPermission,
    position,
    requestPermission: requestGeolocationPermission,
  } = useGeolocation()

  const [place, setPlace] = useState<GooglePlace | null>(null)

  async function onRequestPermission() {
    await requestCompassPermission()
    await requestGeolocationPermission()
  }

  return (
    <div className="p-4 max-w-screen-sm mx-auto w-full space-y-4">
      <div className="">
        <h1 className="text-2xl font-bold uppercase">Which Way</h1>
        <p className="text-gray-400 text-base leading-tight">
          Select a place, and see which direction it is from your current
          location.
        </p>
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
          />
        </div>
      )}
    </div>
  )
}
