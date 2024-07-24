import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da mensagem não fornecido' }, { status: 400 });
    }

    await axios.delete(`${api}/api/message/index.php?id=${id}`);
    return NextResponse.json({ message: 'Mensagem excluída com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir a mensagem:', error);
    return NextResponse.json({ error: 'Erro ao excluir a mensagem' }, { status: 500 });
  }
}
