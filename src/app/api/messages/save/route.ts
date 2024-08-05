import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function POST(req: NextRequest) {
  try {
    const { message, orderMessage, status, store_id, origem_loja, product_id } = await req.json();

    if (!message || !orderMessage || !status) {
      return NextResponse.json({ error: 'Message, OrderMessage, and Status são obrigatórios' }, { status: 400 });
    }

    const response = await axios.post(`${api}/api/message/index.php`, {
      message,
      orderMessage,
      status,
      store_id: store_id || null,
      origem_loja: origem_loja || null,
      product_id: product_id || null
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar a mensagem:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar a mensagem' }, { status: 500 });
  }
}
