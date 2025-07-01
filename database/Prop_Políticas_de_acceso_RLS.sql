-- 1. Habilitar RLS en todas las tablas necesarias
ALTER TABLE profesores ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE atletas ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesores_horarios ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para 'profesores'
DROP POLICY IF EXISTS "Profesores select" ON profesores;
CREATE POLICY "Profesores select" ON profesores
AS PERMISSIVE FOR SELECT USING (
  user_id = auth.uid()
);

DROP POLICY IF EXISTS "Profesores update" ON profesores;
CREATE POLICY "Profesores update" ON profesores
AS PERMISSIVE FOR UPDATE USING (
  user_id = auth.uid()
) WITH CHECK (
  user_id = auth.uid()
);

-- 3. Políticas para 'horarios'
DROP POLICY IF EXISTS "Horarios select" ON horarios;
CREATE POLICY "Horarios select" ON horarios
AS PERMISSIVE FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profesores_horarios ph
    WHERE ph.horario_id = horarios.id
    AND ph.profesor_id = (
      SELECT id FROM profesores WHERE user_id = auth.uid()
    )
  )
);

-- 4. Políticas para 'atletas'
DROP POLICY IF EXISTS "Atletas select" ON atletas;
CREATE POLICY "Atletas select" ON atletas
AS PERMISSIVE FOR SELECT USING (
  grupo_id IN (
    SELECT grupo_id FROM horarios_grupos
    WHERE horario_id IN (
      SELECT horario_id FROM profesores_horarios
      WHERE profesor_id = (
        SELECT id FROM profesores WHERE user_id = auth.uid()
      )
    )
  )
);

-- 5. Políticas para 'asistencias'
-- Select
DROP POLICY IF EXISTS "Asistencias select" ON asistencias;
CREATE POLICY "Asistencias select" ON asistencias
AS PERMISSIVE FOR SELECT USING (
  profesor_id = (SELECT id FROM profesores WHERE user_id = auth.uid())
);

-- Insert
DROP POLICY IF EXISTS "Asistencias insert" ON asistencias;
CREATE POLICY "Asistencias insert" ON asistencias
AS PERMISSIVE FOR INSERT WITH CHECK (
  profesor_id = (SELECT id FROM profesores WHERE user_id = auth.uid())
);

-- Update
DROP POLICY IF EXISTS "Asistencias update" ON asistencias;
CREATE POLICY "Asistencias update" ON asistencias
AS PERMISSIVE FOR UPDATE USING (
  profesor_id = (SELECT id FROM profesores WHERE user_id = auth.uid())
) WITH CHECK (
  profesor_id = (SELECT id FROM profesores WHERE user_id = auth.uid())
);

-- 6. Políticas para tablas de unión
-- horarios_grupos
DROP POLICY IF EXISTS "Uniones select grupos" ON horarios_grupos;
CREATE POLICY "Uniones select grupos" ON horarios_grupos
AS PERMISSIVE FOR SELECT USING (true);

-- profesores_horarios
DROP POLICY IF EXISTS "Uniones select profesores" ON profesores_horarios;
CREATE POLICY "Uniones select profesores" ON profesores_horarios
AS PERMISSIVE FOR SELECT USING (true);

-- 7. Permisos adicionales para autenticados
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE ON asistencias TO authenticated;
GRANT UPDATE ON profesores TO authenticated;

-- 8. Configuración de autenticación (opcional)
UPDATE auth.users SET role = 'authenticated' WHERE role IS NULL;
