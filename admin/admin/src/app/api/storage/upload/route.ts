// file: admin/admin/src/app/api/storage/upload/route.ts

import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  // This setup is simpler and more robust with the new library
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This is the correct response when the user is not authenticated
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Create a more organized file path using the user's ID
  const filePath = `${user.id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('templates') // Ensure this is the correct bucket name
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }

  // Get the public URL for the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from('templates').getPublicUrl(filePath);

  return NextResponse.json({ url: publicUrl });
}