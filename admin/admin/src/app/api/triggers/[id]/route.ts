'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        storage: {
          getItem: async (key: string) => {
            const value = (await cookieStore).get(key)?.value;
            return value ?? null;
          },
          setItem: async (key: string, value: string) => {
            (await cookieStore).set(key, value);
          },
          removeItem: async (key: string) => {
            (await cookieStore).delete(key);
          },
        },
      },
    }
  );
}

export async function DELETE(request: NextRequest) {
  const supabase = await getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.pathname.split('/').filter(Boolean).pop();

  if (!id) {
    return NextResponse.json({ error: 'Missing trigger ID' }, { status: 400 });
  }

  const { error } = await supabase.from('triggers').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Trigger deleted successfully' });
}