import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "gym123",
  database: "FitRoutinePro"
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuario_id = searchParams.get("usuario_id");

    const connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(
      "SELECT * FROM progreso WHERE usuario_id = ? ORDER BY fecha DESC",
      [usuario_id]
    ) as any;

    await connection.end();

    return NextResponse.json({ success: true, progreso: rows });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usuario_id, rutina_tipo, calorias, ejercicios_completados, ejercicios_total } = body;

    const connection = await mysql.createConnection(config);

    await connection.execute(
      "INSERT INTO progreso (usuario_id, rutina_tipo, calorias, ejercicios_completados, ejercicios_total) VALUES (?, ?, ?, ?, ?)",
      [usuario_id, rutina_tipo, calorias, ejercicios_completados, ejercicios_total]
    );

    await connection.end();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}