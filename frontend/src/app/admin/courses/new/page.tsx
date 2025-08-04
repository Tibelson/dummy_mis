'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { courseAPI } from '@/lib/api'
import { Course } from '@/lib/api'
import { BookOpen, ArrowLeft, Save, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function NewCoursePage() {
  const [formData, setFormData] = useState<Omit<Course, 'id'>>({
    courseCode: '',
    courseTitle: '',
    credits: 3,
    description: '',
    semester: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const semesters = [
    'Fall 2024',
    'Spring 2025',
    'Summer 2025',
    'Fall 2025',
    'Spring 2026',
  ]

  const creditOptions = [1, 2, 3, 4, 5, 6]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await courseAPI.createCourse(formData)
      toast.success('Course created successfully!')
      router.push('/admin')
    } catch (error: any) {
      console.error('Create course error:', error)
      toast.error(error.response?.data?.message || 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) : value
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
                <h1 className="text-3xl font-bold text-gray-900">Add New Course</h1>
                <p className="text-gray-600">Create a new course for the semester</p>
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
              <BookOpen className="w-5 h-5 mr-2" />
              Course Information
            </CardTitle>
            <CardDescription>
              Fill in the course details and requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Course Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="courseCode" className="text-sm font-medium">
                      Course Code *
                    </label>
                    <Input
                      id="courseCode"
                      name="courseCode"
                      type="text"
                      placeholder="e.g., CS101"
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Unique identifier for the course
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="courseTitle" className="text-sm font-medium">
                      Course Title *
                    </label>
                    <Input
                      id="courseTitle"
                      name="courseTitle"
                      type="text"
                      placeholder="e.g., Introduction to Computer Science"
                      value={formData.courseTitle}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="credits" className="text-sm font-medium">
                      Credit Hours *
                    </label>
                    <select
                      id="credits"
                      name="credits"
                      value={formData.credits}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {creditOptions.map((credit) => (
                        <option key={credit} value={credit}>
                          {credit} Credit{credit !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="semester" className="text-sm font-medium">
                      Semester *
                    </label>
                    <select
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((semester) => (
                        <option key={semester} value={semester}>
                          {semester}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Course Description
                </h3>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    placeholder="Provide a detailed description of the course content, objectives, and learning outcomes..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Describe what students will learn and what the course covers
                  </p>
                </div>
              </div>

              {/* Course Prerequisites */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Prerequisites & Requirements</h3>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Prerequisites</h4>
                  <p className="text-sm text-gray-600">
                    This course is open to all students. No specific prerequisites are required.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    You can add specific prerequisites later when editing the course.
                  </p>
                </div>
              </div>

              {/* Course Schedule */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Course Schedule</h3>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Schedule Information</h4>
                  <p className="text-sm text-blue-800">
                    Course schedule details will be added by the academic office.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Students will be notified of class times and locations once the schedule is finalized.
                  </p>
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
                  {loading ? 'Creating...' : 'Create Course'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 