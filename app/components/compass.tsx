'use client'

import { ArrowBigUpDash, Minus } from 'lucide-react'
import { calculateBearing, getCardinalDirection } from '../utils/geo'
import { GooglePlace } from './google-places-autocomplete'
import { Switch } from '../ui/switch'
import { useState } from 'react'

function KeyValueItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full flex flex-row gap-2">
      <span className="text-gray-400 uppercase">{label}</span>
      <span>{value}</span>
    </div>
  )
}

interface Props {
  geolocationPermission: string
  position: GeolocationPosition | null
  compassPermission: string
  direction: { degrees: number; cardinal: string } | null
  setDirection: (
    direction: { degrees: number; cardinal: string } | null,
  ) => void
  hasDeviceOrientationSupport: boolean
  toPlace: GooglePlace | null
  magneticDeclination: number
}

export default function Compass({
  position,
  direction,
  setDirection,
  hasDeviceOrientationSupport,
  toPlace,
  magneticDeclination,
}: Props) {
  const [showNorth, setShowNorth] = useState(false)

  function handleDirectionChange(e: React.FormEvent<HTMLInputElement>) {
    const newDirection = e.currentTarget.value

    if (isNaN(parseFloat(newDirection))) return

    if (parseFloat(newDirection) < 0 || parseFloat(newDirection) > 360) return

    setDirection({
      degrees: parseFloat(newDirection),
      cardinal: getCardinalDirection(parseFloat(newDirection)),
    })
  }

  function isWithinRange() {
    if (!position || !toPlace) return false

    const bearing = calculateBearing(
      position.coords.latitude,
      position.coords.longitude,
      toPlace.geometry.location.lat(),
      toPlace.geometry.location.lng(),
    )

    return (
      bearing > (direction?.degrees || 0) - 30 &&
      bearing < (direction?.degrees || 0) + 30
    )
  }

  function renderPlaceOnCompass() {
    if (!position || !toPlace) return null

    const bearing = calculateBearing(
      position.coords.latitude,
      position.coords.longitude,
      toPlace.geometry.location.lat(),
      toPlace.geometry.location.lng(),
    )

    // Calculate distance and normalize it
    // const distance = parseFloat(getDistance(
    //     position.coords.latitude,
    //     position.coords.longitude,
    //     toPlace.geometry.location.lat(),
    //     toPlace.geometry.location.lng(),
    // ));
    // const maxDistance = 250; // Maximum distance in km
    // const normalizedDistance = Math.min(distance / maxDistance, 1);

    // Calculate position on the circle, scaling radius by distance
    const maxRadius = 140 // Maximum radius (edge of circle)
    const scaledRadius = maxRadius + 16
    const angleInRadians =
      ((bearing - (direction?.degrees || 0)) * Math.PI) / 180
    const x = scaledRadius * Math.sin(angleInRadians)
    const y = -scaledRadius * Math.cos(angleInRadians)

    return (
      <ArrowBigUpDash
        className={`absolute size-20 text-blue fill-blue z-1 transition-opacity duration-300 ${isWithinRange() ? 'opacity-100' : 'opacity-75'}`}
        style={{
          transform: `translate(${x}px, ${y}px) rotate(${angleInRadians * (180 / Math.PI)}deg)`,
        }}
        strokeWidth={1}
      />
    )
  }

  function renderNorthOnCompass() {
    const maxRadius = 140
    const scaledRadius = maxRadius
    // North is at 0 degrees, so we only need to calculate relative to current direction
    const angleInRadians = ((0 - (direction?.degrees || 0)) * Math.PI) / 180
    const x = scaledRadius * Math.sin(angleInRadians)
    const y = -scaledRadius * Math.cos(angleInRadians)

    return (
      <Minus
        className="absolute size-5 text-red-500 z-1"
        style={{
          transform: `translate(${x}px, ${y}px) rotate(${angleInRadians * (180 / Math.PI)}deg)`,
        }}
        strokeWidth={1.5}
      />
    )
  }

  return (
    <div className="space-y-4 text-white w-full flex flex-col items-center">
      <div className="h-auto w-[280px] aspect-square relative bg-black flex items-center justify-center rounded-full">
        <div className="flex flex-col items-center justify-center">
          <p className="text-white uppercase text-sm leading-tight">
            Your heading and location
          </p>
          <div className="flex items-center">
            <input
              readOnly={hasDeviceOrientationSupport}
              className="text-center text-6xl bg-transparent inline"
              value={direction?.degrees || 0}
              onChange={(e) => handleDirectionChange(e)}
              style={{
                width: `${String(direction?.degrees || 0).length}ch`,
              }}
            />
            <p className="text-6xl text-center">°&nbsp;{direction?.cardinal}</p>
          </div>
          {position && (
            <div className="flex gap-2">
              <KeyValueItem
                label="Lat"
                value={`${position.coords.latitude.toFixed(2)}°`}
              />
              <KeyValueItem
                label="Lon"
                value={`${position.coords.longitude.toFixed(2)}°`}
              />
            </div>
          )}
          {(typeof magneticDeclination === 'number') && (
            <div className="flex justify-center">
              <KeyValueItem
                label="Declination"
                value={`${magneticDeclination.toFixed(2)}°`}
              />
            </div>
          )}
        </div>
        {position && toPlace && renderPlaceOnCompass()}
        {showNorth && renderNorthOnCompass()}
      </div>
      <div className="flex items-center space-x-2 pt-8">
        <Switch
          id="show-north"
          checked={showNorth}
          onCheckedChange={setShowNorth}
        />
        <label htmlFor="show-north" className="text-sm uppercase">
          Show North
        </label>
      </div>
    </div>
  )
}
