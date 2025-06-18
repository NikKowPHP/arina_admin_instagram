import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@supabase/auth-helpers-nextjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const session = await getSession({ request });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = request.nextUrl.pathname.split('/').filter(Boolean).pop();
  let query = supabase.from('triggers').select('*');

  if (slug) {
    query = query.eq('id', slug);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);

export async function POST(request: NextRequest) {
  const session = await getSession({ request });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, condition, action } = body;

  if (!name || !condition || !action) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('triggers')
    .insert({ id: uuidv4(), name, condition, action })
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });

export async function PUT(request: NextRequest) {
  const session = await getSession({ request });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = request.nextUrl.pathname.split('/').filter(Boolean).pop();
  const body = await request.json();
  const { name, condition, action } = body;

  if (!slug || !name || !condition || !action) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('triggers')
    .update({ name, condition, action })
    .eq('id', slug)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);

export async function DELETE(request: NextRequest) {
  const session = await getSession({ request });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = request.nextUrl.pathname.split('/').filter(Boolean).pop();

  if (!slug) {
    return NextResponse.json({ error: 'Missing trigger ID' }, { status: 400 });
  }

  const { error } = await supabase.from('triggers').delete().eq('id', slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Trigger deleted successfully' });
}