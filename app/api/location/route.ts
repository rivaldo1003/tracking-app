import { NextRequest, NextResponse } from "next/server";

// Simpan data di memory (untuk demo)
// EKSPOR agar bisa diakses dari server.ts
export let latestLocation: any = null;
export let locationHistory: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validasi data
    if (!data.lat || !data.lng) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const locationData = {
      ...data,
      timestamp: Date.now(),
    };

    // Update data terbaru
    latestLocation = locationData;

    // Simpan ke history (maksimal 100 data)
    locationHistory.push(locationData);
    if (locationHistory.length > 100) {
      locationHistory.shift();
    }

    console.log(`📍 Lokasi diterima (API): ${data.lat}, ${data.lng}`);

    return NextResponse.json({
      success: true,
      data: locationData,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    latest: latestLocation,
    history: locationHistory,
    count: locationHistory.length,
  });
}

// Tambahkan method DELETE untuk clear history
export async function DELETE() {
  try {
    // Reset history dan latest location
    locationHistory = [];
    latestLocation = null;

    console.log("🗑️ Riwayat lokasi telah dihapus");

    return NextResponse.json({
      success: true,
      message: "Riwayat berhasil dihapus",
    });
  } catch (error) {
    console.error("Error clearing history:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus riwayat" },
      { status: 500 },
    );
  }
}
