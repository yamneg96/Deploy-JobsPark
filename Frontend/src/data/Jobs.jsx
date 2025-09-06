import React from 'react';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const { user } = useAuth();
  const jobListings = user ? ([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Kifiya Financial Technologies',
      logo: 'https://placehold.co/80x80/5e81f4/ffffff?text=KFT',
      location: 'Debrezeyt, Ethiopia',
      type: 'Full-Time',
      tags: ['IT & Software', 'Banking'],
      salary: 12000000,
      salaryStr: 'ETB 1.2M/yr',
      applied: false,
      bookmarked: false,
      date: '5th Jul 2025',
      description: 'We are looking for an experienced Senior Software Engineer to join our team. You will be responsible for designing and implementing complex software solutions, mentoring junior developers, and collaborating with cross-functional teams.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of software development experience',
        'Strong knowledge of Java, Spring Boot, and microservices',
        'Experience with cloud technologies (AWS, Azure)',
        'Excellent problem-solving skills'
      ]
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'ArifPay',
      logo: 'https://placehold.co/80x80/4e8b8b/ffffff?text=AP',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-Time',
      tags: ['Design', 'Fintech'],
      salary: 900000,
      salaryStr: 'ETB 900k/yr',
      applied: true,
      bookmarked: false,
      date: '5th Jul 2025',
      description: 'Join our design team to create beautiful and intuitive user experiences for our financial products. You will work closely with product managers and developers to bring designs to life.',
      requirements: [
        '3+ years of UX/UI design experience',
        'Portfolio demonstrating strong design skills',
        'Proficiency in Figma, Sketch, or Adobe XD',
        'Understanding of user-centered design principles',
        'Experience with user research and testing'
      ]
    },
    {
      id: 3,
      title: 'Digital Marketing Specialist',
      company: 'Safaricom Ethiopia',
      logo: 'https://placehold.co/80x80/ff6b6b/ffffff?text=SE',
      location: 'Addis Ababa, Ethiopia',
      type: 'Contract',
      tags: ['Marketing', 'Telecom'],
      salary: 800000,
      salaryStr: 'ETB 800k/yr',
      applied: false,
      bookmarked: false,
      date: '5th Jul 2025',
      description: 'We are seeking a Digital Marketing Specialist to develop and implement our digital marketing strategy across various channels including social media, email, and search engines.',
      requirements: [
        'Degree in Marketing or related field',
        '2+ years of digital marketing experience',
        'Experience with Google Ads and social media advertising',
        'Strong analytical skills',
        'Excellent written and verbal communication skills'
      ]
    },
    {
      id: 4,
      title: 'Sales Manager',
      company: 'Ethio Telecom',
      logo: 'https://placehold.co/80x80/7e3b8a/ffffff?text=ET',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-Time',
      tags: ['Sales', 'Telecom'],
      salary: 1500000,
      salaryStr: 'ETB 1.5M/yr',
      applied: true,
      bookmarked: false,
      date: '5th Jul 2025',
      description: 'Lead our sales team to achieve revenue targets and expand our customer base. You will develop sales strategies, manage key accounts, and build relationships with enterprise clients.',
      requirements: [
        '5+ years of sales experience in telecom or related industry',
        'Proven track record of meeting sales targets',
        'Strong leadership and team management skills',
        'Excellent negotiation and communication skills',
        'Bachelor\'s degree in Business or related field'
      ]
    },
    {
      id: 5,
      title: 'Data Scientist',
      company: 'iCog Labs',
      logo: 'https://placehold.co/80x80/f4a261/ffffff?text=IC',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-Time',
      tags: ['AI', 'Research'],
      salary: 1800000,
      salaryStr: 'ETB 1.8M/yr',
      applied: false,
      bookmarked: false,
      date: '6th Jul 2025',
      description: 'Join our AI research team to develop cutting-edge machine learning models and analyze complex datasets. You will work on projects ranging from natural language processing to computer vision.',
      requirements: [
        'Master\'s or PhD in Computer Science, Statistics, or related field',
        'Strong programming skills in Python',
        'Experience with machine learning frameworks (TensorFlow, PyTorch)',
        'Knowledge of statistical modeling and data analysis',
        'Publications in relevant conferences/journals is a plus'
      ]
    },
    {
      id: 6,
      title: 'Graphic Designer',
      company: 'Qene Technologies',
      logo: 'https://placehold.co/80x80/2a9d8f/ffffff?text=QT',
      location: 'Addis Ababa, Ethiopia',
      type: 'Part-Time',
      tags: ['Design', 'Creative'],
      salary: 600000,
      salaryStr: 'ETB 600k/yr',
      applied: false,
      bookmarked: false,
      date: '6th Jul 2025',
      description: 'Create visually stunning designs for our digital products and marketing materials. You will collaborate with the marketing and product teams to produce engaging visual content.',
      requirements: [
        '2+ years of graphic design experience',
        'Proficiency in Adobe Creative Suite',
        'Strong portfolio showcasing design skills',
        'Understanding of branding and visual identity',
        'Ability to work on multiple projects simultaneously'
      ]
    }
  ]) : ([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Kifiya Financial Technologies',
      logo: 'https://placehold.co/80x80/5e81f4/ffffff?text=KFT',
      location: 'Debrezeyt, Ethiopia',
      type: 'Full-Time',
      tags: ['IT & Software', 'Banking'],
      salary: 12000000,
      salaryStr: 'ETB 1.2M/yr',
      applied: false,
      bookmarked: false,
      date: '5th Jul 2025',
      description: 'We are looking for an experienced Senior Software Engineer to join our team. You will be responsible for designing and implementing complex software solutions, mentoring junior developers, and collaborating with cross-functional teams.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of software development experience',
        'Strong knowledge of Java, Spring Boot, and microservices',
        'Experience with cloud technologies (AWS, Azure)',
        'Excellent problem-solving skills'
      ]
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'ArifPay',
      logo: 'https://placehold.co/80x80/4e8b8b/ffffff?text=AP',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-Time',
      tags: ['Design', 'Fintech'],
      salary: 900000,
      salaryStr: 'ETB 900k/yr',
      applied: true,
      bookmarked: false,
      date: '5th Jul 2025',
      description: 'Join our design team to create beautiful and intuitive user experiences for our financial products. You will work closely with product managers and developers to bring designs to life.',
      requirements: [
        '3+ years of UX/UI design experience',
        'Portfolio demonstrating strong design skills',
        'Proficiency in Figma, Sketch, or Adobe XD',
        'Understanding of user-centered design principles',
        'Experience with user research and testing'
      ]
    },
    {
      id: 3,
      title: 'Digital Marketing Specialist',
      company: 'Safaricom Ethiopia',
      logo: 'https://placehold.co/80x80/ff6b6b/ffffff?text=SE',
      location: 'Addis Ababa, Ethiopia',
      type: 'Contract',
      tags: ['Marketing', 'Telecom'],
      salary: 800000,
      salaryStr: 'ETB 800k/yr',
      applied: false,
      bookmarked: false,
      date: '5th Jul 2025',
      description: 'We are seeking a Digital Marketing Specialist to develop and implement our digital marketing strategy across various channels including social media, email, and search engines.',
      requirements: [
        'Degree in Marketing or related field',
        '2+ years of digital marketing experience',
        'Experience with Google Ads and social media advertising',
        'Strong analytical skills',
        'Excellent written and verbal communication skills'
      ]
    },
    {
      id: 4,
      title: 'Sales Manager',
      company: 'Ethio Telecom',
      logo: 'https://placehold.co/80x80/7e3b8a/ffffff?text=ET',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-Time',
      tags: ['Sales', 'Telecom'],
      salary: 1500000,
      salaryStr: 'ETB 1.5M/yr',
      applied: true,
      bookmarked: false,
      date: '5th Jul 2025',
      description: 'Lead our sales team to achieve revenue targets and expand our customer base. You will develop sales strategies, manage key accounts, and build relationships with enterprise clients.',
      requirements: [
        '5+ years of sales experience in telecom or related industry',
        'Proven track record of meeting sales targets',
        'Strong leadership and team management skills',
        'Excellent negotiation and communication skills',
        'Bachelor\'s degree in Business or related field'
      ]
    },
    {
      id: 5,
      title: 'Data Scientist',
      company: 'iCog Labs',
      logo: 'https://placehold.co/80x80/f4a261/ffffff?text=IC',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-Time',
      tags: ['AI', 'Research'],
      salary: 1800000,
      salaryStr: 'ETB 1.8M/yr',
      applied: false,
      bookmarked: false,
      date: '6th Jul 2025',
      description: 'Join our AI research team to develop cutting-edge machine learning models and analyze complex datasets. You will work on projects ranging from natural language processing to computer vision.',
      requirements: [
        'Master\'s or PhD in Computer Science, Statistics, or related field',
        'Strong programming skills in Python',
        'Experience with machine learning frameworks (TensorFlow, PyTorch)',
        'Knowledge of statistical modeling and data analysis',
        'Publications in relevant conferences/journals is a plus'
      ]
    },
    {
      id: 6,
      title: 'Graphic Designer',
      company: 'Qene Technologies',
      logo: 'https://placehold.co/80x80/2a9d8f/ffffff?text=QT',
      location: 'Addis Ababa, Ethiopia',
      type: 'Part-Time',
      tags: ['Design', 'Creative'],
      salary: 600000,
      salaryStr: 'ETB 600k/yr',
      applied: false,
      bookmarked: false,
      date: '6th Jul 2025',
      description: 'Create visually stunning designs for our digital products and marketing materials. You will collaborate with the marketing and product teams to produce engaging visual content.',
      requirements: [
        '2+ years of graphic design experience',
        'Proficiency in Adobe Creative Suite',
        'Strong portfolio showcasing design skills',
        'Understanding of branding and visual identity',
        'Ability to work on multiple projects simultaneously'
      ]
    }
]);

const similarJobs = user ? ([
  {
    id: 101,
    title: 'Frontend Developer',
    company: 'Hellio Digital',
    location: 'Addis Ababa, Ethiopia',
    salaryStr: 'ETB 1M/yr',
    tags: ['IT & Software'],
    description: 'Develop responsive and interactive user interfaces using modern JavaScript frameworks.',
    requirements: [
      '3+ years of frontend development experience',
      'Proficiency in React or Angular',
      'Strong CSS/HTML skills',
      'Experience with REST APIs',
      'Knowledge of UI/UX principles'
    ]
  },
  {
    id: 102,
    title: 'Backend Developer',
    company: 'Zayride',
    location: 'Addis Ababa, Ethiopia',
    salaryStr: 'ETB 1.1M/yr',
    tags: ['IT & Software'],
    description: 'Build and maintain scalable backend services for our ride-sharing platform.',
    requirements: [
      '4+ years of backend development experience',
      'Strong knowledge of Node.js or Python',
      'Experience with database design',
      'Understanding of microservices architecture',
      'Familiarity with cloud platforms'
    ]
  }
]) : ([
  {
    id: 101,
    title: 'Frontend Developer',
    company: 'Hellio Digital',
    location: 'Addis Ababa, Ethiopia',
    salaryStr: 'ETB 1M/yr',
    tags: ['IT & Software'],
    description: 'Develop responsive and interactive user interfaces using modern JavaScript frameworks.',
    requirements: [
      '3+ years of frontend development experience',
      'Proficiency in React or Angular',
      'Strong CSS/HTML skills',
      'Experience with REST APIs',
      'Knowledge of UI/UX principles'
    ]
  },
  {
    id: 102,
    title: 'Backend Developer',
    company: 'Zayride',
    location: 'Addis Ababa, Ethiopia',
    salaryStr: 'ETB 1.1M/yr',
    tags: ['IT & Software'],
    description: 'Build and maintain scalable backend services for our ride-sharing platform.',
    requirements: [
      '4+ years of backend development experience',
      'Strong knowledge of Node.js or Python',
      'Experience with database design',
      'Understanding of microservices architecture',
      'Familiarity with cloud platforms'
    ]
  }
])

  return {jobListings, similarJobs};

};

export default Jobs;
// export const Jobs = [
//     {
//       id: 1,
//       title: 'Senior Software Engineer',
//       company: 'Kifiya Financial Technologies',
//       logo: 'https://placehold.co/80x80/5e81f4/ffffff?text=KFT',
//       location: 'Debrezeyt, Ethiopia',
//       type: 'Full-Time',
//       tags: ['IT & Software', 'Banking'],
//       salary: 12000000,
//       salaryStr: 'ETB 1.2M/yr',
//       applied: false,
//       bookmarked: false,
//       date: '5th Jul 2025',
//       description: 'We are looking for an experienced Senior Software Engineer to join our team. You will be responsible for designing and implementing complex software solutions, mentoring junior developers, and collaborating with cross-functional teams.',
//       requirements: [
//         'Bachelor\'s degree in Computer Science or related field',
//         '5+ years of software development experience',
//         'Strong knowledge of Java, Spring Boot, and microservices',
//         'Experience with cloud technologies (AWS, Azure)',
//         'Excellent problem-solving skills'
//       ]
//     },
//     {
//       id: 2,
//       title: 'UX/UI Designer',
//       company: 'ArifPay',
//       logo: 'https://placehold.co/80x80/4e8b8b/ffffff?text=AP',
//       location: 'Addis Ababa, Ethiopia',
//       type: 'Full-Time',
//       tags: ['Design', 'Fintech'],
//       salary: 900000,
//       salaryStr: 'ETB 900k/yr',
//       applied: true,
//       bookmarked: false,
//       date: '5th Jul 2025',
//       description: 'Join our design team to create beautiful and intuitive user experiences for our financial products. You will work closely with product managers and developers to bring designs to life.',
//       requirements: [
//         '3+ years of UX/UI design experience',
//         'Portfolio demonstrating strong design skills',
//         'Proficiency in Figma, Sketch, or Adobe XD',
//         'Understanding of user-centered design principles',
//         'Experience with user research and testing'
//       ]
//     },
//     {
//       id: 3,
//       title: 'Digital Marketing Specialist',
//       company: 'Safaricom Ethiopia',
//       logo: 'https://placehold.co/80x80/ff6b6b/ffffff?text=SE',
//       location: 'Addis Ababa, Ethiopia',
//       type: 'Contract',
//       tags: ['Marketing', 'Telecom'],
//       salary: 800000,
//       salaryStr: 'ETB 800k/yr',
//       applied: false,
//       bookmarked: false,
//       date: '5th Jul 2025',
//       description: 'We are seeking a Digital Marketing Specialist to develop and implement our digital marketing strategy across various channels including social media, email, and search engines.',
//       requirements: [
//         'Degree in Marketing or related field',
//         '2+ years of digital marketing experience',
//         'Experience with Google Ads and social media advertising',
//         'Strong analytical skills',
//         'Excellent written and verbal communication skills'
//       ]
//     },
//     {
//       id: 4,
//       title: 'Sales Manager',
//       company: 'Ethio Telecom',
//       logo: 'https://placehold.co/80x80/7e3b8a/ffffff?text=ET',
//       location: 'Addis Ababa, Ethiopia',
//       type: 'Full-Time',
//       tags: ['Sales', 'Telecom'],
//       salary: 1500000,
//       salaryStr: 'ETB 1.5M/yr',
//       applied: true,
//       bookmarked: false,
//       date: '5th Jul 2025',
//       description: 'Lead our sales team to achieve revenue targets and expand our customer base. You will develop sales strategies, manage key accounts, and build relationships with enterprise clients.',
//       requirements: [
//         '5+ years of sales experience in telecom or related industry',
//         'Proven track record of meeting sales targets',
//         'Strong leadership and team management skills',
//         'Excellent negotiation and communication skills',
//         'Bachelor\'s degree in Business or related field'
//       ]
//     },
//     {
//       id: 5,
//       title: 'Data Scientist',
//       company: 'iCog Labs',
//       logo: 'https://placehold.co/80x80/f4a261/ffffff?text=IC',
//       location: 'Addis Ababa, Ethiopia',
//       type: 'Full-Time',
//       tags: ['AI', 'Research'],
//       salary: 1800000,
//       salaryStr: 'ETB 1.8M/yr',
//       applied: false,
//       bookmarked: false,
//       date: '6th Jul 2025',
//       description: 'Join our AI research team to develop cutting-edge machine learning models and analyze complex datasets. You will work on projects ranging from natural language processing to computer vision.',
//       requirements: [
//         'Master\'s or PhD in Computer Science, Statistics, or related field',
//         'Strong programming skills in Python',
//         'Experience with machine learning frameworks (TensorFlow, PyTorch)',
//         'Knowledge of statistical modeling and data analysis',
//         'Publications in relevant conferences/journals is a plus'
//       ]
//     },
//     {
//       id: 6,
//       title: 'Graphic Designer',
//       company: 'Qene Technologies',
//       logo: 'https://placehold.co/80x80/2a9d8f/ffffff?text=QT',
//       location: 'Addis Ababa, Ethiopia',
//       type: 'Part-Time',
//       tags: ['Design', 'Creative'],
//       salary: 600000,
//       salaryStr: 'ETB 600k/yr',
//       applied: false,
//       bookmarked: false,
//       date: '6th Jul 2025',
//       description: 'Create visually stunning designs for our digital products and marketing materials. You will collaborate with the marketing and product teams to produce engaging visual content.',
//       requirements: [
//         '2+ years of graphic design experience',
//         'Proficiency in Adobe Creative Suite',
//         'Strong portfolio showcasing design skills',
//         'Understanding of branding and visual identity',
//         'Ability to work on multiple projects simultaneously'
//       ]
//     }  
// ]
// export const similarJobs = [
//   {
//     id: 101,
//     title: 'Frontend Developer',
//     company: 'Hellio Digital',
//     location: 'Addis Ababa, Ethiopia',
//     salaryStr: 'ETB 1M/yr',
//     tags: ['IT & Software'],
//     description: 'Develop responsive and interactive user interfaces using modern JavaScript frameworks.',
//     requirements: [
//       '3+ years of frontend development experience',
//       'Proficiency in React or Angular',
//       'Strong CSS/HTML skills',
//       'Experience with REST APIs',
//       'Knowledge of UI/UX principles'
//     ]
//   },
//   {
//     id: 102,
//     title: 'Backend Developer',
//     company: 'Zayride',
//     location: 'Addis Ababa, Ethiopia',
//     salaryStr: 'ETB 1.1M/yr',
//     tags: ['IT & Software'],
//     description: 'Build and maintain scalable backend services for our ride-sharing platform.',
//     requirements: [
//       '4+ years of backend development experience',
//       'Strong knowledge of Node.js or Python',
//       'Experience with database design',
//       'Understanding of microservices architecture',
//       'Familiarity with cloud platforms'
//     ]
//   }
// ];

