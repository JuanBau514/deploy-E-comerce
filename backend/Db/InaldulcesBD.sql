CREATE DATABASE inaldulces;

USE inaldulces;

CREATE TABLE genero (
    id_genero INT NOT NULL,
    genero VARCHAR(50),
    PRIMARY KEY(id_genero)
);

CREATE TABLE rol (
    id_rol INT NOT NULL,
    rol VARCHAR(50),
    PRIMARY KEY(id_rol)
);

CREATE TABLE rubro(
    id_rubro INT NOT NULL,
    rubro VARCHAR(100),
    PRIMARY KEY(id_rubro)
);

CREATE TABLE usuario (
    cedula INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    id_genero INT,
    id_rol INT NOT NULL,
    
    PRIMARY KEY (cedula),
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

CREATE TABLE empresa (
    nit INT NOT NULL,
    razon_social VARCHAR(100),
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    id_rubro INT,
    cedula_representante_legal INT NOT NULL,
    
    PRIMARY KEY (nit),
    FOREIGN KEY(id_rubro) REFERENCES rubro(id_rubro),
    FOREIGN KEY(cedula_representante_legal) REFERENCES usuario(cedula)
);

ALTER TABLE usuario
ADD COLUMN nit_empresa INT;

ALTER TABLE usuario
ADD CONSTRAINT fk_empresa_usuario
FOREIGN KEY (nit_empresa) REFERENCES empresa(nit);

CREATE TABLE estado ( 
   id_estado INT PRIMARY KEY NOT NULL, 
   estado VARCHAR(100) 
);

CREATE TABLE producto (
    codigo_producto INT PRIMARY KEY NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    url_imagen TEXT NULL,
    cantidad_disponible INT,
    id_estado INT, 
   FOREIGN KEY (id_estado) REFERENCES estado(id_estado) 
);

CREATE TABLE ciudad(
    id_ciudad INT NOT NULL,
    nombre VARCHAR(50),
    PRIMARY KEY(id_ciudad)
);

CREATE TABLE direccion (
    id_direccion INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,  
    codigo_postal VARCHAR(10),  
    id_ciudad INT NOT NULL,
    cedula_usuario INT NOT NULL,
    
    FOREIGN KEY (id_ciudad) REFERENCES ciudad(id_ciudad),
    FOREIGN KEY (cedula_usuario) REFERENCES usuario(cedula),
    PRIMARY KEY (id_direccion)
);

CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT NOT NULL, 
    cedula_usuario INT NOT NULL,
    FOREIGN KEY (cedula_usuario) REFERENCES usuario(cedula),
    PRIMARY KEY (id_pedido)
);

CREATE TABLE pedido_producto (
    id_pedido INT NOT NULL,
    codigo_producto INT NOT NULL,
    cantidad INT,
    precio_total_por_producto INT,
    PRIMARY KEY (codigo_producto, id_pedido),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (codigo_producto) REFERENCES producto(codigo_producto)
);

CREATE TABLE factura (
    id_factura INT AUTO_INCREMENT NOT NULL, 
    fecha DATE NOT NULL,
    iva DECIMAL(5, 2),
    total DECIMAL(10, 2),
    id_pedido INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    PRIMARY KEY (id_factura)
);

INSERT INTO genero (id_genero, genero) VALUES
(1,'Masculino'),
(2,'Femenino')
;

INSERT INTO rol (id_rol, rol) VALUES
(1,'Administrador'),
(2,'Cliente');


INSERT INTO usuario (cedula,nombre, apellido, id_genero, correo, contraseña, id_rol) VALUES
(11111,'erika', 'Martinez', 2, 'erica@inaldulces.com.co', '$2a$10$h9zkFGzcZBVk/onv4Yfj.unVN51RD4lRXoycT7FdylapbIrCegkC6',1),
(11112,'Maria', 'Gómez', 2, 'maria.gomez@adminExample.com', 'contraseña2',1),
(11113,'Carlos', 'López', 1, 'carlos.lopez@dminExample.com', 'contraseña3',1),
(11114,'Ana', 'Martínez', 2, 'ana.martinez@dminExample.com', 'contraseña4',1),
(11115,'Luis', 'Fernández', 1, 'luis.fernandez@example.com', 'contraseña5',2),
(11116,'Sofía', 'Hernández', 2, 'sofia.hernandez@example.com', 'contraseña6',2),
(11117,'Pancracia', 'Fernández', 1, 'pancri@example.com', 'contraseña5',2),
(11118,'Anacleta', 'Hernández', 2, 'anacleta@example.com', 'contraseña6',2)
;

INSERT INTO estado (id_estado,estado) VALUES
(1,'activo'),
(2,'suspendido');

INSERT INTO producto (codigo_producto,nombre, descripcion, precio, url_imagen, cantidad_disponible,id_estado) VALUES
(1,'Masmellow A', 'Masmellow A sabor a AA', 3200, '', 20,1),
(2,'Masmellow B', 'Masmellow A sabor a BB', 6400, '', 50,1),
(3,'Masmellow C', 'Masmellow A sabor a CC', 7600, '', 30,1),
(4,'Masmellow D', 'Masmellow A sabor a DD', 8500, '', 10,1);

INSERT INTO ciudad (id_ciudad, nombre) VALUES
(1, 'Bogota'),
(2, 'Soacha');

INSERT INTO rubro (id_rubro,rubro) VALUES 
(1,'Alimentos'),
(2,'Confiteria');

INSERT INTO empresa (nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal) VALUES
(1001, 'Dulces SAS', 'contacto@dulcessas.com', '3001234567', 1, 11111),
(1002, 'Chocolates XYZ', 'info@chocolatesxyz.com', '3017654321', 2, 11112);

INSERT INTO direccion (id_direccion, direccion, codigo_postal, id_ciudad, cedula_usuario) VALUES
(1, 'Calle 123 #45-67', '110111', 1, 11111),
(2, 'Carrera 50 #30-45', '110221', 1, 11112),
(3, 'Calle 89 #12-34', '110311', 1, 11113),
(4, 'Diagonal 45A #67-89', '250051', 2, 11115);

INSERT INTO pedido (id_pedido, cedula_usuario) VALUES
(1, 11115),
(2, 11116),
(3, 11117),
(4, 11118);

INSERT INTO pedido_producto (id_pedido, codigo_producto, cantidad, precio_total_por_producto) VALUES
(1, 1, 2, 6400),
(1, 2, 1, 6400),
(2, 3, 3, 22800),
(3, 4, 1, 8500);

INSERT INTO factura (id_factura, fecha, iva, total, id_pedido) VALUES
(1, '2024-10-01', 19.00, 12800.00, 1),
(2, '2024-10-02', 19.00, 22800.00, 2),
(3, '2024-10-03', 19.00, 8500.00, 3);

-- Actualizar empresas para usuarios
UPDATE usuario
SET nit_empresa = 1001 
WHERE cedula = 11115;

UPDATE usuario
SET nit_empresa = 1001 
WHERE cedula = 11116;

UPDATE usuario
SET nit_empresa = 1002
WHERE cedula = 11117;

UPDATE usuario
SET nit_empresa = 1002
WHERE cedula = 11118;

INSERT INTO rubro (id_rubro, rubro)
VALUES
  (3, 'Comercio al por menor de productos de panadería'),
  (4, 'Fabricación de helados y otros productos lácteos congelados'),
  (5, 'Distribución de bebidas'),
  (6, 'Mayoristas de productos lácteos'),
  (7, 'Comercio electrónico de alimentos y bebidas'),
  (8, 'Empresas de catering para eventos'),
  (9, 'Cafeterías y servicios de comida'),
  (10, 'Vendedores ambulantes de alimentos'),
  (11, 'Tiendas de conveniencia especializadas en productos orgánicos'),
  (12, 'Restaurantes de comida rápida'),
  (13, 'Fabricación de productos dietéticos'),
  (14, 'Comercio al por menor de productos dietéticos'),
  (15, 'Supermercados especializados en productos gourmet'),
  (16, 'Distribuidores de productos de alimentación para mascotas'),
  (17, 'Fabricantes de snacks saludables'),
  (18, 'Restaurantes de comida étnica'),
  (19, 'Tiendas de productos naturales'),
  (20, 'Fabricación de productos de chocolate'),
  (21, 'Mayoristas de productos de chocolate'),
  (22, 'Distribuidores de productos de chocolate');

  INSERT INTO rol (id_rol, rol)
VALUES
  (3, 'Representante Legal'),
  (4, 'Gerente General'),
  (5, 'Jefe de Contabilidad'),
  (6, 'Jefe de Recursos Humanos'),
  (7, 'Jefe de Producción'),
  (8, 'Jefe de Ventas'),
  (9, 'Jefe de Marketing'),
  (10, 'Contador'),
  (11, 'Analista de Recursos Humanos'),
  (12, 'Operario de Producción'),
  (13, 'Vendedor'),
  (14, 'Analista de Marketing'),
  (15, 'Asistente Administrativo'),
  (16, 'Supervisor de Almacén'),
  (17, 'Desarrollador de Software');


ALTER TABLE usuario
ADD COLUMN telefono VARCHAR(20) NULL;
