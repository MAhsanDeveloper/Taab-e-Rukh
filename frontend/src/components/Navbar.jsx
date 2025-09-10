import { ShoppingCart, User, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import logo from "../assets/logo.webp";

const Navbar = () => {
  const { user } = useUserStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

const categories = [
  { name: "Hair Care", path: "/category/hair-care" },
  { name: "Skin Care", path: "/category/skin-care" },
  { name: "Face & Glow", path: "/category/face-glow" },
  { name: "Body & Baby", path: "/category/body-baby" },
];

  // Search functionality
  const handleSearch = () => {
    navigate("/search");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-40 ">
      <div className="container mx-auto px-3 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Taab e Rukh" className="h-11 w-auto" />
        </Link>

        {/* Center Categories */}
        <nav className="hidden md:flex gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="px-3 py-2 text-black font-medium transition-all duration-300 border rounded-2xl border-transparent 
                         hover:bg-black hover:text-white hover:border-black"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

    {/* Right Side */}
<div className="flex items-center gap-4">
  {/* Search */}
  <button
    onClick={handleSearch}
    className="p-2 rounded-md border border-transparent text-black cursor-pointer shake-hover"
  >
    <Search size={20} className="text-black" />
  </button>

  {/* User */}
  <Link
    to={user ? "/profile" : "/login"}
    className="p-2 rounded-md border border-transparent cursor-pointer text-black shake-hover"
  >
    <User size={20} className="text-black" />
  </Link>

  {/* Cart */}
  <Link
    to="/cart"
    className="relative flex items-center px-3 py-2 rounded-md cursor-pointer text-black transition-all duration-300 border border-transparent shake-hover"
  >
    <ShoppingCart size={20} className="mr-1" />
    <span className="hidden sm:inline">Cart</span>
    {cart.length > 0 && (
      <span className="absolute -top-2 -left-2 bg-white text-black rounded-full px-2 py-0.5 text-xs">
        {cart.length}
      </span>
    )}
  </Link>
</div>


      </div>
    </header>
  );
};

export default Navbar;
