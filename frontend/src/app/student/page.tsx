'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { courseAPI, studentAPI } from '@/lib/api'
import { Course, Student, Enrollment } from '@/lib/api'
import { User, BookOpen, GraduationCap, BarChart3, Calendar, Award, Mail, Building } from 'lucide-react'
import { formatDate, getGradeColor } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [grades, setGrades] = useState<Enrollment[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      const studentId = 1 // This would come from user context in a real app
      const [studentRes, enrollmentsRes, gradesRes, coursesRes] = await Promise.all([
        studentAPI.getStudentById(studentId),
        studentAPI.getEnrollments(studentId),
        studentAPI.getGrades(studentId),
        courseAPI.getAllCourses()
      ])
      
      setStudent(studentRes.data)
      setEnrollments(enrollmentsRes.data)
      setGrades(gradesRes.data)
      setAvailableCourses(coursesRes.data)
    } catch (error) {
      console.error('Error fetching student data:', error)
      toast.error('Failed to load student data')
    } finally {
      setLoading(false)
    }
  }

  const calculateGPA = () => {
    if (grades.length === 0) return 'N/A'
    
    const gradePoints = {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
    }
    
    const totalPoints = grades.reduce((sum, grade) => {
      return sum + (gradePoints[grade.grade as keyof typeof gradePoints] || 0)
    }, 0)
    
    return (totalPoints / grades.length).toFixed(2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student dashboard...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load student information.</p>
          <Button asChild>
            <Link href="/login">
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {student.firstName}!</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link href="/courses">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Courses
                </Link>
              </Button>
              <Button asChild>
                <Link href="/student/profile">
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Profile */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Student Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{student.admissionNumber}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{student.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>DOB: {formatDate(student.dateOfBirth)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Academic Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current GPA</span>
                  <span className="font-semibold">{calculateGPA()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Courses Enrolled</span>
                  <span className="font-semibold">{enrollments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Credits</span>
                  <span className="font-semibold">
                    {enrollments.reduce((sum, enrollment) => {
                      const course = availableCourses.find(c => c.id === enrollment.courseId)
                      return sum + (course?.credits || 0)
                    }, 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Current Enrollments
                </CardTitle>
                <CardDescription>
                  Your enrolled courses for this semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments yet</h3>
                    <p className="text-gray-600 mb-4">Start by enrolling in some courses.</p>
                    <Button asChild>
                      <Link href="/courses">
                        Browse Courses
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => {
                      const course = availableCourses.find(c => c.id === enrollment.courseId)
                      return (
                        <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{course?.courseTitle || 'Unknown Course'}</h4>
                            <p className="text-sm text-gray-600">{course?.courseCode}</p>
                            <p className="text-xs text-gray-500">
                              Enrolled: {formatDate(enrollment.enrollmentDate)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {course?.credits} Credits
                            </span>
                            {enrollment.grade && (
                              <span className={`text-sm px-2 py-1 rounded ${getGradeColor(enrollment.grade)}`}>
                                Grade: {enrollment.grade}
                              </span>
                            )}
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/courses/${course?.id}`}>
                                View Course
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Grades */}
            {grades.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Recent Grades
                  </CardTitle>
                  <CardDescription>
                    Your latest academic performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grades.slice(0, 5).map((grade) => {
                      const course = availableCourses.find(c => c.id === grade.courseId)
                      return (
                        <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{course?.courseTitle || 'Unknown Course'}</h4>
                            <p className="text-sm text-gray-600">{course?.courseCode}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-lg font-semibold ${getGradeColor(grade.grade)}`}>
                              {grade.grade}
                            </span>
                            <span className="text-sm text-gray-500">
                              {course?.credits} Credits
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {grades.length > 5 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" asChild>
                        <Link href="/student/grades">
                          View All Grades
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" asChild className="h-20 flex-col">
                    <Link href="/courses">
                      <BookOpen className="w-6 h-6 mb-2" />
                      Browse Courses
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-20 flex-col">
                    <Link href="/student/enrollments">
                      <GraduationCap className="w-6 h-6 mb-2" />
                      My Enrollments
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-20 flex-col">
                    <Link href="/student/grades">
                      <Award className="w-6 h-6 mb-2" />
                      View Grades
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-20 flex-col">
                    <Link href="/student/profile">
                      <User className="w-6 h-6 mb-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 