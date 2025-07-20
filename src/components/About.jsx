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
    icon: FaConciergeBell,
    title: "Personal Chef",
    description: "Hire professional chefs for private dinners and parties."
  },
  {
    icon: FaPizzaSlice,
    title: "Custom Meal Plans",
    description: "Tailored meal plans to fit your dietary needs and preferences."
  },
  {
    icon: FaShoppingBasket,
    title: "Grocery Assistance",
    description: "Get groceries delivered with your meal orders."
  },
  {
    icon: FaUtensils,
    title: "Table Reservation",
    description: "Reserve tables at our partner restaurants with ease."
  }
];

// Define unique animations
const iconAnimations = [
  {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
    }
  },
  {
    animate: {
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
    }
  },
  {
    animate: {
      scale: [1, 1.2, 1],
      transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
    }
  },
  {
    animate: {
      rotate: [0, 10, -10, 10, -10, 0],
      transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
    }
  },
  {
    animate: {
      y: [0, 8, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
    }
  },
  {
    animate: {
      opacity: [0.8, 1, 0.8],
      y: [0, -5, 0],
      transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
    }
  }
];

const AboutUs = () => {
  return (
    <section className="min-h-screen bg-white text-gray-800 py-12 px-5 md:px-20">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>

      <p className="text-center text-lg max-w-3xl mx-auto mb-10">
        Welcome to our food service platform, where quality meets convenience. We’re passionate about serving delicious meals and delivering exceptional food experiences.
      </p>

      <div id="services" className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
        <h1 className="text-4xl font-semibold text-center pt-24 pb-10">Our Services</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 text-center space-y-4"
              >
                <motion.div
                  className="flex justify-center"
                  animate={iconAnimations[index].animate}
                >
                  <IconComponent size={40} className="text-brightColor" />
                </motion.div>
                <h2 className="text-xl font-bold">{service.title}</h2>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="max-w-2xl mx-auto">
          To bring healthy, delicious, and affordable meals to every doorstep, while supporting local chefs and food entrepreneurs.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
