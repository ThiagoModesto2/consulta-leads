import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import { api } from '@/config/links';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('csv_file');
    const token = formData.get('token') || '';

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const form = new FormData();
    form.append('csv_file', buffer, {
      contentType: file.type || 'application/octet-stream',
      filename: 'upload.csv',
    });
    form.append('token', token.toString());

    const response = await axios.post(`${api}/api/csv/index.php`, form, {
      headers: form.getHeaders(),
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erro ao reenviar o arquivo:', error);
    return NextResponse.json({ error: 'Erro ao reenviar o arquivo' }, { status: 500 });
  }
}
