import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Nome da loja não fornecido' }, { status: 400 });
    }

    const response = await axios.post(`${api}/api/store/index.php`, {
      name,
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar a loja:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar a loja' }, { status: 500 });
  }
}
