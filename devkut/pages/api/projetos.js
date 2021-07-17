import { SiteClient } from 'datocms-client';

export default async function requestReceiver(request, response) {
  if (request.method === 'POST') {
    const TOKEN = '3004a5dcd1f8bb4455c06689c255cd';
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: '972902',
      ...request.body,
    });

    response.json({
      dados: 'Algum dado',
      registroCriado: registroCriado,
    });
    return;
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST nós temos'
  })
}
