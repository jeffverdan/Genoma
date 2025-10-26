// pages/api/notificacoes_sininho.ts
import { NextApiRequest, NextApiResponse } from "next";

let clients: NextApiResponse[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // SSE stream
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    // envia mensagem inicial
    res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

    clients.push(res);

    req.on("close", () => {
      clients = clients.filter((c) => c !== res);
    });
  }

  if (req.method === "POST") {
    // aqui você faria sua lógica normal de listar notificações
    const { page, usuario_id } = req.body;

    // exemplo de retorno padrão para o axios
    const data = [
      { type: "notification", body: req.body }
    ];

    res.write(`data: ${JSON.stringify({ type: "notification", usuario_id: usuario_id })}\n\n`);   

    // além de retornar para quem chamou, também notifica os conectados via SSE
    const notification = { type: "notification", usuario_id: usuario_id };
    clients.forEach((client) => client.write(`data: ${JSON.stringify(notification)}\n\n`));

    return res.status(200).json({ page, data });
  }
}
