import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const carouselRef = useRef();

  const reviews = [
    { name: "Linda M.", text: "Fantastic organization! My sales doubled thanks to this event.", rating: 5 },
    { name: "James K.", text: "Smooth vendor process, timely updates, and great crowds.", rating: 4 },
    { name: "Njeri W.", text: "Loved the vibe! The setup was professional and clean.", rating: 5 },
    { name: "Ali M.", text: "More signage would help, but overall a great experience.", rating: 3 },
    { name: "Sasha T.", text: "Definitely signing up again. Easy payments, great turnout!", rating: 5 },
  ];

  const handleNavigate = () => {
    navigate("/events");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        if (scrollLeft >= maxScrollLeft) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900">
      <div className="relative z-10 px-4 py-12 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          Discover, Connect, Celebrate
        </h1>

        <div className="flex justify-center mb-6">
          <img
            src="/banner3.png.jpg"
            alt="Event banner"
            className="w-full max-w-2xl rounded-xl shadow-md object-cover"
          />
        </div>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Join thousands of attendees in exploring upcoming concerts, markets,
          exhibitions, and more. Don’t miss the chance to connect with your community.
        </p>

        <button
          onClick={handleNavigate}
          className="inline-flex flex-wrap items-center justify-center text-sm sm:text-base px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold shadow-lg"
        >
          <span className="bg-white text-blue-600 font-bold text-xs px-3 py-1 rounded-full mr-2 mb-1 sm:mb-0">
            New
          </span>
          Explore Trending Events
        </button>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              🎟️ Easy Booking
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Secure your spot at events with a few clicks. No lines. No hassle.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              ✅ Verified Events
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              All events are curated and verified for safety and authenticity.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              🛍️ Vendor Opportunities
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Apply as a vendor and showcase your business at top local events.
            </p>
          </div>
        </div>

        {/* Upcoming Events Preview */}
        <div className="mt-20">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Visit the Events page for full listings.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { title: "Night Market", date: "Jul 15 · Nairobi" },
              { title: "Open Mic Fest", date: "Jul 20 · Kisumu" },
              { title: "Art Expo 2025", date: "Aug 3 · Mombasa" },
            ].map((event, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-4 rounded-md shadow w-full max-w-xs text-left"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section
        <div className="mt-20 bg-white dark:bg-gray-900 py-8 rounded-lg shadow-inner">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            What Our Vendors Say
          </h2>

          <div className="overflow-x-auto px-4">
            <div
              ref={carouselRef}
              className="flex gap-4 w-max mx-auto scroll-smooth"
            >
              {reviews.map((review, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="min-w-[250px] max-w-sm bg-blue-50 dark:bg-gray-800 p-4 rounded-xl shadow-md flex-shrink-0"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
                    "{review.text}"
                  </p>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span>— {review.name}</span>
                    <span>{"⭐".repeat(review.rating)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div> */}
        
      </div>
    </div>
  );
}

export default Home;
