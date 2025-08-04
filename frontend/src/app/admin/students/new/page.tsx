'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { studentAPI } from '@/lib/api'
import { Student } from '@/lib/api'
import { Users, User, Mail, Calendar, Building, ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function NewStudentPage() {
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
      await studentAPI.createStudent(formData)
      toast.success('Student created successfully!')
      router.push('/admin')
    } catch (error: any) {
      console.error('Create student error:', error)
      toast.error(error.response?.data?.message || 'Failed to create student')
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
                <p className="text-gray-600">Create a new student account</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Student Information
            </CardTitle>
            <CardDescription>
              Fill in the student's personal and academic information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
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
                      placeholder="Enter last name"
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
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium flex items-center">
                  <Building className="w-5 h-5 mr-2" />
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
                    placeholder="Enter admission number"
                    value={formData.admissionNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    This will be the student's username for logging in
                  </p>
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

              {/* Account Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Default Login Credentials</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Username:</strong> {formData.admissionNumber || '[Admission Number]'}</p>
                    <p><strong>Password:</strong> {formData.admissionNumber || '[Admission Number]'}</p>
                    <p className="text-xs mt-2">The student should change their password after first login.</p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" asChild>
                  <Link href="/admin">
                    Cancel
                  </Link>
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Creating...' : 'Create Student'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 