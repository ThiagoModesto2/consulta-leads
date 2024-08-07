import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/config/links';

export async function GET(req: NextRequest) {
  // Obtendo a URL
  const url = new URL(req.url);

  // Obtendo o valor do identifier da URL manualmente sem usar searchParams
  const query = url.search;
  let identifier = null;

  // Extrair o valor do identifier manualmente da query string
  if (query) {
    const params = query.substring(1).split('&'); // Remove o '?' e divide os parâmetros
    for (const param of params) {
      const [key, value] = param.split('=');
      if (key === 'identifier') {
        identifier = value;
        break;
      }
    }
  }

  console.log("identifier", identifier);

  // Verificando se o identifier está presente
  if (!identifier) {
    return NextResponse.json({ error: 'Identificador não fornecido' }, { status: 400 });
  }

  try {
    // Fazendo a requisição para a API externa com o identifier como parâmetro
    const response = await axios.get(`${api}/api/search/index.php`, {
      params: { identifier },
    });

    // Retornando a resposta da API externa
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar o identificador:', error);
    // Retornando uma resposta de erro em caso de falha na requisição
    return NextResponse.json({ error: 'Erro ao buscar o identificador' }, { status: 500 });
  }
}
