import React from 'react'
import { useState, } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Shield, 
  Star,
  Clock,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [stats] = useState({
    totalJobs: 1250,
    activeWorkers: 3400,
    completedProjects: 8900,
    averageRating: 4.8,
  })

  const features = [
    {
      icon: Users,
      title: "Skilled Professionals",
      description: "Connect with verified, skilled workers across various industries",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "End-to-end security with verified profiles and secure payments",
    },
    {
      icon: Clock,
      title: "Fast Matching",
      description: "Get matched with the right professionals in minutes, not hours",
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "All professionals are vetted and rated by previous clients",
    },
  ]
const pricingPlans = [
    {
      name: "Basic",
      price: "ETB50",
      period: "per month",
      features: [
        "Post up to 5 jobs",
        "Basic matching algorithm",
        "Email support",
        "Standard verification"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "ETB100",
      period: "per month",
      features: [
        "Post unlimited jobs",
        "Advanced matching algorithm",
        "Priority support",
        "Enhanced verification",
        "Analytics dashboard",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "ETB150",
      period: "per month",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "API access",
        "Custom integrations",
        "Advanced analytics",
        "24/7 phone support"
      ],
      popular: false
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content: "JobSpark helped us find the perfect freelancer for our project. The quality of work exceeded our expectations!",
      rating: 5,
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Michael Chen",
      role: "Freelance Developer",
      company: "Independent",
      content: "As a worker, JobSpark provides me with consistent, high-quality job opportunities. The platform is user-friendly and reliable.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      company: "Creative Studio",
      content: "The booking system is seamless, and the quality of professionals on JobSpark is consistently high. Highly recommended!",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ]

  return (
    <div className="min-h-screen m-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Perfect
                <span className="text-orange-400"> Job Match</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Connect skilled professionals with amazing opportunities. Whether you're looking for work or need expert help, JobSpark makes it happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/jobs"
                  className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center group"
                >
                    <Search className='mr-4'/>Find Jobs
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Post a Job
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Professional working"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat title="Active Jobs" value={stats.totalJobs} />
          <Stat title="Skilled Workers" value={stats.activeWorkers} />
          <Stat title="Projects Completed" value={stats.completedProjects} />
          <Stat title="Average Rating" value={stats.averageRating} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose JobSpark?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've built the most comprehensive platform to connect talented professionals with meaningful opportunities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your needs. All plans include our core features and 24/7 support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow ${
                  plan.popular ? 'border-2 border-blue-500' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors cursor-pointer ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    <a href='/payment'> Get Started </a>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our community has to say about JobSpark.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of professionals who have found their perfect match on JobSpark. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center group"
              >
                Join as a Worker
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Hire Professionals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>      
    </div>
  )
}

const Stat = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center"
  >
    <div className="text-4xl font-bold text-blue-700 mb-2">{value.toLocaleString()}+</div>
    <div className="text-gray-600">{title}</div>
  </motion.div>
)

export default Home