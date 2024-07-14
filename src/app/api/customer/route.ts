import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Número de telefone não fornecido' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${api}/api/search-phone/index.php`, {
      params: { phone },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar o telefone:', error);
    return NextResponse.json({ error: 'Erro ao buscar o telefone' }, { status: 500 });
  }
}


