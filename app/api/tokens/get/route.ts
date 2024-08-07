import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('store_id');

    let url = `${api}/api/tokens/index.php`;

    if (storeId) {
      url += `?store_id=${storeId}`;
    }

    const response = await axios.get(url);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar os produtos:', error);
    return NextResponse.json({ error: 'Erro ao buscar os produtos' }, { status: 500 });
  }
}
