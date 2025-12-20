

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { axiosPublic } from "../api/axiosSecure";
import ClubCard from "../components/clubs/ClubCard";
import EventCard from "../components/events/EventCard";
import SectionTitle from "../components/common/SectionTitle";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FiUsers, FiCalendar, FiAward, FiTrendingUp } from "react-icons/fi";

const Home = () => {
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["featuredClubs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/clubs?sort=newest");
      return res.data.slice(0, 6);
    },
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const res = await axiosPublic.get("/events?upcoming=true&sort=date-asc");
      return res.data.slice(0, 4);
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const steps = [
    {
      icon: FiUsers,
      title: "Find Your Club",
      description:
        "Browse through various clubs in your area based on your interests and hobbies.",
    },
    {
      icon: FiAward,
      title: "Join & Connect",
      description:
        "Become a member, connect with like-minded people, and be part of the community.",
    },
    {
      icon: FiCalendar,
      title: "Attend Events",
      description:
        "Participate in exciting events, workshops, and activities organized by clubs.",
    },
    {
      icon: FiTrendingUp,
      title: "Grow Together",
      description:
        "Share experiences, learn new skills, and grow personally and professionally.",
    },
  ];

  const categories = [
    { name: "Photography", count: 12, color: "bg-blue-500" },
    { name: "Sports", count: 18, color: "bg-green-500" },
    { name: "Technology", count: 15, color: "bg-purple-500" },
    { name: "Arts & Crafts", count: 9, color: "bg-pink-500" },
    { name: "Music", count: 11, color: "bg-yellow-500" },
    { name: "Outdoors", count: 14, color: "bg-teal-500" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 section-padding"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-[#38909D]">
                Connect, Engage, and{" "}
                <span className="text-[#F6851F]">Grow Together</span>
              </h1>
              <p className="text-lg text-base-content/70 mb-8 text-pretty">
                Discover local clubs that match your interests. Join
                communities, attend exciting events, and build meaningful
                connections with people who share your passion.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/clubs" className="btn bg-[#38909D] btn-lg">
                  Join a Club
                </Link>
                <Link to="/register" className="btn  btn-lg hover:bg-[#F6851F]">
                  Create a Club
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img
                src="https://i.ibb.co.com/dX3JDv6/top-banner2.png"
                alt="Community gathering"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Clubs */}
      <section className="section-padding max-w-7xl mx-auto">
        <SectionTitle
          title="Featured"
          span="Clubs"
          subtitle="Explore some of the most popular clubs in your area"
        />
        {clubsLoading ? (
          <LoadingSpinner size="md" />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {clubs.map((club) => (
              <motion.div key={club._id} variants={itemVariants}>
                <ClubCard club={club} />
              </motion.div>
            ))}
          </motion.div>
        )}
        <div className="text-center mt-8">
          <Link
            to="/clubs"
            className="btn bg-[#38909D] text-white hover:bg-[#F6851F]"
          >
            View All Clubs
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-base-200">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="How ClubSphere"
            span=" Works"
            subtitle="Get started in just a few simple steps"
          />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card bg-base-100 shadow-md"
              >
                <div className="card-body items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="text-[#38909D]" size={28} />
                  </div>
                  <h3 className="card-title text-lg">{step.title}</h3>
                  <p className="text-sm text-base-content/70">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding max-w-7xl mx-auto">
        <SectionTitle
          title="Upcoming "
          span="Events"
          subtitle="Don't miss out on these exciting community events"
        />
        {eventsLoading ? (
          <LoadingSpinner size="md" />
        ) : events.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {events.map((event) => (
              <motion.div key={event._id} variants={itemVariants}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-base-content/60">
            No upcoming events at the moment. Check back soon!
          </p>
        )}
        <div className="text-center mt-8">
          <Link
            to="/events"
            className="btn bg-[#38909D] text-white hover:bg-[#F6851F]"
          >
            View All Events
          </Link>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section-padding bg-base-200">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Popular "
            span="Categories"
            subtitle="Find clubs that match your interests"
          />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((category, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link
                  to={`/clubs?category=${category.name}`}
                  className="card bg-base-100 shadow-md card-hover"
                >
                  <div className="card-body items-center text-center py-6 text-[#38909D]">
                    <div
                      className={`w-12 h-12 rounded-full ${category.color} opacity-20 absolute`}
                    ></div>
                    <h4 className="font-semibold">{category.name}</h4>
                    <span className="text-sm text-base-content/60">
                      {category.count} clubs
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-padding bg-[#38909D] text-primary-content"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Club Journey?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of members who have found their community on
            ClubSphere
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="btn bg-[#F6851F] text-white btn-lg hover:text-black"
            >
              Get Started Free
            </Link>
            <Link
              to="/clubs"
              className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-[#38909D]"
            >
              Browse Clubs
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
