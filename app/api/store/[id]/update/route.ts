import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'ID ou nome da loja não fornecido' }, { status: 400 });
    }

    const response = await axios.put(`${api}/api/store/index.php`, { id, name });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar a loja:', error);
    return NextResponse.json({ error: 'Erro ao atualizar a loja' }, { status: 500 });
  }
}
