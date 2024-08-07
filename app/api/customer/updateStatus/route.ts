import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function PUT(req: NextRequest) {
  try {
    const { status } = await req.json();
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); 

    if (!id || !status) {
      return NextResponse.json({ error: 'ID ou status não fornecido' }, { status: 400 });
    }

    const response = await axios.put(`${api}/api/search/index.php?id=${id}`, { id, status });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar o status:', error);
    return NextResponse.json({ error: 'Erro ao atualizar o status' }, { status: 500 });
  }
}
