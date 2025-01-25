-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-10-2024 a las 00:30:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inaldulces`
--
CREATE DATABASE IF NOT EXISTS `inaldulces` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `inaldulces`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `id_ciudad` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudad`
--

INSERT INTO `ciudad` (`id_ciudad`, `nombre`) VALUES
(1, 'Bogota'),
(2, 'Soacha');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion`
--

CREATE TABLE `direccion` (
  `id_direccion` int(11) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `id_ciudad` int(11) NOT NULL,
  `cedula_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direccion`
--

INSERT INTO `direccion` (`id_direccion`, `direccion`, `codigo_postal`, `id_ciudad`, `cedula_usuario`) VALUES
(1, 'Calle 123 #45-67', '110111', 1, 11111),
(2, 'Carrera 50 #30-45', '110221', 1, 11112),
(3, 'Calle 89 #12-34', '110311', 1, 11113),
(4, 'Diagonal 45A #67-89', '250051', 2, 11115);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `nit` int(11) NOT NULL,
  `razon_social` varchar(100) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `id_rubro` int(11) DEFAULT NULL,
  `cedula_representante_legal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`nit`, `razon_social`, `correo`, `telefono`, `id_rubro`, `cedula_representante_legal`) VALUES
(1001, 'Dulces SAS', 'contacto@dulcessas.com', '3001234567', 1, 11111),
(1002, 'Chocolates XYZ', 'info@chocolatesxyz.com', '3017654321', 2, 11112);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id_factura` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `iva` decimal(5,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `id_pedido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `factura`
--

INSERT INTO `factura` (`id_factura`, `fecha`, `iva`, `total`, `id_pedido`) VALUES
(1, '2024-10-01', 19.00, 12800.00, 1),
(2, '2024-10-02', 19.00, 22800.00, 2),
(3, '2024-10-03', 19.00, 8500.00, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genero`
--

CREATE TABLE `genero` (
  `id_genero` int(11) NOT NULL,
  `genero` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `genero`
--

INSERT INTO `genero` (`id_genero`, `genero`) VALUES
(1, 'Masculino'),
(2, 'Femenino');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `cedula_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id_pedido`, `cedula_usuario`) VALUES
(1, 11115),
(2, 11116),
(3, 11117),
(4, 11118);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_producto`
--

CREATE TABLE `pedido_producto` (
  `id_pedido` int(11) NOT NULL,
  `codigo_producto` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_total_por_producto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido_producto`
--

INSERT INTO `pedido_producto` (`id_pedido`, `codigo_producto`, `cantidad`, `precio_total_por_producto`) VALUES
(1, 1, 2, 6400),
(1, 2, 1, 6400),
(2, 3, 3, 22800),
(3, 4, 1, 8500);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `codigo_producto` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `url_imagen` varchar(2083) DEFAULT NULL,
  `cantidad_disponible` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`codigo_producto`, `nombre`, `descripcion`, `precio`, `url_imagen`, `cantidad_disponible`) VALUES
(1, 'Masmellow A', 'Masmellow A sabor a AA', 3200.00, '', 20),
(2, 'Masmellow B', 'Masmellow A sabor a BB', 6400.00, '', 50),
(3, 'Masmellow C', 'Masmellow A sabor a CC', 7600.00, '', 30),
(4, 'Masmellow D', 'Masmellow A sabor a DD', 8500.00, '', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `rol` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `rol`) VALUES
(1, 'Administrador'),
(2, 'Cliente'),
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rubro`
--

CREATE TABLE `rubro` (
  `id_rubro` int(11) NOT NULL,
  `rubro` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rubro`
--

INSERT INTO `rubro` (`id_rubro`, `rubro`) VALUES
(1, 'Alimentos'),
(2, 'Confiteria'),
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `cedula` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `id_genero` int(11) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `nit_empresa` int(11) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`cedula`, `nombre`, `apellido`, `correo`, `contraseña`, `id_genero`, `id_rol`, `nit_empresa`, `telefono`) VALUES
(11111, 'erika', 'Martinez', 'erica@inaldulces.com.co', '$2a$10$h9zkFGzcZBVk/onv4Yfj.unVN51RD4lRXoycT7FdylapbIrCegkC6', 2, 1, NULL, NULL),
(11112, 'Maria', 'Gómez', 'maria.gomez@adminExample.com', 'contraseña2', 2, 1, NULL, NULL),
(11113, 'Carlos', 'López', 'carlos.lopez@dminExample.com', 'contraseña3', 1, 1, NULL, NULL),
(11114, 'Ana', 'Martínez', 'ana.martinez@dminExample.com', 'contraseña4', 2, 1, NULL, NULL),
(11115, 'Luis', 'Fernández', 'luis.fernandez@example.com', 'contraseña5', 1, 2, 1001, NULL),
(11116, 'Sofía', 'Hernández', 'sofia.hernandez@example.com', 'contraseña6', 2, 2, 1001, NULL),
(11117, 'Pancracia', 'Fernández', 'pancri@example.com', 'contraseña5', 1, 2, 1002, NULL),
(11118, 'Anacleta', 'Hernández', 'anacleta@example.com', 'contraseña6', 2, 2, 1002, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`id_ciudad`);

--
-- Indices de la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id_direccion`),
  ADD KEY `id_ciudad` (`id_ciudad`),
  ADD KEY `cedula_usuario` (`cedula_usuario`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`nit`),
  ADD KEY `id_rubro` (`id_rubro`),
  ADD KEY `cedula_representante_legal` (`cedula_representante_legal`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `id_pedido` (`id_pedido`);

--
-- Indices de la tabla `genero`
--
ALTER TABLE `genero`
  ADD PRIMARY KEY (`id_genero`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `cedula_usuario` (`cedula_usuario`);

--
-- Indices de la tabla `pedido_producto`
--
ALTER TABLE `pedido_producto`
  ADD PRIMARY KEY (`codigo_producto`,`id_pedido`),
  ADD KEY `id_pedido` (`id_pedido`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`codigo_producto`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `rubro`
--
ALTER TABLE `rubro`
  ADD PRIMARY KEY (`id_rubro`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`cedula`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `id_genero` (`id_genero`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `fk_empresa_usuario` (`nit_empresa`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `codigo_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudad` (`id_ciudad`),
  ADD CONSTRAINT `direccion_ibfk_2` FOREIGN KEY (`cedula_usuario`) REFERENCES `usuario` (`cedula`);

--
-- Filtros para la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `empresa_ibfk_1` FOREIGN KEY (`id_rubro`) REFERENCES `rubro` (`id_rubro`),
  ADD CONSTRAINT `empresa_ibfk_2` FOREIGN KEY (`cedula_representante_legal`) REFERENCES `usuario` (`cedula`);

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`cedula_usuario`) REFERENCES `usuario` (`cedula`);

--
-- Filtros para la tabla `pedido_producto`
--
ALTER TABLE `pedido_producto`
  ADD CONSTRAINT `pedido_producto_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`),
  ADD CONSTRAINT `pedido_producto_ibfk_2` FOREIGN KEY (`codigo_producto`) REFERENCES `producto` (`codigo_producto`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_empresa_usuario` FOREIGN KEY (`nit_empresa`) REFERENCES `empresa` (`nit`),
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_genero`) REFERENCES `genero` (`id_genero`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
