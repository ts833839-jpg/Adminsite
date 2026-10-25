import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from environment variables or verified credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'zsjpdh9i',
  api_key: process.env.CLOUDINARY_API_KEY || '615289681921531',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'QKPzHR5lpx18l0D_3sHtWPUlPE0',
  secure: true,
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename for public ID
    const rawName = file.name || 'creation-media';
    const cleanBasename = rawName
      .toLowerCase()
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9_-]/g, '-');
    const uniqueId = `${cleanBasename}-${Date.now().toString().slice(-4)}`;

    // Convert to base64 Data URI for direct Cloudinary upload
    const mimeType = file.type || 'image/jpeg';
    const base64Uri = `data:${mimeType};base64,${buffer.toString('base64')}`;

    const isVideo = mimeType.startsWith('video/') || !!file.name?.match(/\.(mp4|mov|webm|quicktime)$/i);

    const uploadRes = await cloudinary.uploader.upload(base64Uri, {
      folder: 'knot-and-bloom/products',
      public_id: uniqueId,
      resource_type: isVideo ? 'video' : 'auto',
      overwrite: true,
    });

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'zsjpdh9i';

    // Build modern auto-optimized CDN URL
    let optimizedUrl = uploadRes.secure_url;
    if (uploadRes.resource_type === 'image') {
      optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/v${uploadRes.version}/${uploadRes.public_id}`;
    } else if (uploadRes.resource_type === 'video') {
      // Inject q_auto into the secure video URL
      optimizedUrl = uploadRes.secure_url.replace('/video/upload/', '/video/upload/q_auto/');
    }

    return NextResponse.json({
      success: true,
      url: optimizedUrl,
      public_id: uploadRes.public_id,
      format: uploadRes.format,
      width: uploadRes.width,
      height: uploadRes.height,
      resource_type: uploadRes.resource_type,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload media to Cloudinary' },
      { status: 500 }
    );
  }
}
