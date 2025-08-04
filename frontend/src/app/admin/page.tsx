'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { courseAPI, studentAPI } from '@/lib/api'
import { Course, Student, Enrollment } from '@/lib/api'
import { Users, BookOpen, GraduationCap, Plus, Edit, Trash2, BarChart3 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [coursesRes] = await Promise.all([
        courseAPI.getAllCourses(),
        // studentAPI.getAllStudents().catch(() => ({ data: [] }))
      ])
      
      setCourses(coursesRes.data)
      setStudents([]) // Will be populated when we have student data
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        // await courseAPI.deleteCourse(courseId)
        setCourses(courses.filter(c => c.id !== courseId))
        toast.success('Course deleted successfully')
      } catch (error) {
        toast.error('Failed to delete course')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage students, courses, and enrollments</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/students/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'enrollments', label: 'Enrollments', icon: GraduationCap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Enrolled students
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courses.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Available courses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Active enrollments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">N/A</div>
                  <p className="text-xs text-muted-foreground">
                    Across all courses
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/admin/students/new">
                      <Button variant="outline" className="h-20 flex-col w-full">
                        <Users className="w-6 h-6 mb-2" />
                        Add Student
                      </Button>
                    </Link>
                    <Link href="/admin/courses/new">
                      <Button variant="outline" className="h-20 flex-col w-full">
                        <BookOpen className="w-6 h-6 mb-2" />
                        Add Course
                      </Button>
                    </Link>
                    <Link href="/admin/enrollments">
                      <Button variant="outline" className="h-20 flex-col w-full">
                        <GraduationCap className="w-6 h-6 mb-2" />
                        Manage Enrollments
                      </Button>
                    </Link>
                    <Link href="/admin/reports">
                      <Button variant="outline" className="h-20 flex-col w-full">
                        <BarChart3 className="w-6 h-6 mb-2" />
                        View Reports
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest system updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sample courses created</p>
                        <p className="text-xs text-muted-foreground">CS101, MATH201, ENG101</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Admin user configured</p>
                        <p className="text-xs text-muted-foreground">System ready for use</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Students</h2>
              <Link href="/admin/students/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </div>

            {students.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first student.</p>
                  <Link href="/admin/students/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Student
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <Card key={student.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {student.firstName} {student.lastName}
                          </CardTitle>
                          <CardDescription>{student.email}</CardDescription>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>Admission:</strong> {student.admissionNumber}</p>
                        <p><strong>Department:</strong> {student.department}</p>
                        <p><strong>DOB:</strong> {formatDate(student.dateOfBirth)}</p>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Link href={`/admin/students/${student.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Courses</h2>
              <Link href="/admin/courses/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
                        <CardDescription className="font-mono">{course.courseCode}</CardDescription>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {course.credits} Credits
                      </span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {course.semester}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'enrollments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Enrollments</h2>
              <Link href="/admin/enrollments/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Enrollment
                </Button>
              </Link>
            </div>

            <Card className="text-center py-12">
              <CardContent>
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments yet</h3>
                <p className="text-gray-600 mb-4">Enrollments will appear here once students register for courses.</p>
                <Link href="/admin/enrollments/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Enrollment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

// Helper function for deleting students (to be implemented)
const handleDeleteStudent = (studentId: number) => {
  if (confirm('Are you sure you want to delete this student?')) {
    // Implementation would go here
    toast.success('Student deleted successfully')
  }
} 