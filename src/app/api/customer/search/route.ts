import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function GET(req: NextRequest) {
  // Obtendo a URL e os parâmetros de pesquisa
  const { searchParams } = new URL(req.url);
  const url = new URL(req.url);
  
  // Obtendo o valor do identifier usando pop
  const identifier = url.pathname.split('/').pop();

  // Verificando se o identifier está presente
  if (!identifier) {
    return NextResponse.json({ error: 'Identificador não fornecido' }, { status: 400 });
  }

  try {
    // Verificando se o identifier é um número de telefone (10 ou 11 dígitos)
    const isPhone = /^\d{10,11}$/.test(identifier);
    // Definindo os parâmetros com base no tipo de identifier
    const params: Record<string, string> = isPhone ? { phone: identifier } : { document: identifier };

    // Fazendo a requisição para a API externa com os parâmetros apropriados
    const response = await axios.get(`${api}/api/search/index.php`, {
      params,
    });

    // Retornando a resposta da API externa
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar o identificador:', error);
    // Retornando uma resposta de erro em caso de falha na requisição
    return NextResponse.json({ error: 'Erro ao buscar o identificador' }, { status: 500 });
  }
}
