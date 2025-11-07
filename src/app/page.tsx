export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A2131] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-lg mb-8">Protect your personal data and privacy</p>
        <div className="space-x-4">
          <a href="/login" className="bg-[#007ED6] px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            Login
          </a>
          <a href="/register" className="border border-[#007ED6] px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}