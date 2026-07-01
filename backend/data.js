const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "bazar.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS markets (
    id       INTEGER PRIMARY KEY,
    name     TEXT NOT NULL,
    category TEXT NOT NULL,
    lat      REAL NOT NULL,
    lng      REAL NOT NULL
  );
  CREATE TABLE IF NOT EXISTS products (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    market_id  INTEGER NOT NULL,
    name       TEXT NOT NULL,
    price      REAL NOT NULL,
    unit       TEXT NOT NULL DEFAULT 'ədəd',
    category   TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (market_id) REFERENCES markets(id)
  );
  CREATE TABLE IF NOT EXISTS couriers (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0,
    lat     REAL NOT NULL,
    lng     REAL NOT NULL,
    busy    INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS orders (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    market_id    INTEGER NOT NULL,
    courier_id   INTEGER,
    status       TEXT NOT NULL DEFAULT 'yeni',
    total        REAL NOT NULL,
    delivery_fee REAL NOT NULL DEFAULT 2.0,
    customer_lat REAL NOT NULL,
    customer_lng REAL NOT NULL,
    customer_addr TEXT NOT NULL DEFAULT '',
    courier_lat  REAL,
    courier_lng  REAL,
    created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id)  REFERENCES markets(id),
    FOREIGN KEY (courier_id) REFERENCES couriers(id)
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    qty        INTEGER NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

if (db.prepare("SELECT COUNT(*) c FROM markets").get().c === 0) {
  const addMarket = db.prepare("INSERT INTO markets (id,name,category,lat,lng) VALUES (?,?,?,?,?)");
  addMarket.run(1, "FreshMart",   "Supermarket",    40.4093, 49.8671);
  addMarket.run(2, "GreenBasket", "Üzvi məhsullar", 40.4120, 49.8700);
  addMarket.run(3, "QuickShop",   "Yaxın market",   40.4060, 49.8640);

  const addP = db.prepare("INSERT INTO products (market_id,name,price,unit,category) VALUES (?,?,?,?,?)");
  addP.run(1,"Süd (1L)",          2.50,"litr","Süd məhsulları");
  addP.run(1,"Yumurta (10 ədəd)", 3.80,"qab", "Süd məhsulları");
  addP.run(1,"Kəsmik",            1.90,"ədəd","Süd məhsulları");
  addP.run(1,"Çörək",             0.60,"ədəd","Çörək");
  addP.run(1,"Lavaş",             0.80,"ədəd","Çörək");
  addP.run(1,"Pomidor (1kq)",     1.50,"kq",  "Tərəvəz");
  addP.run(1,"Xiyar (1kq)",       1.20,"kq",  "Tərəvəz");
  addP.run(1,"Kartof (2kq)",      2.00,"kq",  "Tərəvəz");
  addP.run(1,"Alma (1kq)",        2.20,"kq",  "Meyvə");
  addP.run(1,"Banan (1kq)",       2.80,"kq",  "Meyvə");
  addP.run(1,"Toyuq döşü (1kq)",  7.50,"kq",  "Ət");
  addP.run(1,"Qiymə (0.5kq)",     5.00,"kq",  "Ət");
  addP.run(1,"Makaron",           1.30,"ədəd","Baqqaliyyə");
  addP.run(1,"Düyü (1kq)",        2.10,"kq",  "Baqqaliyyə");
  addP.run(1,"Ay-Ay (1L)",        1.40,"litr","İçki");

  addP.run(2,"Üzvi pomidor (1kq)",3.20,"kq",  "Tərəvəz");
  addP.run(2,"Üzvi alma (1kq)",   4.50,"kq",  "Meyvə");
  addP.run(2,"Üzvi süd (1L)",     4.00,"litr","Süd məhsulları");
  addP.run(2,"Tam taxıl çörəyi",  2.20,"ədəd","Çörək");
  addP.run(2,"Zeytun yağı (0.5L)",8.50,"ədəd","Baqqaliyyə");
  addP.run(2,"Bal (350q)",        6.00,"ədəd","Baqqaliyyə");
  addP.run(2,"Üzvi yumurta (6əd)",4.20,"qab", "Süd məhsulları");
  addP.run(2,"Avokado",           2.50,"ədəd","Meyvə");

  addP.run(3,"Su (1.5L)",         0.70,"ədəd","İçki");
  addP.run(3,"Pepsi (0.5L)",      1.20,"ədəd","İçki");
  addP.run(3,"Çips",              1.50,"ədəd","Qəlyanaltı");
  addP.run(3,"Şokolad",           1.80,"ədəd","Qəlyanaltı");
  addP.run(3,"Sakız",             0.50,"ədəd","Qəlyanaltı");
  addP.run(3,"Pivə (0.5L)",       1.60,"ədəd","İçki");
  addP.run(3,"Süd (0.5L)",        1.40,"litr","Süd məhsulları");
  addP.run(3,"Yumurta (6 ədəd)",  2.20,"qab", "Süd məhsulları");

  const addC = db.prepare("INSERT INTO couriers (name,balance,lat,lng) VALUES (?,?,?,?)");
  addC.run("Amin",   42.50, 40.4100, 49.8680);
  addC.run("Rauf",   28.00, 40.4080, 49.8660);
  addC.run("Seymur", 15.75, 40.4110, 49.8690);

  console.log("✅ Seed tamamlandı");
}

module.exports = db;
