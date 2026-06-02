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
    const connection = await mysql.createConnection(config);

    // Todos los usuarios
    const [usuarios] = await connection.execute(
      "SELECT id, nombre, correo, peso, nivel_energia, objetivo, rol, fecha_registro FROM usuarios ORDER BY fecha_registro DESC"
    ) as any;

    // Estadísticas generales
    const [stats] = await connection.execute(`
      SELECT
        (SELECT COUNT(*) FROM usuarios) as total_usuarios,
        (SELECT COUNT(*) FROM progreso) as total_rutinas,
        (SELECT COALESCE(SUM(calorias), 0) FROM progreso) as total_calorias,
        (SELECT COUNT(*) FROM comidas) as total_comidas
    `) as any;

    // Progreso por usuario
    const [progreso] = await connection.execute(`
      SELECT u.nombre, u.correo,
        COUNT(p.id) as rutinas_completadas,
        COALESCE(SUM(p.calorias), 0) as calorias_totales
      FROM usuarios u
      LEFT JOIN progreso p ON u.id = p.usuario_id
      GROUP BY u.id, u.nombre, u.correo
      ORDER BY rutinas_completadas DESC
    `) as any;

    await connection.end();

    return NextResponse.json({
      success: true,
      usuarios,
      stats: stats[0],
      progreso
    });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const connection = await mysql.createConnection(config);

    // Eliminar datos relacionados primero
    await connection.execute("DELETE FROM progreso WHERE usuario_id = ?", [id]);
    await connection.execute("DELETE FROM logros WHERE usuario_id = ?", [id]);
    await connection.execute("DELETE FROM historial_peso WHERE usuario_id = ?", [id]);
    await connection.execute("DELETE FROM comidas WHERE usuario_id = ?", [id]);
    await connection.execute("DELETE FROM usuarios WHERE id = ?", [id]);

    await connection.end();

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}