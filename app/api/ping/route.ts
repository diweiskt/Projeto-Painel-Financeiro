import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { error } = await supabase.from('transactions').select('*').limit(1);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Supabase acordado com sucesso!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao conectar' }, { status: 500 });
  }
}
