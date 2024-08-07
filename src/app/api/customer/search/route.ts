import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.search;
  let identifier = null;

  if (query) {
    const params = query.substring(1).split('&');
    for (const param of params) {
      const [key, value] = param.split('=');
      if (key === 'identifier') {
        identifier = decodeURIComponent(value);
        break;
      }
    }
  }

  if (!identifier) {
    return NextResponse.json({ error: 'Identificador não fornecido' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${api}/api/search/index.php?identifier=${identifier}`);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar o identificador:', error);
    return NextResponse.json({ error: 'Erro ao buscar o identificador' }, { status: 500 });
  }
}
