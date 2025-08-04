'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { courseAPI, studentAPI } from '@/lib/api'
import { Course, Enrollment } from '@/lib/api'
import { BookOpen, Clock, Users, GraduationCap, ArrowLeft, Calendar, Award } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = parseInt(params.id as string)
  
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    if (courseId) {
      fetchCourseData()
    }
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      const [courseRes, enrollmentsRes] = await Promise.all([
        courseAPI.getCourseById(courseId),
        studentAPI.getEnrollments(1).catch(() => ({ data: [] })) // Mock student ID
      ])
      
      setCourse(courseRes.data)
      setEnrollments(enrollmentsRes.data.filter(e => e.courseId === courseId))
    } catch (error) {
      console.error('Error fetching course data:', error)
      toast.error('Failed to load course information')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      const studentId = 1 // This would come from user context in a real app
      await studentAPI.enrollInCourse(studentId, courseId)
      toast.success('Successfully enrolled in course!')
      fetchCourseData() // Refresh data
    } catch (error: any) {
      console.error('Enrollment error:', error)
      toast.error(error.response?.data?.message || 'Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  const handleDropCourse = async (enrollmentId: number) => {
    if (confirm('Are you sure you want to drop this course?')) {
      try {
        const studentId = 1 // This would come from user context in a real app
        await studentAPI.dropCourse(studentId, enrollmentId)
        toast.success('Successfully dropped course')
        fetchCourseData() // Refresh data
      } catch (error: any) {
        console.error('Drop course error:', error)
        toast.error('Failed to drop course')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const isEnrolled = enrollments.length > 0
  const enrollment = enrollments[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/courses">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{course.courseTitle}</h1>
                <p className="text-gray-600">{course.courseCode}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              {!isEnrolled ? (
                <Button onClick={handleEnroll} disabled={enrolling}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  onClick={() => enrollment && handleDropCourse(enrollment.id)}
                >
                  Drop Course
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{course.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Credits</p>
                      <p className="text-lg font-semibold">{course.credits}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Semester</p>
                      <p className="text-lg font-semibold">{course.semester}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  What you'll learn in this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Introduction to core concepts and fundamentals</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Practical applications and real-world examples</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Hands-on projects and assignments</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Assessment and evaluation methods</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  This course is open to all students. No specific prerequisites are required.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Status */}
            {isEnrolled && enrollment && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Enrolled
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Enrollment Date:</span>
                    <span className="text-sm font-medium">
                      {formatDate(enrollment.enrollmentDate)}
                    </span>
                  </div>
                  {enrollment.grade && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Grade:</span>
                      <span className="text-sm font-medium text-green-600">
                        {enrollment.grade}
                      </span>
                    </div>
                  )}
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleDropCourse(enrollment.id)}
                  >
                    Drop Course
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Course Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Enrolled Students</span>
                  </div>
                  <span className="font-semibold">{enrollments.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Duration</span>
                  </div>
                  <span className="font-semibold">16 weeks</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Credits</span>
                  </div>
                  <span className="font-semibold">{course.credits}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/courses/${course.id}/syllabus`}>
                    View Syllabus
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/courses/${course.id}/assignments`}>
                    View Assignments
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/courses/${course.id}/grades`}>
                    View Grades
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 