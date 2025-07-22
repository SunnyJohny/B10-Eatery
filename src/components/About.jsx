import React from "react";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaUtensils,
  FaCalendarAlt,
  FaConciergeBell,
  FaPizzaSlice,
  FaShoppingBasket
} from "react-icons/fa";

const servicesData = [
  {
    icon: FaTruck,
    title: "Fast Food Delivery",
    description: "Quick and reliable food delivery to your doorstep."
  },
  {
    icon: FaCalendarAlt,
    title: "Event Catering",
    description: "Catering for weddings, birthdays, and corporate events."
  },
  {
    icon: FaUtensils,
    title: "Eat-In",
    description: "Relax and enjoy freshly prepared meals in our cozy dine-in space."
  },
  {
    icon: FaPizzaSlice,
    title: "Takeaway",
    description: "Grab your favorite meals on the go—hot and ready!"
  },
  {
    icon: FaShoppingBasket,
    title: "Table Reservation",
    description: "Reserve tables at our restaurant with ease."
  }
];

const iconAnimations = [
  { animate: { x: [0, -10, 10, -10, 10, 0], transition: { repeat: Infinity, duration: 2 } } },
  { animate: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 1.5 } } },
  { animate: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 1.8 } } },
  { animate: { rotate: [0, 10, -10, 10, -10, 0], transition: { repeat: Infinity, duration: 2.5 } } },
  { animate: { opacity: [0.8, 1, 0.8], y: [0, -5, 0], transition: { repeat: Infinity, duration: 2.2 } } }
];

const AboutUs = () => {
  return (
    <section id="about" className="min-h-screen bg-white text-gray-800 py-12 px-5 md:px-20">
      {/* Title Section */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
          About B-10 Eatery
        </h2>
        <p className="text-sm text-gray-500">
          Home &gt; <span className="text-red-500  font-bold">About Us</span>
        </p>
      </div>

      {/* Main Info Section */}
      <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
        {/* Image */}
        <div>
          <img
            src="/images/img1.jpg"
            alt="About B-10 Eatery"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Description */}
        <div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong className="text-red-500">B-10 Eatery</strong> is more than just a food spot — we’re your neighborhood flavor hub! From sizzling hot take-outs to cozy dine-ins and smooth deliveries, our kitchen crafts every meal with love and taste that lingers.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Whether you’re looking for traditional Nigerian dishes or continental delights, our team is committed to giving you a mouthwatering experience with each bite. At B-10 Eatery, we don’t just serve meals — we serve moments.
          </p>
          <p className="text-lg text-red-600 font-semibold italic">
            ...where your belly knows the best.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="bg-white shadow-md rounded-lg p-6">
                <motion.div
                  className="flex justify-center mb-4"
                  animate={iconAnimations[index % iconAnimations.length].animate}
                >
                  <IconComponent size={40} className="text-red-500" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vision & Mission Section */}
      <h3 className="text-3xl font-bold text-gray-900 text-center uppercase tracking-wide mb-8">
        Our Vision & Mission
      </h3>
      <div>
        <h4 className="text-2xl font-semibold text-gray-800 mb-4">Vision</h4>
        <p className="text-lg text-gray-700 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 p-4 border-l-4 border-gray-800 rounded-lg shadow-md mb-8">
          To be the heartbeat of delicious moments, bringing people together with crave-worthy food and warm hospitality in every neighborhood we serve.
        </p>

        <h4 className="text-2xl font-semibold text-gray-800 mb-4">Mission</h4>
        <p className="text-lg text-gray-700 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 p-4 border-l-4 border-gray-800 rounded-lg shadow-md">
          To delight every guest with memorable meals, outstanding service, and a friendly atmosphere—whether you dine in, take out, or order delivery. We are committed to using quality ingredients, celebrating local flavors, and creating smiles with every plate.
        </p>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials">
        <h3 className="text-2xl font-bold text-gray-800 text-center uppercase tracking-wide m-8">
          What Our Customers Say
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              name: "Adaora I.",
              title: "Regular Customer",
              phone: "",
              image: "/images/testimonial1.jpg",
              quote:
                "B-10 Eatery is my go-to for comfort food. Their jollof rice is unbeatable and the staff always makes me feel right at home.",
            },
            {
              name: "Chinedu O.",
              title: "Food Enthusiast",
              phone: "",
              image: "/images/testimonial2.jpg",
              quote:
                "Whether I’m eating in or ordering delivery, B-10 Eatery never disappoints. The flavors are authentic and the service is top-notch!",
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover mb-4"
              />
              <p className="text-gray-700 italic mb-4">“{testimonial.quote}”</p>
              <h4 className="text-lg font-semibold text-gray-800">{testimonial.name}</h4>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
              {testimonial.phone && (
                <p className="text-sm text-gray-600">📞 {testimonial.phone}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;