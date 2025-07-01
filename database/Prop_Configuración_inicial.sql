-- Eliminar tablas existentes si es necesario (ejecutar solo si se necesita reiniciar)
DROP TABLE IF EXISTS asistencias CASCADE;
DROP TABLE IF EXISTS atletas CASCADE;
DROP TABLE IF EXISTS horarios_grupos CASCADE;
DROP TABLE IF EXISTS grupos CASCADE;
DROP TABLE IF EXISTS profesores_horarios CASCADE;
DROP TABLE IF EXISTS horarios CASCADE;
DROP TABLE IF EXISTS profesores CASCADE;

-- Crear extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------
-- Tablas principales
-----------------------------

-- Tabla de profesores
CREATE TABLE profesores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla de horarios
CREATE TABLE horarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dia_semana TEXT NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL
);

-- Tabla de relación profesores-horarios
CREATE TABLE profesores_horarios (
  profesor_id UUID REFERENCES profesores(id) ON DELETE CASCADE,
  horario_id UUID REFERENCES horarios(id) ON DELETE CASCADE,
  PRIMARY KEY (profesor_id, horario_id)
);

-- Tabla de grupos
CREATE TABLE grupos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  nivel TEXT NOT NULL
);

-- Tabla de relación horarios-grupos
CREATE TABLE horarios_grupos (
  horario_id UUID REFERENCES horarios(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  PRIMARY KEY (horario_id, grupo_id)
);

-- Tabla de atletas
CREATE TABLE atletas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL
);

-- Tabla de asistencias
CREATE TABLE asistencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  horario_id UUID REFERENCES horarios(id) ON DELETE CASCADE,
  profesor_id UUID REFERENCES profesores(id) ON DELETE SET NULL,
  atleta_id UUID REFERENCES atletas(id) ON DELETE CASCADE,
  presente BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (fecha, horario_id, atleta_id)
);

-----------------------------
-- Funciones y Triggers
-----------------------------

-- Eliminar el trigger existente si ya está creado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;  -- ¡Corrección clave aquí!

-- Función para vincular usuarios con profesores
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profesores (user_id, email, nombre)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función al crear usuario
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-----------------------------
-- Políticas de Seguridad (RLS)
-----------------------------

-- Activar RLS para todas las tablas
ALTER TABLE profesores ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesores_horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE atletas ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;

-- Políticas para profesores
CREATE POLICY "Profesores: leer propio perfil" ON profesores
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Profesores: actualizar propio perfil" ON profesores
FOR UPDATE USING (user_id = auth.uid());

-- Políticas para horarios
CREATE POLICY "Horarios: lectura para profesores" ON horarios
FOR SELECT TO authenticated USING (true);

-- Políticas para profesores_horarios
CREATE POLICY "Profesores_horarios: lectura para profesores asignados" ON profesores_horarios
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM profesores
    WHERE profesores.id = profesores_horarios.profesor_id
    AND profesores.user_id = auth.uid()
  )
);

-- Políticas para grupos
CREATE POLICY "Grupos: lectura para profesores" ON grupos
FOR SELECT TO authenticated USING (true);

-- Políticas para horarios_grupos
CREATE POLICY "Horarios_grupos: lectura para profesores" ON horarios_grupos
FOR SELECT TO authenticated USING (true);

-- Políticas para atletas
CREATE POLICY "Atletas: lectura para profesores relacionados" ON atletas
FOR SELECT USING (
  grupo_id IN (
    SELECT grupo_id
    FROM horarios_grupos
    WHERE horario_id IN (
      SELECT horario_id
      FROM profesores_horarios
      WHERE profesor_id IN (
        SELECT id 
        FROM profesores 
        WHERE user_id = auth.uid()
      )
    )
  )
);

-- Políticas para asistencias
CREATE POLICY "Asistencias: lectura para profesores" ON asistencias
FOR SELECT USING (
  profesor_id IN (
    SELECT id 
    FROM profesores 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Asistencias: inserción para profesores" ON asistencias
FOR INSERT WITH CHECK (
  profesor_id IN (
    SELECT id 
    FROM profesores 
    WHERE user_id = auth.uid()
  )
  AND horario_id IN (
    SELECT horario_id
    FROM profesores_horarios
    WHERE profesor_id IN (
      SELECT id 
      FROM profesores 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Asistencias: actualización para profesores" ON asistencias
FOR UPDATE USING (
  profesor_id IN (
    SELECT id 
    FROM profesores 
    WHERE user_id = auth.uid()
  )
);

-----------------------------
-- Datos de Ejemplo
-----------------------------

-- Insertar horarios
INSERT INTO horarios (dia_semana, hora_inicio, hora_fin)
VALUES 
('Lunes', '08:00:00', '10:00:00'),
('Lunes', '16:00:00', '18:00:00'),
('Martes', '09:00:00', '11:00:00'),
('Miércoles', '08:30:00', '10:30:00'),
('Jueves', '17:00:00', '19:00:00'),
('Viernes', '15:00:00', '17:00:00'),
('Sábado', '10:00:00', '12:00:00');

-- Insertar grupos
INSERT INTO grupos (nombre, nivel)
VALUES 
('Delfines', 'Principiante'),
('Tiburones', 'Intermedio'),
('Orcas', 'Avanzado'),
('Ballenas', 'Adultos'),
('Focas', 'Infantil');

-- Insertar atletas
INSERT INTO atletas (nombre, apellido, grupo_id)
SELECT 
  nombres.nombre, 
  nombres.apellido,
  g.id AS grupo_id
FROM (VALUES 
  ('Juan', 'García'),
  ('María', 'López'),
  ('Pedro', 'Martínez'),
  ('Ana', 'Rodríguez'),
  ('Luis', 'Fernández'),
  ('Sofía', 'González'),
  ('Carlos', 'Pérez'),
  ('Laura', 'Sánchez'),
  ('Miguel', 'Ramírez'),
  ('Elena', 'Torres'),
  ('Javier', 'Díaz'),
  ('Carmen', 'Ruiz'),
  ('David', 'Hernández'),
  ('Isabel', 'Jiménez'),
  ('Francisco', 'Moreno')
) AS nombres(nombre, apellido)
JOIN grupos g ON 1=1
WHERE 
  (g.nombre = 'Delfines' AND nombres.nombre IN ('Juan', 'María', 'Pedro')) OR
  (g.nombre = 'Tiburones' AND nombres.nombre IN ('Ana', 'Luis', 'Sofía')) OR
  (g.nombre = 'Orcas' AND nombres.nombre IN ('Carlos', 'Laura', 'Miguel')) OR
  (g.nombre = 'Ballenas' AND nombres.nombre IN ('Elena', 'Javier', 'Carmen')) OR
  (g.nombre = 'Focas' AND nombres.nombre IN ('David', 'Isabel', 'Francisco'));

-- Asignar grupos a horarios
INSERT INTO horarios_grupos (horario_id, grupo_id)
SELECT 
  h.id AS horario_id, 
  g.id AS grupo_id
FROM horarios h
CROSS JOIN grupos g
WHERE 
  (h.dia_semana = 'Lunes' AND h.hora_inicio = '08:00:00' AND g.nombre = 'Delfines') OR
  (h.dia_semana = 'Lunes' AND h.hora_inicio = '16:00:00' AND g.nombre = 'Tiburones') OR
  (h.dia_semana = 'Martes' AND h.hora_inicio = '09:00:00' AND g.nombre = 'Orcas') OR
  (h.dia_semana = 'Miércoles' AND h.hora_inicio = '08:30:00' AND g.nombre = 'Focas') OR
  (h.dia_semana = 'Jueves' AND h.hora_inicio = '17:00:00' AND g.nombre = 'Ballenas') OR
  (h.dia_semana = 'Viernes' AND h.hora_inicio = '15:00:00' AND g.nombre = 'Tiburones') OR
  (h.dia_semana = 'Sábado' AND h.hora_inicio = '10:00:00' AND g.nombre = 'Orcas');