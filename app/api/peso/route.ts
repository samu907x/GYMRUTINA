import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const config = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const usuario_id = searchParams.get("usuario_id");

    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(
      "SELECT * FROM historial_peso WHERE usuario_id = ? ORDER BY fecha ASC",
      [usuario_id]
    ) as any;
    await connection.end();

    return NextResponse.json({ success: true, historial: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usuario_id, peso } = body;

    const connection = await mysql.createConnection(config);
    await connection.execute(
      "INSERT INTO historial_peso (usuario_id, peso) VALUES (?, ?)",
      [usuario_id, peso]
    );
    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}