"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  Activity,
  Eye,
  EyeOff,
  RefreshCw,
  Wifi,
  WifiOff,
  Gauge,
  Target,
  Calendar,
  Trash2,
} from "lucide-react";

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number;
  timestamp: number;
}

export default function DashboardPage() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [history, setHistory] = useState<LocationData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("-");
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/location");
      const data = await res.json();

      if (data.latest) {
        setLocation(data.latest);
        setLastUpdate(new Date(data.latest.timestamp).toLocaleTimeString());
      }

      if (data.history) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Gagal fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (history.length === 0) return;

    if (window.confirm("Yakin ingin menghapus semua riwayat lokasi?")) {
      setIsClearing(true);
      try {
        const res = await fetch("/api/location", {
          method: "DELETE",
        });

        if (res.ok) {
          setHistory([]);
          // Optional: refresh data setelah clear
          await fetchData();
        } else {
          alert("Gagal menghapus riwayat");
        }
      } catch (error) {
        console.error("Error clearing history:", error);
        alert("Terjadi kesalahan saat menghapus riwayat");
      } finally {
        setIsClearing(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}&z=15`;
  };

  const getStaticMapUrl = (lat: number, lng: number) => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Tracking Dashboard
                </h1>
                <p className="text-xs text-gray-500">Real-time monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${location ? "bg-green-500" : "bg-gray-400"}`}
                />
                <span className="text-sm font-medium text-gray-700">
                  {location ? "Online" : "Offline"}
                </span>
              </div>
              <button
                onClick={fetchData}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:rotate-180"
              >
                <RefreshCw
                  className={`w-4 h-4 text-gray-600 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Status</p>
                <p
                  className={`text-sm font-bold mt-1 ${location ? "text-green-600" : "text-gray-400"}`}
                >
                  {location ? "🟢 Aktif" : "⚪ Tidak Aktif"}
                </p>
              </div>
              <div
                className={`p-2 rounded-xl ${location ? "bg-green-50" : "bg-gray-50"}`}
              >
                {location ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Kecepatan</p>
                <p className="text-sm font-bold mt-1 text-blue-600">
                  {location ? `${location.speed} km/jam` : "--"}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-blue-50">
                <Gauge className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Akurasi</p>
                <p className="text-sm font-bold mt-1 text-purple-600">
                  {location ? `${location.accuracy} m` : "--"}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-purple-50">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Data Terkumpul
                </p>
                <p className="text-sm font-bold mt-1 text-indigo-600">
                  {history.length} titik
                </p>
              </div>
              <div className="p-2 rounded-xl bg-indigo-50">
                <Activity className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 font-medium">Memuat data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Lokasi Real-time
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Update: {lastUpdate}</span>
                </div>
              </div>
              <div className="relative" style={{ paddingBottom: "56.25%" }}>
                {location && !mapError ? (
                  <iframe
                    src={getStaticMapUrl(location.lat, location.lng)}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    onError={() => setMapError(true)}
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <MapPin className="w-16 h-16 text-gray-300 mb-3" />
                    <p className="text-gray-400 font-medium">
                      {mapError ? "Gagal memuat peta" : "Belum ada data lokasi"}
                    </p>
                    {location && (
                      <a
                        href={getGoogleMapsUrl(location.lat, location.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        Buka di Google Maps
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                Detail Lokasi
              </h3>

              {location ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Latitude
                        </p>
                        <p className="text-sm font-mono font-bold text-gray-800 mt-1">
                          {location.lat.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Longitude
                        </p>
                        <p className="text-sm font-mono font-bold text-gray-800 mt-1">
                          {location.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 font-medium">
                        Akurasi
                      </p>
                      <p className="text-sm font-bold text-gray-800 mt-1">
                        {location.accuracy} meter
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 font-medium">
                        Kecepatan
                      </p>
                      <p className="text-sm font-bold text-gray-800 mt-1">
                        {location.speed} km/jam
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 font-medium">
                      Waktu Update
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(location.timestamp)}
                      </p>
                      <Clock className="w-3 h-3 text-gray-400 ml-2" />
                      <p className="text-sm font-medium text-gray-800">
                        {formatTime(location.timestamp)}
                      </p>
                    </div>
                  </div>

                  <a
                    href={getGoogleMapsUrl(location.lat, location.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center font-medium py-3 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    🗺️ Buka di Google Maps
                  </a>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <EyeOff className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">Belum ada data</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Tunggu user mengirim lokasi
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">
                  Riwayat Lokasi
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {history.length} data
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearHistory}
                  disabled={isClearing}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClearing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3 h-3" />
                      Hapus Semua
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                >
                  {showHistory ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
            </div>

            {showHistory && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        #
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Latitude
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Longitude
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Kecepatan
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Akurasi
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Waktu
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history
                      .slice()
                      .reverse()
                      .slice(0, 50)
                      .map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-500 font-medium">
                            {history.length - index}
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-700">
                            {item.lat.toFixed(6)}
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-700">
                            {item.lng.toFixed(6)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-blue-600 font-medium">
                              {item.speed} km/jam
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {item.accuracy} m
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-sm">
                            {formatTime(item.timestamp)}
                          </td>
                          <td className="py-3 px-4">
                            <a
                              href={getGoogleMapsUrl(item.lat, item.lng)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Lihat
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
