import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=money&per_page=80&orientation=landscape`,
      {
        headers: {
          Authorization: process.env.NEXT_PEXELS_API_KEY!, // server-side only
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    const data = await res.json();

    const photos = data.photos || [];

    if (photos.length === 0) return NextResponse.json({ url: null });

    // Pick a random index between 0 and min(photos.length-1, 79)
    const maxIndex = Math.min(photos.length - 1, 79);
    const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
    
    const photo = data.photos[randomIndex];

    return NextResponse.json({
      url: photo?.src?.landscape || null,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}