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
    const { nombre, correo, password, peso, nivel_energia, objetivo } = body;

    const connection = await mysql.createConnection(config);

    // Verificar si el correo ya existe
    const [existe] = await connection.execute(
      "SELECT id FROM usuarios WHERE correo = ?",
      [correo]
    ) as any;

    if (existe.length > 0) {
      await connection.end();
      return NextResponse.json({
        success: false,
        error: "El correo ya está registrado"
      });
    }

    // Insertar el nuevo usuario
    await connection.execute(
      "INSERT INTO usuarios (nombre, correo, password, peso, nivel_energia, objetivo) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, correo, password, peso, nivel_energia, objetivo]
    );

    // Obtener el usuario recién creado
    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    ) as any;

    await connection.end();

    return NextResponse.json({
      success: true,
      usuario: rows[0]
    });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({
      success: false,
      error: String(error)
    });
  }
}