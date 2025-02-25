// Inserts tabla Usuarios
INSERT INTO Usuarios (Nombre, Apellido, Email, Contrasena, TipoUsuario, Estado) VALUES
('Juan', 'Perez', 'juan.perez@example.com', 'hashed_password_1', 'Admin', 1),
('Maria', 'Gomez', 'maria.gomez@example.com', 'hashed_password_2', 'Usuario', 1),
('Carlos', 'Lopez', 'carlos.lopez@example.com', 'hashed_password_3', 'Usuario', 1),
('Ana', 'Martinez', 'ana.martinez@example.com', 'hashed_password_4', 'Usuario', 1),
('Luis', 'Fernandez', 'luis.fernandez@example.com', 'hashed_password_5', 'Usuario', 1),
('Sofia', 'Rodriguez', 'sofia.rodriguez@example.com', 'hashed_password_6', 'Usuario', 1),
('Pedro', 'Hernandez', 'pedro.hernandez@example.com', 'hashed_password_7', 'Usuario', 1),
('Elena', 'Diaz', 'elena.diaz@example.com', 'hashed_password_8', 'Usuario', 1),
('Andres', 'Torres', 'andres.torres@example.com', 'hashed_password_9', 'Usuario', 1),
('Laura', 'Sanchez', 'laura.sanchez@example.com', 'hashed_password_10', 'Usuario', 1);

// Inserts tabla Fichajes
INSERT INTO Fichajes (IdUsuario, Fecha, HoraEntrada, HoraSalida, Comentarios) VALUES
(1, '2024-02-01', '08:00:00', '17:00:00', 'Jornada completa'),
(2, '2024-02-01', '09:00:00', '18:00:00', 'Retraso leve'),
(3, '2024-02-02', '08:30:00', '17:30:00', 'Reunión por la mañana'),
(4, '2024-02-02', '07:45:00', '16:45:00', NULL),
(5, '2024-02-03', '08:00:00', '17:00:00', 'Trabajo remoto'),
(6, '2024-02-03', '08:15:00', '17:15:00', NULL),
(7, '2024-02-04', '09:00:00', '18:00:00', 'Salida anticipada'),
(8, '2024-02-04', '08:00:00', '17:00:00', NULL),
(9, '2024-02-05', '08:00:00', NULL, 'Aún trabajando'),
(10, '2024-02-05', '08:30:00', '17:30:00', NULL);

// Inserts tabla Vacaciones
INSERT INTO Vacaciones (IdUsuario, FechaInicio, FechaFin, Estado) VALUES
(1, '2024-07-01', '2024-07-15', 'Aprobado'),
(2, '2024-08-10', '2024-08-20', 'Pendiente'),
(3, '2024-09-05', '2024-09-15', 'Aprobado'),
(4, '2024-06-01', '2024-06-10', 'Rechazado'),
(5, '2024-12-15', '2024-12-31', 'Pendiente'),
(6, '2024-07-20', '2024-07-30', 'Aprobado'),
(7, '2024-10-10', '2024-10-20', 'Pendiente'),
(8, '2024-08-01', '2024-08-15', 'Aprobado'),
(9, '2024-05-01', '2024-05-10', 'Rechazado'),
(10, '2024-11-01', '2024-11-15', 'Pendiente');

// Inserts tabla Contratos
INSERT INTO Contratos (IdUsuario, NombreArchivo, RutaArchivo) VALUES
(1, 'Contrato_JuanPerez.pdf', '/contratos/juan_perez.pdf'),
(2, 'Contrato_MariaGomez.pdf', '/contratos/maria_gomez.pdf'),
(3, 'Contrato_CarlosLopez.pdf', '/contratos/carlos_lopez.pdf'),
(4, 'Contrato_AnaMartinez.pdf', '/contratos/ana_martinez.pdf'),
(5, 'Contrato_LuisFernandez.pdf', '/contratos/luis_fernandez.pdf'),
(6, 'Contrato_SofiaRodriguez.pdf', '/contratos/sofia_rodriguez.pdf'),
(7, 'Contrato_PedroHernandez.pdf', '/contratos/pedro_hernandez.pdf'),
(8, 'Contrato_ElenaDiaz.pdf', '/contratos/elena_diaz.pdf'),
(9, 'Contrato_AndresTorres.pdf', '/contratos/andres_torres.pdf'),
(10, 'Contrato_LauraSanchez.pdf', '/contratos/laura_sanchez.pdf');

// Inserts tabla Nominas
INSERT INTO Nominas (IdUsuario, MesAnio, NombreArchivo, RutaArchivo) VALUES
(1, '01-2024', 'Nomina_JuanPerez_01-2024.pdf', '/nominas/juan_perez_01-2024.pdf'),
(2, '01-2024', 'Nomina_MariaGomez_01-2024.pdf', '/nominas/maria_gomez_01-2024.pdf'),
(3, '01-2024', 'Nomina_CarlosLopez_01-2024.pdf', '/nominas/carlos_lopez_01-2024.pdf'),
(4, '01-2024', 'Nomina_AnaMartinez_01-2024.pdf', '/nominas/ana_martinez_01-2024.pdf'),
(5, '01-2024', 'Nomina_LuisFernandez_01-2024.pdf', '/nominas/luis_fernandez_01-2024.pdf'),
(6, '01-2024', 'Nomina_SofiaRodriguez_01-2024.pdf', '/nominas/sofia_rodriguez_01-2024.pdf'),
(7, '01-2024', 'Nomina_PedroHernandez_01-2024.pdf', '/nominas/pedro_hernandez_01-2024.pdf'),
(8, '01-2024', 'Nomina_ElenaDiaz_01-2024.pdf', '/nominas/elena_diaz_01-2024.pdf'),
(9, '01-2024', 'Nomina_AndresTorres_01-2024.pdf', '/nominas/andres_torres_01-2024.pdf'),
(10, '01-2024', 'Nomina_LauraSanchez_01-2024.pdf', '/nominas/laura_sanchez_01-2024.pdf');