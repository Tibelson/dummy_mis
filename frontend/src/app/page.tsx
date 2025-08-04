'use client'

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, UserCheck } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Footer } from '@/components/ui/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mb-6">
              {/* University Logo */}
              <div className="mb-4">
                <Logo size={100} className="mx-auto" />
              </div>
              <h2 className="text-lg font-semibold tracking-wide">UNIVERSITY OF GHANA</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              COMPUTER ENGINEERING
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              STUDENT SYSTEM
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Welcome to the Computer Engineering portal
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Register</h3>
                <p className="text-sm text-gray-600 mb-4">Create your student account</p>
                <Link href="/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Login</h3>
                <p className="text-sm text-gray-600 mb-4">Access your account</p>
                <Link href="/login">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Dashboard</h3>
                <p className="text-sm text-gray-600 mb-4">View your academic overview</p>
                <Link href="/student">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    View Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Enroll</h3>
                <p className="text-sm text-gray-600 mb-4">Browse and enroll in courses</p>
                <Link href="/courses">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Browse Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Why Choose Our System?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Academic Excellence</h3>
                <p className="text-gray-600">Track your academic progress with precision and ease</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Student Support</h3>
                <p className="text-gray-600">Comprehensive support for all your academic needs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Course Management</h3>
                <p className="text-gray-600">Easy course enrollment and management system</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-green-100">Courses Available</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-purple-100">Faculty Members</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white text-center">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-orange-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 