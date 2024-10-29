CREATE TABLE `visitors` (
  `id` INCREMENT PRIMARY KEY,
  `dni_type_id` integer,
  `dni_number` integer,
  `first_name` STRING,
  `last_name` STRING,
  `contact_number_prefix_id` integer,
  `contact_number` STRING
);

CREATE TABLE `visits` (
  `id` increment PRIMARY KEY,
  `visitor_id` integer,
  `visit_type_id` integer,
  `entity_id` integer,
  `administrative_unit_id` integer,
  `area_id` integer,
  `direction_id` integer,
  `visit_date` DATE,
  `entry_type` STRING,
  `vehicle_pate` STRING,
  `vehicle_model` STRING,
  `visit_reason` STRING
);

CREATE TABLE `visit_types` (
  `id` increment PRIMARY KEY,
  `name` STRING
);

CREATE TABLE `visitor_companies` (
  `id` increment PRIMARY KEY,
  `visitor_id` integer,
  `company_id` integer
);

CREATE TABLE `alerts` (
  `id` increment PRIMARY KEY,
  `reason_alert` STRING,
  `visitor_id` integer
);

CREATE TABLE `companies` (
  `id` increment PRIMARY KEY,
  `name` STRING
);

CREATE TABLE `numbers_prefix` (
  `id` VARCHAR(10),
  `code` VARCHAR(8)
);

CREATE TABLE `dnis_type` (
  `id` integer,
  `name` STRING(15),
  `abbreviation` STRING(5)
);

CREATE TABLE `entities` (
  `id` integer,
  `name` STRING
);

CREATE TABLE `administrative_units` (
  `id` integer,
  `name` STRING,
  `organization_id` integer
);

CREATE TABLE `directions` (
  `id` integer,
  `name` STRING,
  `administrative_unit_id` integer
);

CREATE TABLE `areas` (
  `id` integer,
  `name` STRING,
  `directions_id` integer,
  `administrative_units_id` integer
);

ALTER TABLE `visitors` ADD FOREIGN KEY (`dni_type_id`) REFERENCES `dnis_type` (`id`);

ALTER TABLE `visitors` ADD FOREIGN KEY (`contact_number_prefix_id`) REFERENCES `numbers_prefix` (`id`);

ALTER TABLE `visits` ADD FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`id`);

ALTER TABLE `visits` ADD FOREIGN KEY (`visit_type_id`) REFERENCES `visit_types` (`id`);

ALTER TABLE `visits` ADD FOREIGN KEY (`entity_id`) REFERENCES `entities` (`id`);

ALTER TABLE `visits` ADD FOREIGN KEY (`administrative_unit_id`) REFERENCES `administrative_units` (`id`);

ALTER TABLE `visits` ADD FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`);

ALTER TABLE `visits` ADD FOREIGN KEY (`direction_id`) REFERENCES `directions` (`id`);

ALTER TABLE `visitor_companies` ADD FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`id`);

ALTER TABLE `visitor_companies` ADD FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

ALTER TABLE `alerts` ADD FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`id`);

ALTER TABLE `administrative_units` ADD FOREIGN KEY (`organization_id`) REFERENCES `entities` (`id`);

ALTER TABLE `directions` ADD FOREIGN KEY (`administrative_unit_id`) REFERENCES `administrative_units` (`id`);

ALTER TABLE `areas` ADD FOREIGN KEY (`directions_id`) REFERENCES `directions` (`id`);

ALTER TABLE `areas` ADD FOREIGN KEY (`administrative_units_id`) REFERENCES `administrative_units` (`id`);
