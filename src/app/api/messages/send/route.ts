import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function POST(req: NextRequest) {
  try {
    const { customer_phone, body } = await req.json();

    if (!customer_phone || !body) {
      return NextResponse.json({ error: 'Número do cliente e corpo da mensagem são obrigatórios' }, { status: 400 });
    }

    const response = await axios.post(`${api}/api/send-message/index.php`, {
      customer_phone,
      body
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Erro ao enviar a mensagem de teste:', error);
    return NextResponse.json({ error: 'Erro ao enviar a mensagem de teste' }, { status: 500 });
  }
}
