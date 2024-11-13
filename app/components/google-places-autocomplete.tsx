import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/app/ui/input'

export interface GooglePlace {
  formatted_address: string
  geometry: {
    location: {
      lat: () => number
      lng: () => number
    }
  }
}

interface GooglePlacesAutocompleteProps {
  place: GooglePlace | null
  onPlaceSelected: (place: GooglePlace) => void
  placeholder: string
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  place,
  onPlaceSelected,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    place?.formatted_address || '',
  )
  const inputRef = useRef<HTMLInputElement | null>(null)
  // @ts-expect-error google will be on window
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    // @ts-expect-error "google" exists on window I promise - not doing gymnastics for this type - sorry :`)
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`
      script.async = true
      script.onload = () => initializeAutocomplete()
      document.body.appendChild(script)
    } else {
      initializeAutocomplete()
    }
  }, [])

  const initializeAutocomplete = () => {
    if (inputRef.current) {
      // @ts-expect-error GOOGLE. WILL. BE. ON. WINDOW. ISWEAR
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: [
            'address_components',
            'geometry.location',
            'place_id',
            'formatted_address',
          ],
          bounds: null,
        },
      )

      autocompleteRef.current.addListener('place_changed', handlePlaceSelect)
    }
  }

  const handlePlaceSelect = () => {
    const place: GooglePlace = autocompleteRef.current?.getPlace()
    if (place && place.geometry) {
      onPlaceSelected(place)
      setInputValue(place.formatted_address || '')
    }
  }

  useEffect(() => {
    if (!place && inputValue) setInputValue('')
  }, [place])

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder}
      onClick={() => setInputValue('')}
    />
  )
}

export default GooglePlacesAutocomplete
