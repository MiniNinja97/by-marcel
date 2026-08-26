-- =========================================================
-- PRODUCTS
-- Huvudtabellen för alla produkter som visas i By Marcel.
-- Här ligger produktens grundinformation.
-- Kan användas för både EC, ES och senare egentillverkade produkter.
-- =========================================================

CREATE TABLE products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    material VARCHAR(100) NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    weight DECIMAL(10,2) NOT NULL,

    allows_custom_photo BOOLEAN NOT NULL DEFAULT FALSE,
    allows_custom_text BOOLEAN NOT NULL DEFAULT FALSE,
    allows_font_selection BOOLEAN NOT NULL DEFAULT FALSE,

    is_seasonal BOOLEAN NOT NULL DEFAULT FALSE,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    is_out_of_stock BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- PRODUCT IMAGES
-- Sparar produktens generella bilder.
--
-- Dessa används bland annat som standardbild för produkten.
-- Själva bilden ligger på servern och databasen sparar sökvägen.
-- =========================================================

CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


-- =========================================================
-- PRODUCT VARIANTS
-- Kopplar en By Marcel-produkt till leverantörens artiklar.
--
-- Exempel:
-- EC.SG1
-- + 33x8 cm
-- + med ram
-- -> EC.SG1.01 / SG-01
--
-- options innehåller kombinationen av val som JSON.
-- =========================================================

CREATE TABLE product_variants (
    id VARCHAR(100) PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL,
    supplier_id VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    weight DECIMAL(10,2),
    options JSON NOT NULL,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


-- =========================================================
-- PRODUCT VARIANT IMAGES
-- Bilder som hör till en specifik variant.
--
-- Gör att produktbilden kan ändras när kunden väljer
-- exempelvis storlek, ram, form eller annan variant.
--
-- Exempel:
-- EC.SG1.01 -> /uploads/products/EC.SG1.01.jpg
-- EC.SG1.06 -> /uploads/products/EC.SG1.06.jpg
-- =========================================================

CREATE TABLE product_variant_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    variant_id VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,

    FOREIGN KEY (variant_id)
        REFERENCES product_variants(id)
        ON DELETE CASCADE
);


-- =========================================================
-- PRODUCT OPTIONS
-- Beskriver vilka val en viss produkt erbjuder kunden.
--
-- Exempel:
-- size  -> Storlek
-- frame -> Ram
-- shape -> Form
-- =========================================================

CREATE TABLE product_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL,
    option_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


-- =========================================================
-- PRODUCT OPTION VALUES
-- Möjliga värden för ett produktalternativ.
--
-- Exempel:
--
-- Storlek:
-- 33 x 8 cm
-- 40 x 8 cm
--
-- Ram:
-- true  -> Med ram
-- false -> Utan ram
-- =========================================================

CREATE TABLE product_option_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    option_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    display_value VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,

    FOREIGN KEY (option_id)
        REFERENCES product_options(id)
        ON DELETE CASCADE
);


-- =========================================================
-- PRODUCT TEXT FIELDS
-- Bestämmer vilka egna textfält en produkt har.
--
-- Detta gör att olika produkter kan ha olika antal textrader.
--
-- Exempel EC.SG1:
-- line1 -> Din text
--
-- En annan produkt kan exempelvis ha:
-- line1 -> Rad 1
-- line2 -> Rad 2
-- line3 -> Rad 3
-- line4 -> Rad 4
--
-- max_length kan också skilja mellan fälten.
-- =========================================================

CREATE TABLE product_text_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    placeholder VARCHAR(255) DEFAULT NULL,
    max_length INT NOT NULL DEFAULT 60,
    sort_order INT NOT NULL DEFAULT 0,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


-- =========================================================
-- PRODUCT COLORS
-- Gemensam lista över färger som kan användas på produkter.
--
-- Färgen kan innehålla namn, hexkod och eventuellt pristillägg.
-- =========================================================

CREATE TABLE product_colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hex VARCHAR(20),
    price_modifier DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_special BOOLEAN NOT NULL DEFAULT FALSE
);


-- =========================================================
-- PRODUCT COLOR LINKS
-- Koppling mellan produkter och tillåtna färger.
--
-- Samma färg kan användas av många produkter.
-- Samma produkt kan använda många färger.
-- =========================================================

CREATE TABLE product_color_links (
    product_id VARCHAR(100) NOT NULL,
    color_id INT NOT NULL,

    PRIMARY KEY (product_id, color_id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    FOREIGN KEY (color_id)
        REFERENCES product_colors(id)
        ON DELETE CASCADE
);


-- =========================================================
-- FONTS
-- Gemensam lista över typsnitt kunden kan välja mellan.
-- =========================================================

CREATE TABLE fonts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- =========================================================
-- PRODUCT FONT LINKS
-- Koppling mellan produkter och tillåtna typsnitt.
-- =========================================================

CREATE TABLE product_font_links (
    product_id VARCHAR(100) NOT NULL,
    font_id INT NOT NULL,

    PRIMARY KEY (product_id, font_id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    FOREIGN KEY (font_id)
        REFERENCES fonts(id)
        ON DELETE CASCADE
);


-- =========================================================
-- CUSTOMERS
-- Sparar kundens kontakt- och leveransuppgifter.
-- =========================================================

CREATE TABLE customers (
    id VARCHAR(100) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100)
);


-- =========================================================
-- ORDERS
-- Sparar information om en genomförd order.
--
-- Produkterna i ordern sparas separat i order_items.
-- =========================================================

CREATE TABLE orders (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL,
    total_weight DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,

    status VARCHAR(50) NOT NULL,
    stripe_payment_id VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT
);


-- =========================================================
-- ORDER ITEMS
-- Sparar varje produkt som ingår i en order.
--
-- Informationen sparas som den såg ut vid köptillfället.
-- Om produkten senare ändras påverkas därför inte gamla ordrar.
--
-- supplier_id:
-- Leverantörens artikelnummer för vald variant.
--
-- selected_options:
-- Alla dynamiska produktval.
-- Exempel:
-- {
--   "size": "33 x 8 cm",
--   "frame": "true"
-- }
--
-- custom_texts:
-- Kundens dynamiska textrader.
-- Exempel:
-- {
--   "line1": "STORGATAN",
--   "line2": "12"
-- }
-- =========================================================

CREATE TABLE order_items (
    id VARCHAR(100) PRIMARY KEY,

    order_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(100) NOT NULL,

    product_name VARCHAR(255) NOT NULL,
    supplier_id VARCHAR(100),

    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    weight DECIMAL(10,2) NOT NULL,

    -- Äldre/separata val behålls tills vidare
    selected_size VARCHAR(255),
    selected_shape VARCHAR(255),
    selected_color VARCHAR(255),
    selected_font VARCHAR(255),

    -- Dynamiska produktval
    selected_options JSON,

    -- Personalisering
    custom_photo_url VARCHAR(500),

    -- Äldre textfält behålls tills vidare
    custom_text TEXT,

    -- Nya dynamiska textfält
    custom_texts JSON,

    FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
);