import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          🚗 Live Tracking
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sistem pelacakan lokasi real-time
        </p>

        <div className="space-y-4">
          <Link
            href="/track"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition"
          >
            📍 Buka Tracker (Untuk User)
          </Link>
          <Link
            href="/dashboard"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition"
          >
            📊 Buka Dashboard (Untuk Admin)
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-400 text-center border-t pt-4">
          <p>🔹 User buka halaman Tracker</p>
          <p>🔹 Admin buka Dashboard untuk pantau</p>
        </div>
      </div>
    </main>
  );
}
