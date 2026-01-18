import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, Lightbulb, HelpCircle, Play } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'profile' | 'setup' | 'features' | 'best-practices';
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
}

interface BestPractice {
  id: string;
  title: string;
  description: string;
  tips: string[];
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: '1',
    title: 'Complete Venue Profile',
    description: 'Add venue name, location, capacity, and amenities',
    completed: true,
    category: 'profile',
  },
  {
    id: '2',
    title: 'Set Booking Preferences',
    description: 'Configure auto-accept, payment terms, and notification settings',
    completed: true,
    category: 'profile',
  },
  {
    id: '3',
    title: 'Add Team Members',
    description: 'Invite coordinators and promoters to your team',
    completed: false,
    category: 'setup',
  },
  {
    id: '4',
    title: 'Browse Available Artists',
    description: 'Explore and favorite artists that match your venue',
    completed: false,
    category: 'setup',
  },
  {
    id: '5',
    title: 'Create Your First Event',
    description: 'Set up an event and start booking artists',
    completed: false,
    category: 'features',
  },
  {
    id: '6',
    title: 'Explore Analytics Dashboard',
    description: 'Learn how to track bookings and revenue metrics',
    completed: false,
    category: 'features',
  },
  {
    id: '7',
    title: 'Set Up Payment Methods',
    description: 'Configure your preferred payment and billing options',
    completed: false,
    category: 'setup',
  },
  {
    id: '8',
    title: 'Optimize Your Venue Profile',
    description: 'Add high-quality photos and detailed descriptions',
    completed: false,
    category: 'best-practices',
  },
];

const TUTORIALS: Tutorial[] = [
  {
    id: '1',
    title: 'Getting Started with Ologywood',
    description: 'Learn the basics of the platform and how to navigate',
    duration: '5 min',
    icon: '🎬',
  },
  {
    id: '2',
    title: 'Finding and Booking Artists',
    description: 'Discover how to search, filter, and book artists',
    duration: '8 min',
    icon: '🎤',
  },
  {
    id: '3',
    title: 'Managing Your Team',
    description: 'Set up team members and manage permissions',
    duration: '6 min',
    icon: '👥',
  },
  {
    id: '4',
    title: 'Understanding Analytics',
    description: 'Track your bookings, revenue, and performance metrics',
    duration: '7 min',
    icon: '📊',
  },
  {
    id: '5',
    title: 'Payment and Billing',
    description: 'Learn about invoicing and payment processing',
    duration: '5 min',
    icon: '💳',
  },
];

const BEST_PRACTICES: BestPractice[] = [
  {
    id: '1',
    title: 'Optimize Your Venue Profile',
    description: 'Make your venue stand out to artists',
    tips: [
      'Use high-quality photos of your venue',
      'Write a detailed description of your space',
      'List all amenities and equipment available',
      'Update your capacity and booking rates',
    ],
  },
  {
    id: '2',
    title: 'Effective Artist Booking',
    description: 'Get the best artists for your events',
    tips: [
      'Use filters to find artists matching your genre',
      'Favorite artists you like to get availability alerts',
      'Respond quickly to booking requests',
      'Build relationships with your favorite artists',
    ],
  },
  {
    id: '3',
    title: 'Team Management Best Practices',
    description: 'Build an effective venue team',
    tips: [
      'Assign appropriate roles and permissions',
      'Keep team members updated on bookings',
      'Use activity logs to track team actions',
      'Provide regular training on platform features',
    ],
  },
  {
    id: '4',
    title: 'Financial Management',
    description: 'Manage your venue finances effectively',
    tips: [
      'Set clear payment terms with artists',
      'Monitor your revenue and expenses',
      'Use analytics to identify trends',
      'Plan budgets based on historical data',
    ],
  },
];

const SUPPORT_RESOURCES = [
  {
    title: 'Help Center',
    description: 'Browse articles and FAQs',
    icon: '📚',
    link: '/help',
  },
  {
    title: 'Contact Support',
    description: 'Get help from our support team',
    icon: '💬',
    link: '/support/create',
  },
  {
    title: 'Community Forum',
    description: 'Connect with other venue managers',
    icon: '👫',
    link: '#',
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step guides',
    icon: '🎥',
    link: '#',
  },
];

export default function VenueOnboardingChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST_ITEMS);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('profile');
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null);

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getCompletionPercentage = () => {
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const getItemsByCategory = (category: string) => {
    return checklist.filter(item => item.category === category);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Venue Onboarding</h1>
          <p className="text-gray-600">Complete your setup and get the most out of Ologywood</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
            <span className="text-3xl font-bold text-green-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {checklist.filter(i => i.completed).length} of {checklist.length} tasks completed
          </p>
        </div>

        {/* Checklist Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-4">
            {['profile', 'setup', 'features', 'best-practices'].map((category) => (
              <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {category === 'best-practices' ? 'Best Practices' : category.replace('-', ' ')}
                  </h3>
                  {expandedCategory === category ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedCategory === category && (
                  <div className="px-6 py-4 border-t border-gray-200 space-y-3">
                    {getItemsByCategory(category).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => toggleChecklistItem(item.id)}
                      >
                        {item.completed ? (
                          <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle size={24} className="text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Complete</span>
                  <span className="font-semibold text-green-600">
                    {getItemsByCategory('profile').filter(i => i.completed).length}/{getItemsByCategory('profile').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Setup Tasks</span>
                  <span className="font-semibold text-green-600">
                    {getItemsByCategory('setup').filter(i => i.completed).length}/{getItemsByCategory('setup').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Features Explored</span>
                  <span className="font-semibold text-green-600">
                    {getItemsByCategory('features').filter(i => i.completed).length}/{getItemsByCategory('features').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-sm text-green-800">
                <strong>💡 Tip:</strong> Complete all tasks to unlock advanced features and get personalized recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Tutorials Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen size={24} className="text-blue-600" />
            Feature Tutorials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TUTORIALS.map((tutorial) => (
              <div
                key={tutorial.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{tutorial.icon}</span>
                  <Play size={20} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{tutorial.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                <p className="text-xs text-gray-500">⏱️ {tutorial.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lightbulb size={24} className="text-yellow-600" />
            Best Practices Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BEST_PRACTICES.map((practice) => (
              <div key={practice.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{practice.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{practice.description}</p>
                <ul className="space-y-2">
                  {practice.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Support Resources */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle size={24} className="text-purple-600" />
            Support Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPORT_RESOURCES.map((resource, idx) => (
              <a
                key={idx}
                href={resource.link}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-purple-300 transition text-center"
              >
                <div className="text-4xl mb-3">{resource.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
