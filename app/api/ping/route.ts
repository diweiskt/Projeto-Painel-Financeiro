import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (token !== process.env.PING_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  try {
    const { error } = await supabase.from('transactions').select('*').limit(1);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Supabase acordado!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao conectar' }, { status: 500 });
  }
}