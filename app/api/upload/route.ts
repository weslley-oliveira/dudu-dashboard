import { NextResponse } from 'next/server';
import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: "https://s3.eu-north-1.amazonaws.com",
});

export async function POST(request: Request) {
  console.log("Request received");

  // Verifique se as variáveis de ambiente estão sendo carregadas corretamente
  console.log("AWS_S3_BUCKET_NAME:", process.env.AWS_S3_BUCKET_NAME);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    console.log("Uploaded file URL:", fileUrl);
    return NextResponse.json({ success: true, fileUrl }, { status: 200 });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload do arquivo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { fileUrl } = await request.json();
    const fileName = fileUrl.split('/').pop();

    if (!fileName) {
      return NextResponse.json({ error: 'URL do arquivo inválida' }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(command);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return NextResponse.json({ error: 'Erro ao deletar o arquivo' }, { status: 500 });
  }
}