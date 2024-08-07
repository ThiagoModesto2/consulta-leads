import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, phone_number, store_id } = body;

    if (!token || !phone_number || !store_id) {
      return NextResponse.json(
        { error: 'Token, número do celular ou ID da loja não fornecido' },
        { status: 400 }
      );
    }

    const response = await axios.post(`${api}/api/tokens/index.php`, {
      token,
      phone_number,
      store_id,
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: 'Erro ao cadastrar o token' },
      { status: 500 }
    );
  }
}
