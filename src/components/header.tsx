import CartIcon from "@/components/CartIcon";

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/34c06baa-59ac-46fe-b9e2-75b5a180a80d.png"
            alt="City Beach Australia"
            className="h-10 md:h-12"
          />
        </div>
        <div className="flex items-center space-x-4">
          <CartIcon />
          <span className="text-sm text-gray-500">Welcome, Raj</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
