'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { courseAPI, studentAPI } from '@/lib/api'
import { Course } from '@/lib/api'
import { BookOpen, Search, Filter, Plus, Eye, GraduationCap } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, selectedSemester])

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses()
      setCourses(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = courses

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by semester
    if (selectedSemester !== 'all') {
      filtered = filtered.filter(course => course.semester === selectedSemester)
    }

    setFilteredCourses(filtered)
  }

  const getUniqueSemesters = () => {
    const semesters = courses.map(course => course.semester)
    return ['all', ...Array.from(new Set(semesters))]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="text-gray-600">Browse and enroll in available courses</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/courses/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {getUniqueSemesters().map(semester => (
                    <option key={semester} value={semester}>
                      {semester === 'all' ? 'All Semesters' : semester}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-sm text-gray-600 flex items-center">
                {filteredCourses.length} of {courses.length} courses
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
                    <CardDescription className="text-sm font-mono">
                      {course.courseCode}
                    </CardDescription>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.credits} Credits
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {course.semester}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link href={`/courses/${course.id}`}>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/enroll/${course.id}`}>
                    <Button size="sm" className="flex-1">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      Enroll
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedSemester !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No courses are currently available.'
                }
              </p>
              {(searchTerm || selectedSemester !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSemester('all')
                  }}
                >
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 