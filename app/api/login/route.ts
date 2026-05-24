import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "gym123",
  database: "FitRoutinePro"
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { correo, password } = body;

    const connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE correo = ? AND password = ?",
      [correo, password]
    ) as any;

    await connection.end();

    if (rows.length > 0) {
      return NextResponse.json({
        success: true,
        usuario: rows[0]
      });
    }

    return NextResponse.json({
      success: false,
      error: "Credenciales incorrectas"
    });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({
      success: false,
      error: String(error)
    });
  }
}

