import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getGradeColor(grade: string | null) {
  if (!grade) return 'text-gray-500'
  
  switch (grade.toUpperCase()) {
    case 'A':
      return 'text-green-600'
    case 'B':
      return 'text-blue-600'
    case 'C':
      return 'text-yellow-600'
    case 'D':
      return 'text-orange-600'
    case 'F':
      return 'text-red-600'
    default:
      return 'text-gray-500'
  }
} 