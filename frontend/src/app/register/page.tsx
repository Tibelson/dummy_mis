'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authAPI } from '@/lib/api'
import { Student } from '@/lib/api'
import { GraduationCap, User, Mail, Calendar, Building } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    admissionNumber: '',
    dateOfBirth: '',
    department: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Business Administration',
    'Economics',
    'Psychology',
    'Sociology',
    'English',
    'History',
    'Political Science',
    'Art',
    'Music',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.register(formData)
      toast.success('Registration successful! You can now login with your admission number.')
      router.push('/login')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Student Registration</CardTitle>
            <CardDescription>
              Create your student account to access the MIS Web system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Academic Information
                </h3>
                
                <div className="space-y-2">
                  <label htmlFor="admissionNumber" className="text-sm font-medium">
                    Admission Number *
                  </label>
                  <Input
                    id="admissionNumber"
                    name="admissionNumber"
                    type="text"
                    placeholder="Enter your admission number"
                    value={formData.admissionNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    This will be your username for logging in
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Date of Birth *
                    </label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="department" className="text-sm font-medium flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      Department *
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Important Notes</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Your admission number will be your username for login</li>
                <li>• Your initial password will be your admission number</li>
                <li>• Please change your password after first login</li>
                <li>• All fields marked with * are required</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 