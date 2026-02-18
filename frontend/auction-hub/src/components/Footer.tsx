export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-500">About Us</a>
            <a href="#" className="hover:text-blue-500">Terms of Service</a>
            <a href="#" className="hover:text-blue-500">Privacy Policy</a>
          </div>
          <div>
            © 2024 AuctionHub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}