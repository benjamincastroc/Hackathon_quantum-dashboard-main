"use client"

import { useState } from 'react'
import Image from 'next/image'

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

function Avatar({ src, alt = 'Avatar', size = 'md', fallback }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  
  const baseStyles = 'rounded-full object-cover bg-gray-200 flex items-center justify-center overflow-hidden'
  
  const sizeStyles = {
    sm: { cls: 'w-8 h-8 text-xs', px: 32 },
    md: { cls: 'w-10 h-10 text-sm', px: 40 },
    lg: { cls: 'w-12 h-12 text-base', px: 48 },
    xl: { cls: 'w-16 h-16 text-lg', px: 64 }
  }
  
  const showFallback = !src || imageError
  
  if (showFallback) {
    return (
      <div className={`${baseStyles} ${sizeStyles[size].cls} font-semibold text-gray-600`}>
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    )
  }
  
  return (
    <Image
      src={src as string}
      alt={alt}
      width={sizeStyles[size].px}
      height={sizeStyles[size].px}
      className={`${baseStyles} ${sizeStyles[size].cls}`}
      onError={() => setImageError(true)}
    />
  )
}

export default Avatar

