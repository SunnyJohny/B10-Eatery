import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMyContext } from "../Context/MyContext";
import Cart from "./Cart"; // ✅ Call the Cart component

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // const { state, cart, toggleCart } = useMyContext();
  const { cart, toggleCart, isCartOpen } = useMyContext();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleToggleCart = () => {
    toggleCart();
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleScrollAdjust = (e, path) => {
    e.preventDefault();
    if (path === "profile") {
      setShowSignInModal(true);
      return;
    }
    const target = document.getElementById(path);
    if (target) {
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        toast.success("Signed in successfully!");
        setShowSignInModal(false);
        const target = document.getElementById("Equipment");
        if (target) {
          const offset = 100;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    } catch {
      toast.error("Bad user credentials");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.warn("Enter your email to reset password");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch {
      toast.error("Failed to send reset email");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => toast.info("Logged out"))
      .catch(() => toast.error("Logout failed"));
  };

  const navItems = [
    { link: "Home", path: "home" },
    { link: "About", path: "about" },
    { link: "Services", path: "services" },
    { link: "Testimonials", path: "testimonials" },
    { link: "Dishes", path: "dishes" },
    { link: "Profile", path: "profile" },
    { link: "Contact", path: "contact" },
  ];

  const username = currentUser?.email?.split("@")[0];

  return (
    <>
      <ToastContainer />
      <header className="fixed w-full z-50 transition-all duration-300">
        <nav className={`py-4 lg:px-24 px-4 ${isSticky ? "bg-white shadow-lg" : "bg-white"}`}>
          <div className="flex justify-between items-center text-base relative">
            {/* Logo */}
            <a href="/" className="flex flex-col items-start">
              <img src="/images/B10EateryLOGO.png" alt="Logo" className="h-8" />
              <p className="text-sm text-red-600 font-semibold italic mt-1">
                ...where your belly knows the best.
              </p>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-8 items-center">
                {navItems.map(({ link, path }) => {
                  if (path === "profile" && currentUser) {
                    return (
                      <div key="user-info" className="ml-4 flex flex-col items-start">
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          👤 {username}
                        </span>
                        <button
                          onClick={handleLogout}
                          className="text-xs text-red-500 hover:text-red-700 mt-1"
                        >
                          Logout
                        </button>
                      </div>
                    );
                  }
                  return (
                    <a
                      key={link}
                      href={`#${path}`}
                      onClick={(e) => handleScrollAdjust(e, path)}
                      className="text-base uppercase text-[#181818] hover:text-orange cursor-pointer"
                    >
                      {link}
                    </a>
                  );
                })}
              </ul>
              {/* Desktop Cart Icon */}
              <div onClick={handleToggleCart} className="relative cursor-pointer ml-4">
                <FaShoppingCart className="text-2xl text-blue-800" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Burger & Cart */}
            <div className="flex items-center md:hidden gap-3">
              <div onClick={handleToggleCart} className="relative cursor-pointer mr-1">
                <FaShoppingCart className="text-2xl text-blue-800" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
              <button
                onClick={toggleMenu}
                className="text-blue p-2 border border-gray-500 rounded-full"
              >
                {isMenuOpen ? (
                  <FaXmark className="h-6 w-6 text-primary" />
                ) : (
                  <FaBarsStaggered className="h-6 w-6 text-primary" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden fixed top-0 left-0 w-full h-screen bg-dark transition-transform transform ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } px-4`}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-600">
              <a href="/" className="flex items-center">
                <img src="/images/B10EateryLOGO.png" alt="Logo" className="h-8" />
              </a>
              <button
                onClick={toggleMenu}
                className="text-white p-2 border border-gray-500 rounded-full"
              >
                <FaXmark className="h-6 w-6 text-primary" />
              </button>
            </div>

            <ul className="flex flex-col items-center justify-center mt-12 space-y-6">
              {navItems.map(({ link, path }) => {
                if (path === "profile" && currentUser) {
                  return (
                    <span
                      key="user"
                      className="text-base uppercase text-white font-semibold flex items-center gap-1"
                    >
                      👤 {username}
                    </span>
                  );
                }
                return (
                  <a
                    key={link}
                    href={`#${path}`}
                    onClick={(e) => handleScrollAdjust(e, path)}
                    className="text-base uppercase text-white hover:text-orange cursor-pointer"
                  >
                    {link}
                  </a>
                );
              })}
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline mt-2"
                >
                  Logout
                </button>
              )}
            </ul>
          </div>
        </nav>
      </header>

      <div
  className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
    isCartOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  <Cart />
</div>


      {/* Sign-In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-md w-[90%] md:w-[400px] relative">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
            <form onSubmit={handleSignIn}>
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <AiFillEyeInvisible
                    className="absolute right-3 top-3 text-xl cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                ) : (
                  <AiFillEye
                    className="absolute right-3 top-3 text-xl cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Sign In
              </button>
              <p
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 mt-3 text-center cursor-pointer hover:underline"
              >
                Forgot Password?
              </p>
              <p
                onClick={() => setShowSignInModal(false)}
                className="text-sm text-gray-500 mt-4 text-center cursor-pointer"
              >
                Close
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
