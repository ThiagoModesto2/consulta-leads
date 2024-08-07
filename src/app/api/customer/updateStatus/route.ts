import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function PUT(req: NextRequest) {
  try {
    const { status } = await req.json();
    const url = new URL(req.url);
    const query = url.search;
    let id = null;

    if (query) {
      const params = query.substring(1).split('&');
      for (const param of params) {
        const [key, value] = param.split('=');
        if (key === 'id') {
          id = decodeURIComponent(value);
          break;
        }
      }
    }
    if (!id || !status) {
      return NextResponse.json({ error: 'ID ou status não fornecido' }, { status: 400 });
    }
    const response = await axios.put(`${api}/api/search/index.php?id=${id}`, { id, status });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar o status' }, { status: 500 });
  }
}
