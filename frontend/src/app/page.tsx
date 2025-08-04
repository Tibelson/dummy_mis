'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, GraduationCap, BarChart3, Plus, Search } from 'lucide-react'
import { courseAPI, studentAPI } from '@/lib/api'
import { Course, Student, Enrollment } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, studentsRes] = await Promise.all([
          courseAPI.getAllCourses(),
          studentAPI.getStudentById(1).catch(() => null), // Just to get some data
        ])
        
        setCourses(coursesRes.data)
        setStats({
          totalCourses: coursesRes.data.length,
          totalStudents: 0, // Will be updated when we have student data
          totalEnrollments: 0,
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">MIS Web Dashboard</h1>
              <p className="text-gray-600">Student Management System</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </Link>
              <Link href="/admin">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Available courses this semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Enrolled students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">
                Active course enrollments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/courses">
                  <Button variant="outline" className="h-20 flex-col w-full">
                    <BookOpen className="w-6 h-6 mb-2" />
                    View Courses
                  </Button>
                </Link>
                <Link href="/students">
                  <Button variant="outline" className="h-20 flex-col w-full">
                    <Users className="w-6 h-6 mb-2" />
                    View Students
                  </Button>
                </Link>
                <Link href="/enrollments">
                  <Button variant="outline" className="h-20 flex-col w-full">
                    <GraduationCap className="w-6 h-6 mb-2" />
                    Enrollments
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button variant="outline" className="h-20 flex-col w-full">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System Online</p>
                    <p className="text-xs text-muted-foreground">All services operational</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sample Data Loaded</p>
                    <p className="text-xs text-muted-foreground">Courses and admin user created</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Available Courses</CardTitle>
            <CardDescription>
              Courses available for enrollment this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{course.courseTitle}</h3>
                      <p className="text-sm text-gray-600">{course.courseCode}</p>
                      <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {course.credits} Credits
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {course.semester}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Link href={`/courses/${course.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/enroll/${course.id}`}>
                      <Button size="sm">
                        Enroll
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 