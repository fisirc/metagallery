CREATE TABLE IF NOT EXISTS "Usuario" (
	"id" serial NOT NULL UNIQUE,
	"estado_mora" bigint NOT NULL,
	"plan" bigint NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"correo" varchar(255) NOT NULL,
	"codigo_postal" varchar(255) NOT NULL,
	"pwd_hash" varchar(255) NOT NULL,
	"pwd_salt" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PlanSuscripción" (
	"id" serial NOT NULL UNIQUE,
	"costo" numeric(10,0) NOT NULL,
	"periodo_cobro" bigint NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Galeria" (
	"id" serial NOT NULL UNIQUE,
	"estado_despliegue" bigint NOT NULL,
	"usuario" bigint NOT NULL,
	"insight" bigint NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Billing" (
	"id" serial NOT NULL UNIQUE,
	"plan" bigint NOT NULL,
	"usuario" bigint NOT NULL,
	"fecha_pago" date NOT NULL,
	"monto_pago" numeric(10,0) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Multimedia" (
	"id" serial NOT NULL UNIQUE,
	"estado_multimedia" bigint NOT NULL,
	"galeria" bigint NOT NULL,
	"tamaño" bigint NOT NULL,
	"url" varchar(255) NOT NULL,
	"extension" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Insight" (
	"id" serial NOT NULL UNIQUE,
	"pico_max_usuarios" bigint NOT NULL,
	"area_galeria_mas_frecuentada" bigint NOT NULL,
	"max_interaccion_elemento" bigint NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EstadoDeDespliegue" (
	"id" serial NOT NULL UNIQUE,
	"nombre_estado" varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EstadoDeMora" (
	"id" serial NOT NULL UNIQUE,
	"nombre_estado" varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EstadoMultimedia" (
	"id" serial NOT NULL UNIQUE,
	"nombre_estado" varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_fk1" FOREIGN KEY ("estado_mora") REFERENCES "EstadoDeMora"("id");

ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_fk2" FOREIGN KEY ("plan") REFERENCES "PlanSuscripción"("id");

ALTER TABLE "Galeria" ADD CONSTRAINT "Galeria_fk1" FOREIGN KEY ("estado_despliegue") REFERENCES "EstadoDeDespliegue"("id");

ALTER TABLE "Galeria" ADD CONSTRAINT "Galeria_fk2" FOREIGN KEY ("usuario") REFERENCES "Usuario"("id");

ALTER TABLE "Galeria" ADD CONSTRAINT "Galeria_fk3" FOREIGN KEY ("insight") REFERENCES "Insight"("id");
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_fk1" FOREIGN KEY ("plan") REFERENCES "PlanSuscripción"("id");

ALTER TABLE "Billing" ADD CONSTRAINT "Billing_fk2" FOREIGN KEY ("usuario") REFERENCES "Usuario"("id");
ALTER TABLE "Multimedia" ADD CONSTRAINT "Multimedia_fk1" FOREIGN KEY ("estado_multimedia") REFERENCES "EstadoMultimedia"("id");

ALTER TABLE "Multimedia" ADD CONSTRAINT "Multimedia_fk2" FOREIGN KEY ("galeria") REFERENCES "Galeria"("id");



