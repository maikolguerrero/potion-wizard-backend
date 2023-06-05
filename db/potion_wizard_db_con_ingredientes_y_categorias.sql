-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-06-2023 a las 17:45:39
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS potion_wizard_db;
USE potion_wizard_db;

--
-- Base de datos: `potion_wizard_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Adivinación y Clarividencia', 'Pociones para obtener conocimiento del futuro y la claridad mental'),
(2, 'Amor y Romance', 'Pociones relacionadas con el amor, la pasión y los sentimientos románticos'),
(3, 'Curación y Sanación', 'Pociones para aliviar enfermedades y promover la curación'),
(4, 'Energía y Vitalidad', 'Pociones para recuperar energía y vitalidad rápidamente.'),
(5, 'Fortaleza y Protección', 'Pociones para fortalecer y proteger al consumidor.'),
(6, 'Ilusiones y Encantamientos', 'Pociones que crean ilusiones y encantamientos visuales.'),
(7, 'Invisibilidad y Camuflaje', 'Pociones para volverse invisible o camuflarse.'),
(8, 'Magia y Hechicería', 'Pociones para potenciar habilidades mágicas y lanzar hechizos.'),
(9, 'Poderes Elementales', 'Pociones para controlar y manipular los elementos naturales.'),
(10, 'Poderes Sobrenaturales', 'Pociones para obtener habilidades sobrenaturales.'),
(11, 'Protección y Defensa', 'Pociones para proteger al consumidor de daños y peligros.'),
(12, 'Sabiduría y Conocimiento', 'Pociones para aumentar la inteligencia y sabiduría del consumidor.'),
(13, 'Sueños y Visiones', 'Pociones que inducen sueños vívidos y visiones proféticas.'),
(14, 'Transformación y Metamorfosis', 'Pociones para cambiar la apariencia o forma física del consumidor.'),
(15, 'Velocidad y Agilidad', 'Pociones que aumentan la velocidad y agilidad del consumidor.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredientes`
--

CREATE TABLE `ingredientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ingredientes`
--

INSERT INTO `ingredientes` (`id`, `nombre`, `cantidad`, `descripcion`) VALUES
(1, 'Escama de sirena', 25, 'Una escama resplandeciente de una sirena utilizada en pociones acuáticas.'),
(2, 'Escamas de dragón', 40, 'Escamas brillantes de dragón con propiedades protectoras.'),
(3, 'Espina de vampiro', 42, 'Una espina afilada de un vampiro utilizado en pociones de fortaleza y energía.'),
(4, 'Lágrima de sirena', 31, 'Una lágrima de una sirena con propiedades curativas y calmantes.'),
(5, 'Mandrágora', 30, 'Una raíz mágica con propiedades curativas.'),
(6, 'Ojo de salamandra', 45, 'Un ojo brillante de una salamandra mágica utilizado en pociones de transformación.'),
(7, 'Ojo de tritón', 30, 'Un ojo de criatura marina utilizado en pociones de clarividencia.'),
(8, 'Pétalos de rosa', 50, 'Pétalos fragantes de rosas utilizados en pociones de amor y belleza.'),
(9, 'Planta nocturna', 12, 'Una planta que solo crece en la oscuridad y se utiliza en pociones de sueño.'),
(10, 'Pluma de cuervo', 40, 'Una pluma oscura de un cuervo que otorga habilidades de comunicación con aves.'),
(11, 'Pluma de fénix', 28, 'Una pluma mágica de un fénix que otorga poderes de escritura y creatividad.'),
(12, 'Polvo de estrellas', 15, 'Polvo brillante recolectado de estrellas fugaces utilizado en pociones de suerte.'),
(13, 'Polvo de hada', 20, 'Polvo mágico recolectado de las alas de las hadas.'),
(14, 'Raíz de mandrágora', 20, 'Una raíz mágica con propiedades alucinógenas y estimulantes.'),
(15, 'Sangre de unicornio', 15, 'Sangre pura de un unicornio, utilizada en pociones de sanación.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pociones`
--

CREATE TABLE `pociones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pociones_categorias`
--

CREATE TABLE `pociones_categorias` (
  `id` int(11) NOT NULL,
  `id_pocion` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pociones_ingredientes`
--

CREATE TABLE `pociones_ingredientes` (
  `id` int(11) NOT NULL,
  `id_pocion` int(11) NOT NULL,
  `id_ingrediente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pociones`
--
ALTER TABLE `pociones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pociones_categorias`
--
ALTER TABLE `pociones_categorias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pocion` (`id_pocion`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `pociones_ingredientes`
--
ALTER TABLE `pociones_ingredientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pocion` (`id_pocion`),
  ADD KEY `id_ingrediente` (`id_ingrediente`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `pociones`
--
ALTER TABLE `pociones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pociones_categorias`
--
ALTER TABLE `pociones_categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pociones_ingredientes`
--
ALTER TABLE `pociones_ingredientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pociones_categorias`
--
ALTER TABLE `pociones_categorias`
  ADD CONSTRAINT `pociones_categorias_ibfk_1` FOREIGN KEY (`id_pocion`) REFERENCES `pociones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pociones_categorias_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pociones_ingredientes`
--
ALTER TABLE `pociones_ingredientes`
  ADD CONSTRAINT `pociones_ingredientes_ibfk_1` FOREIGN KEY (`id_pocion`) REFERENCES `pociones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pociones_ingredientes_ibfk_2` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingredientes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
