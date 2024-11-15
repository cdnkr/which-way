'use client'

import { useEffect, useRef, useState } from 'react'
import { getCardinalDirection } from '../utils/geo'

export async function getMagneticDeclination(
  latitude: number,
  longitude: number,
) {
  const response = await fetch(
    `https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination?lat1=${latitude}&lon1=${longitude}&key=${process.env.NEXT_PUBLIC_NOAA_API_KEY}&resultFormat=json`,
  )
  const data = await response.json()

  if (!data?.result || data?.result?.length === 0) return 0

  const declination = data.result[0].declination
  return declination
}

export default function useDeviceOrientation({
  userPosition,
}: {
  userPosition: GeolocationPosition | null
}) {
  const [permission, setPermission] = useState('unknown')
  const [direction, setDirection] = useState<{
    degrees: number
    cardinal: string
  } | null>(null)
  const [hasSupport, setHasSupport] = useState(true)
  const magneticDeclinationRef = useRef(0)
  const [needsCalibration, setNeedsCalibration] = useState(false)
  const lastAlphaValues = useRef<number[]>([])

  // Function to check device orientation support
  const checkSupport = () => {
    if (typeof window === 'undefined') return false

    if (!window.DeviceOrientationEvent) {
      alert('Your device does not support compass functionality.')
      setHasSupport(false)
      setDirection({ degrees: 0, cardinal: 'N' })
      return false
    }
    return true
  }

  const checkCalibrationNeeded = (alpha: number) => {
    // Keep last 10 readings
    lastAlphaValues.current.push(alpha)
    if (lastAlphaValues.current.length > 10) {
      lastAlphaValues.current.shift()
    }

    // If we have enough readings, check if they're too stable (stuck) or too jumpy
    if (lastAlphaValues.current.length === 10) {
      const allSame = lastAlphaValues.current.every(
        (val) => Math.abs(val - lastAlphaValues.current[0]) < 0.1,
      )

      const tooJumpy = lastAlphaValues.current.some((val, i) => {
        if (i === 0) return false
        const diff = Math.abs(val - lastAlphaValues.current[i - 1])
        return diff > 40 && diff < 320 // Ignore differences near 360/0 boundary
      })

      setNeedsCalibration(allSame || tooJumpy)
    }
  }

  // Function to handle device motion/orientation data
  const handleOrientation = (event) => {
    let heading = 0

    console.log({ orientationEvent: event })
    // For iOS devices
    if (event?.webkitCompassHeading) {
      heading = event.webkitCompassHeading
      setNeedsCalibration(false) // iOS handles calibration internally
    }
    // For Android devices
    else if (event.alpha !== null) {
      checkCalibrationNeeded(event.alpha)
      // On Android, we need to handle the screen orientation
      const screenOrientation = window.screen.orientation?.angle || 0
      heading = (360 - event.alpha + screenOrientation) % 360
    } else {
      setHasSupport(false)
      setDirection({ degrees: 0, cardinal: 'N' })
    }

    if (heading !== undefined) {
      let cardinalDirection = getCardinalDirection(heading)

      const adjustedHeading =
        (heading + magneticDeclinationRef.current + 360) % 360

      setDirection({
        degrees: Math.round(adjustedHeading),
        cardinal: cardinalDirection,
      })
    }
  }

  // Function to request permission
  const requestPermission = async () => {
    if (!checkSupport()) return

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      // @ts-expect-error requestPermission is supported in iOS
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        // @ts-expect-error requestPermission is supported in iOS
        const response = await DeviceOrientationEvent.requestPermission()
        setPermission(response)

        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation)
        }
      } catch (error) {
        console.error('Error requesting orientation permission:', error)
        setPermission('error')
      }
    } else {
      // For non-iOS devices or older browsers
      window.addEventListener('deviceorientation', handleOrientation)
      setPermission('granted')
    }
  }

  useEffect(() => {
    if (!userPosition || magneticDeclinationRef.current !== 0) return

    getMagneticDeclination(
      userPosition.coords.latitude,
      userPosition.coords.longitude,
    ).then((declination) => {
      magneticDeclinationRef.current = declination
    })
  }, [userPosition])

  // Cleanup
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  return {
    permission,
    direction,
    setDirection,
    requestPermission,
    hasSupport,
    magneticDeclination: magneticDeclinationRef.current,
    needsCalibration,
    setNeedsCalibration,
  }
}
