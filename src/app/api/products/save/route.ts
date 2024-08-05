import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function POST(req: NextRequest) {
  try {
    const { product_name, store_id } = await req.json();

    if (!product_name || !store_id) {
      return NextResponse.json(
        { error: 'Nome do produto ou ID da loja não fornecido' },
        { status: 400 }
      );
    }

    const response = await axios.post(`${api}/api/products/index.php`, {
      product_name,
      store_id,
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar o produto:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar o produto' },
      { status: 500 }
    );
  }
}
