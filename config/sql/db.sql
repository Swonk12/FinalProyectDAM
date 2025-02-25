CREATE DATABASE LaborX;
GO
USE LaborX;
GO

-- Tabla de Usuarios (Admins y Usuarios normales)
CREATE TABLE Usuarios (
    IdUsuario        INT IDENTITY(1,1) PRIMARY KEY,
    Nombre          VARCHAR(100) NOT NULL,
    Apellido        VARCHAR(100) NOT NULL,
    Email           VARCHAR(150) UNIQUE NOT NULL,
    Contrasena      VARCHAR(255) NOT NULL,
    TipoUsuario     VARCHAR(50) CHECK (TipoUsuario IN ('Admin', 'Usuario')) NOT NULL,
    FechaRegistro   DATETIME DEFAULT GETDATE(),
    Estado          BIT DEFAULT 1 -- 1 = Activo, 0 = Inactivo
);
GO

-- Tabla de Fichaje (Registro de horas de entrada y salida)
CREATE TABLE Fichajes (
    IdFichaje       INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario       INT FOREIGN KEY REFERENCES Usuarios(IdUsuario),
    Fecha           DATE NOT NULL,
    HoraEntrada     TIME NOT NULL,
    HoraSalida      TIME NULL,
    Comentarios     TEXT NULL
);
GO

-- Tabla de Vacaciones
CREATE TABLE Vacaciones (
    IdVacacion      INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario       INT FOREIGN KEY REFERENCES Usuarios(IdUsuario),
    FechaInicio     DATE NOT NULL,
    FechaFin        DATE NOT NULL,
    Estado          VARCHAR(50) CHECK (Estado IN ('Pendiente', 'Aprobado', 'Rechazado')) DEFAULT 'Pendiente',
    FechaSolicitud  DATETIME DEFAULT GETDATE()
);
GO

-- Tabla de Contratos (Archivos PDF con contratos personales)
CREATE TABLE Contratos (
    IdContrato      INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario       INT FOREIGN KEY REFERENCES Usuarios(IdUsuario),
    NombreArchivo   VARCHAR(255) NOT NULL,
    RutaArchivo     VARCHAR(500) NOT NULL,
    FechaSubida     DATETIME DEFAULT GETDATE()
);
GO

-- Tabla de Nóminas (Archivos PDF con las nóminas de cada usuario)
CREATE TABLE Nominas (
    IdNomina        INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario       INT FOREIGN KEY REFERENCES Usuarios(IdUsuario),
    MesAnio         VARCHAR(10) NOT NULL, -- Ejemplo: "01-2024"
    NombreArchivo   VARCHAR(255) NOT NULL,
    RutaArchivo     VARCHAR(500) NOT NULL,
    FechaSubida     DATETIME DEFAULT GETDATE()
);
GO
