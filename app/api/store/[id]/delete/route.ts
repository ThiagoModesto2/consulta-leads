import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da loja não fornecido' }, { status: 400 });
    }

    const response = await axios.delete(`${api}/api/store/index.php?id=${id}`);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {

    console.log('error', error)

    console.error('Erro ao excluir a loja:', error);
    return NextResponse.json({ error: 'Erro ao excluir a loja' }, { status: 500 });
  }
}
