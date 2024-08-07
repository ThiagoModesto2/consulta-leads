import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const identifier = searchParams.get('identifier');

  if (!identifier) {
    return NextResponse.json({ error: 'Identificador não fornecido' }, { status: 400 });
  }

  try {
    const isPhone = /^\d{10,11}$/.test(identifier);
    const params: Record<string, string> = isPhone ? { phone: identifier } : { document: identifier };

    const response = await axios.get(`${api}/api/search/index.php`, {
      params,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar o identificador:', error);
    return NextResponse.json({ error: 'Erro ao buscar o identificador' }, { status: 500 });
  }
}
