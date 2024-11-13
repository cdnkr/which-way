import * as React from 'react'

import { cn } from '@/app/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  IconEl?: React.ReactNode
  symbolEl?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, IconEl, symbolEl, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {symbolEl && (
          <div className="absolute top-0 left-1 h-full flex items-center">
            <div className="rounded-full p-1 h-8 w-8 flex items-center justify-center">
              {symbolEl}
            </div>
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full text-white bg-black rounded-md border border-blue px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            symbolEl && 'pl-9',
            className,
          )}
          ref={ref}
          {...props}
        />
        {IconEl && (
          <div className="absolute top-0 right-1 h-full flex items-center">
            <div className="text-white bg-dark rounded-full p-1 h-8 w-8 flex items-center justify-center">
              {IconEl}
            </div>
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
