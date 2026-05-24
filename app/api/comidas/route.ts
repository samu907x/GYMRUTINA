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
    const fecha = searchParams.get("fecha");

    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(
      "SELECT * FROM comidas WHERE usuario_id = ? AND fecha = ? ORDER BY tipo, hora",
      [usuario_id, fecha]
    ) as any;
    await connection.end();

    return NextResponse.json({ success: true, comidas: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usuario_id, tipo, nombre, calorias, fecha, hora } = body;

    const connection = await mysql.createConnection(config);
    await connection.execute(
      "INSERT INTO comidas (usuario_id, tipo, nombre, calorias, fecha, hora) VALUES (?, ?, ?, ?, ?, ?)",
      [usuario_id, tipo, nombre, calorias, fecha, hora]
    );
    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const connection = await mysql.createConnection(config);
    await connection.execute("DELETE FROM comidas WHERE id = ?", [id]);
    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}