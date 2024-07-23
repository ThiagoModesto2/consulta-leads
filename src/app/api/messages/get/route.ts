import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const url = id ? `${api}/api/messages/${id}` : `${api}/api/message/index.php`;

    const response = await axios.get(url);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar as mensagens:', error);
    return NextResponse.json({ error: 'Erro ao buscar as mensagens' }, { status: 500 });
  }
}
