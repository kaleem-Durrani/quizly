import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Collapse,
  Avatar,
  Divider,
  BackTop,
} from "antd";
import { Link } from "react-router-dom";
import {
  ArrowDownOutlined,
  RocketOutlined,
  TeamOutlined,
  TrophyOutlined,
  BookOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { ROUTES } from "../../constants/routes";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

/**
 * Home page component
 * Landing page for the application
 */
const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Fixed Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Quizly</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              FAQ
            </button>
          </div>
          <div className="flex space-x-3">
            <Button type="primary">
              <Link to={ROUTES.LOGIN}>Login</Link>
            </Button>
            <Button>
              <Link to={ROUTES.REGISTER}>Register</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <Title className="text-4xl md:text-5xl !leading-tight">
                Revolutionize Learning with Interactive Quizzes
              </Title>
              <Paragraph className="text-lg text-gray-600 mt-6 mb-8">
                Quizly is a powerful platform that helps teachers create
                engaging quizzes, manage classes, and track student progress all
                in one place.
              </Paragraph>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button type="primary" size="large" className="px-8">
                  <Link to={ROUTES.REGISTER}>Get Started</Link>
                </Button>
                <Button
                  size="large"
                  onClick={() => scrollToSection("how-it-works")}
                  className="flex items-center justify-center"
                >
                  Learn More <ArrowDownOutlined className="ml-2" />
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75"></div>
                <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                    alt="Students taking quiz"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Title level={2} className="text-3xl md:text-4xl">
              Powerful Features for Everyone
            </Title>
            <Paragraph className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Quizly provides a comprehensive set of tools for teachers,
              students, and administrators.
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card
              className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm"
              hoverable
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                  <RocketOutlined style={{ fontSize: 28 }} />
                </div>
                <Title level={4}>Interactive Quizzes</Title>
                <Paragraph className="text-gray-600">
                  Create engaging quizzes with multiple question types, time
                  limits, and instant feedback.
                </Paragraph>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card
              className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm"
              hoverable
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                  <TeamOutlined style={{ fontSize: 28 }} />
                </div>
                <Title level={4}>Class Management</Title>
                <Paragraph className="text-gray-600">
                  Organize students into classes, share quizzes, and track
                  progress all in one place.
                </Paragraph>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card
              className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm"
              hoverable
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                  <TrophyOutlined style={{ fontSize: 28 }} />
                </div>
                <Title level={4}>Detailed Analytics</Title>
                <Paragraph className="text-gray-600">
                  Get comprehensive insights into student performance with
                  detailed reports and analytics.
                </Paragraph>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Title level={2} className="text-3xl md:text-4xl">
              How Quizly Works
            </Title>
            <Paragraph className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Our platform is designed to be intuitive and easy to use for all
              users.
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Teachers */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <BookOutlined style={{ fontSize: 24 }} />
                </div>
                <Title level={3} className="m-0">
                  For Teachers
                </Title>
              </div>
              <ol className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    1
                  </div>
                  <div>
                    <Text strong>Create classes</Text>
                    <Paragraph className="text-gray-600 mt-1">
                      Set up classes and invite students using a unique join
                      code.
                    </Paragraph>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    2
                  </div>
                  <div>
                    <Text strong>Design quizzes</Text>
                    <Paragraph className="text-gray-600 mt-1">
                      Create quizzes with various question types and customize
                      settings.
                    </Paragraph>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    3
                  </div>
                  <div>
                    <Text strong>Analyze results</Text>
                    <Paragraph className="text-gray-600 mt-1">
                      Review detailed analytics and track student progress over
                      time.
                    </Paragraph>
                  </div>
                </li>
              </ol>
            </div>

            {/* For Students */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                  <TeamOutlined style={{ fontSize: 24 }} />
                </div>
                <Title level={3} className="m-0">
                  For Students
                </Title>
              </div>
              <ol className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    1
                  </div>
                  <div>
                    <Text strong>Join classes</Text>
                    <Paragraph className="text-gray-600 mt-1">
                      Enter the join code provided by your teacher to access the
                      class.
                    </Paragraph>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    2
                  </div>
                  <div>
                    <Text strong>Take quizzes</Text>
                    <Paragraph className="text-gray-600 mt-1">
                      Complete assigned quizzes within the specified time
                      limits.
                    </Paragraph>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                    3
                  </div>
                  <div>
                    <Text strong>Review results</Text>
                    <Paragraph className="text-gray-600 mt-1">
                      See your scores and review correct answers to improve your
                      knowledge.
                    </Paragraph>
                  </div>
                </li>
              </ol>
            </div>

            {/* For Admins */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                  <RocketOutlined style={{ fontSize: 24 }} />
                </div>
                <Title level={3} className="m-0">
                  For Admins
                </Title>
              </div>
              <ol className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                    1
                  </div>
                  <div>
                    <Text strong>Manage users</Text>
                    <Paragraph className="text-gray-600 mt-1">
                      Create teacher accounts and oversee all users in the
                      system.
                    </Paragraph>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                    2
                  </div>
                  <div>
                    <Text strong>Create subjects</Text>
                    <Paragraph className="text-gray-600 mt-1">
                      Set up subject categories to organize quizzes and classes.
                    </Paragraph>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                    3
                  </div>
                  <div>
                    <Text strong>Monitor activity</Text>
                    <Paragraph className="text-gray-600 mt-1">
                      Track platform usage and ensure everything runs smoothly.
                    </Paragraph>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 bg-gradient-to-b from-blue-50 to-indigo-100"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Title level={2} className="text-3xl md:text-4xl">
              What Our Users Say
            </Title>
            <Paragraph className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Hear from teachers and students who use Quizly every day.
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <Avatar
                  size={64}
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  className="mb-4"
                />
                <div className="text-center">
                  <Text className="text-lg italic">
                    "Quizly has transformed how I assess my students. The
                    detailed analytics help me identify areas where students
                    need more support."
                  </Text>
                  <div className="mt-4">
                    <Text strong>Sarah Johnson</Text>
                    <br />
                    <Text type="secondary">High School Teacher</Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <Avatar
                  size={64}
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  className="mb-4"
                />
                <div className="text-center">
                  <Text className="text-lg italic">
                    "As a student, I love how Quizly makes studying more
                    interactive. The immediate feedback helps me understand my
                    mistakes."
                  </Text>
                  <div className="mt-4">
                    <Text strong>Michael Chen</Text>
                    <br />
                    <Text type="secondary">University Student</Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <Avatar
                  size={64}
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  className="mb-4"
                />
                <div className="text-center">
                  <Text className="text-lg italic">
                    "Managing multiple classes is so much easier with Quizly. I
                    can create quizzes once and share them across different
                    classes."
                  </Text>
                  <div className="mt-4">
                    <Text strong>Emily Rodriguez</Text>
                    <br />
                    <Text type="secondary">Middle School Teacher</Text>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Title level={2} className="text-3xl md:text-4xl">
              Frequently Asked Questions
            </Title>
            <Paragraph className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Find answers to common questions about Quizly.
            </Paragraph>
          </div>

          <Collapse
            bordered={false}
            expandIconPosition="end"
            className="bg-transparent"
          >
            <Panel
              header={
                <span className="text-lg font-medium">
                  How do I create a quiz?
                </span>
              }
              key="1"
              className="bg-white/70 backdrop-blur-sm mb-4 rounded-lg overflow-hidden"
            >
              <Paragraph>
                Teachers can create quizzes by logging in, navigating to the
                Quizzes section, and clicking "Create Quiz." You can add
                multiple types of questions, set time limits, and customize
                other settings before publishing.
              </Paragraph>
            </Panel>
            <Panel
              header={
                <span className="text-lg font-medium">
                  How do students join a class?
                </span>
              }
              key="2"
              className="bg-white/70 backdrop-blur-sm mb-4 rounded-lg overflow-hidden"
            >
              <Paragraph>
                Students can join a class by registering for an account, logging
                in, and entering the unique join code provided by their teacher.
                This code can be found in the teacher's class management
                dashboard.
              </Paragraph>
            </Panel>
            <Panel
              header={
                <span className="text-lg font-medium">
                  Can I use Quizly for remote learning?
                </span>
              }
              key="3"
              className="bg-white/70 backdrop-blur-sm mb-4 rounded-lg overflow-hidden"
            >
              <Paragraph>
                Yes! Quizly is perfect for both in-person and remote learning
                environments. Students can access quizzes from anywhere with an
                internet connection, and teachers can monitor progress remotely.
              </Paragraph>
            </Panel>
            <Panel
              header={
                <span className="text-lg font-medium">
                  Is Quizly free to use?
                </span>
              }
              key="4"
              className="bg-white/70 backdrop-blur-sm mb-4 rounded-lg overflow-hidden"
            >
              <Paragraph>
                Quizly offers a free tier with essential features for teachers
                and students. Premium features are available for schools and
                institutions that require advanced functionality.
              </Paragraph>
            </Panel>
            <Panel
              header={
                <span className="text-lg font-medium">
                  How secure is student data on Quizly?
                </span>
              }
              key="5"
              className="bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden"
            >
              <Paragraph>
                We take data security very seriously. All data is encrypted, and
                we comply with educational privacy standards. We never share
                student information with third parties without consent.
              </Paragraph>
            </Panel>
          </Collapse>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Title level={2} className="text-3xl md:text-4xl text-white">
            Ready to Transform Your Teaching Experience?
          </Title>
          <Paragraph className="text-lg text-white/90 mt-4 mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students who are already using
            Quizly to enhance learning.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            className="bg-white text-blue-600 hover:bg-gray-100 border-white px-8 h-12"
          >
            <Link to={ROUTES.REGISTER}>Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">Quizly</div>
              <Paragraph className="text-gray-400">
                The ultimate platform for interactive learning and assessment.
              </Paragraph>
            </div>
            <div>
              <Title level={5} className="text-white mb-4">
                Quick Links
              </Title>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-gray-400 hover:text-white"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="text-gray-400 hover:text-white"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("testimonials")}
                    className="text-gray-400 hover:text-white"
                  >
                    Testimonials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="text-gray-400 hover:text-white"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <Title level={5} className="text-white mb-4">
                Resources
              </Title>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <Title level={5} className="text-white mb-4">
                Legal
              </Title>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Divider className="border-gray-800 my-8" />
          <div className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Quizly. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <BackTop>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700">
          <ArrowUpOutlined />
        </div>
      </BackTop>
    </div>
  );
};

export default Home;
