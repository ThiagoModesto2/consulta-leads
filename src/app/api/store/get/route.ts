import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get(`${api}/api/store/index.php`);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar as lojas:', error);
    return NextResponse.json({ error: 'Erro ao buscar as lojas' }, { status: 500 });
  }
}

export default async function handler(req: NextRequest) {
  if (req.method === 'GET') {
    return GET(req);
  } else {
    return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
  }
}