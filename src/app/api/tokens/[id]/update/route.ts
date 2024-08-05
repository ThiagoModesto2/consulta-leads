import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function PUT(req: NextRequest) {
  try {
    const { id, product_name, store_id } = await req.json();

    if (!id || !product_name || !store_id) {
      return NextResponse.json({ error: 'ID, nome do produto ou ID da loja não fornecido' }, { status: 400 });
    }

    const response = await axios.put(`${api}/api/products/index.php`, { id, product_name, store_id });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    return NextResponse.json({ error: 'Erro ao atualizar o produto' }, { status: 500 });
  }
}
