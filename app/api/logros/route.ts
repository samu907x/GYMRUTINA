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
      "SELECT * FROM logros WHERE usuario_id = ? ORDER BY fecha_obtenido DESC",
      [usuario_id]
    ) as any;
    await connection.end();

    return NextResponse.json({ success: true, logros: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usuario_id, codigo, nombre, descripcion, emoji } = body;

    const connection = await mysql.createConnection(config);

    const [existe] = await connection.execute(
      "SELECT id FROM logros WHERE usuario_id = ? AND codigo = ?",
      [usuario_id, codigo]
    ) as any;

    if (existe.length > 0) {
      await connection.end();
      return NextResponse.json({ success: false, error: "Ya tiene este logro" });
    }

    await connection.execute(
      "INSERT INTO logros (usuario_id, codigo, nombre, descripcion, emoji) VALUES (?, ?, ?, ?, ?)",
      [usuario_id, codigo, nombre, descripcion, emoji]
    );

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}