import React, { useState } from "react";

const translations = {
  ru: {
    brandAlt: "KYRKYM Logo",
    nav: {
      price: "Прайс",
      gallery: "Галерея",
      booking: "Запись",
      contact: "Контакты",
    },
    hero: {
      title: "ФОРМА. СТИЛЬ. ТОЧНОСТЬ.",
      sub: "Тёмный интерьер, аккуратные линии, внимание к деталям.",
    },
    btnBook: "ЗАПИСАТЬСЯ",
    btnGallery: "ГАЛЕРЕЯ",
    priceTitle: "Прайс",
    galleryTitle: "Галерея",
    bookingTitle: "ДЕТАЛЬНАЯ ЗАПИСЬ",
    contactTitle: "КОНТАКТЫ",
    placeholders: {
      name: "Имя*",
      phone: "Телефон*",
      email: "E-mail (необязательно)",
      service: "Выберите услугу (необязательно)",
      date: "Дата (необязательно)",
      time: "Время (необязательно)",
      notes: "Комментарий (необязательно)",
      agree: "Я согласен на обработку персональных данных (необязательно)",
    },
    confirm: "Подтвердить запись",
    clear: "Очистить",
    doneAlert: "Заявка готова — выберите действие",
    currency: "сом",
    services: "Основные услуги",
    footer: "Так и красиво",
  },
  ky: {
    brandAlt: "KYRKYM Логотиби",
    nav: {
      price: "Баалар",
      gallery: "Галерея",
      booking: "Жазылуу",
      contact: "Байланышуу",
    },
    hero: {
      title: "ФОРМА. СТИЛЬ. ТАКТЫК.",
      sub: "Караңгы интерьер, тыкан сызыктар, ар бир деталга көңүл буруу.",
    },
    btnBook: "ЖАЗЫЛУУ",
    btnGallery: "ГАЛЕРЕЯ",
    priceTitle: "Прайс-баракча",
    galleryTitle: "Галерея",
    bookingTitle: "ТОЛУК ЖАЗЫЛУУ",
    contactTitle: "БАЙЛАНЫШТАР",
    placeholders: {
      name: "Атыңыз*",
      phone: "Телефон номериңиз*",
      email: "E-mail (милдеттүү эмес)",
      service: "Кызматты тандаңыз (милдеттүү эмес)",
      date: "Күнү (милдеттүү эмес)",
      time: "Убактысы (милдеттүү эмес)",
      notes: "Түшүндүрмө (милдеттүү эмес)",
      agree: "Жеке маалыматтарды иштетүүгө макулмун",
    },
    confirm: "Жазууну ырастоо",
    clear: "Тазалоо",
    doneAlert: "Өтүнмө даяр — аракетти тандаңыз",
    currency: "сом",
    services: "Негизги кызматтар",
    footer: "Сапат жана сулуулук",
  },
};

const priceData = {
  main: [
    { name: "Мужская стрижка", price: "400" },
    { name: "Окантовка", price: "200" },
    { name: "Детская стрижка (до 12лет)", price: "300" },
    { name: "Бритьё на лысо (машинкой/лезвием)", price: "150/400" },
    { name: "Моделирование бороды", price: "300" },
  ],
};

const images = [
  "photoinst1.png",
  "photoinst2.png",
  "photoinst3.png",
  "photoinst4.png",
  "photoinst5.png",
];

const WorkingHours = ({ schedule }) => {
  const total = 24 * 60;
  return (
    <div
      style={{
        background: "#0f0f10",
        padding: 14,
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <h4 style={{ margin: "0 0 10px" }}>Рабочее время</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 8,
          alignItems: "center",
        }}
      >
        {schedule.map((s, i) => {
          const [fh, fm] = s.from.split(":").map(Number);
          const [th, tm] = s.to.split(":").map(Number);
          const fromMin = fh * 60 + fm;
          const toMin = th * 60 + tm;
          const leftPct = (fromMin / total) * 100;
          const widthPct = Math.max(1, ((toMin - fromMin) / total) * 100);
          return (
            <div key={i} style={{ fontSize: 13, color: "#d0d0d0" }}>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 6,
                  textAlign: "center",
                }}
              >
                {s.day}
              </div>
              <div
                style={{
                  height: 10,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 6,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
                    borderRadius: 6,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#9a9a9a",
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                {s.from}–{s.to}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Home = () => {
  const [lang, setLang] = useState("ru");
  const t = translations[lang];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: "",
    agree: false,
  });

  const [showConfirmPanel, setShowConfirmPanel] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const workingSchedule = [
    { day: "Пн", from: "10:00", to: "21:00" },
    { day: "Вт", from: "10:00", to: "21:00" },
    { day: "Ср", from: "10:00", to: "21:00" },
    { day: "Чт", from: "10:00", to: "21:00" },
    { day: "Пт", from: "10:00", to: "21:00" },
    { day: "Сб", from: "10:00", to: "21:00" },
    { day: "Вс", from: "10:00", to: "21:00" },
  ];

  const contactCallNumber = "+996502634977";
  const contactDisplayNumber = "+996 707 041 002";
  const instagram = "https://instagram.com/kyrkym_barbershop";

  const videoFiles = [
    "/video/inst1.mp4",
    "/video/inst2.mp4",
    "/video/inst3.mp4",
    "/video/inst4.mp4",
    "/video/inst6.mp4",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return lang === "ru" ? "Введите имя" : "Атыңызды киргизиңиз";
    if (!form.phone.trim()) return lang === "ru" ? "Введите телефон" : "Телефонду киргизиңиз";
    return null;
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);
    const payload = { ...form };
    setSubmittedData(payload);
    setShowConfirmPanel(true);
  };

  const makeWhatsAppLink = (data) => {
    const lines = ["Новая заявка с сайта KYRKYM:"];
    if (data.name && data.name.trim()) lines.push(`Имя: ${data.name.trim()}`);
    if (data.phone && data.phone.trim()) lines.push(`Телефон: ${data.phone.trim()}`);
    if (data.service && data.service.trim()) lines.push(`Услуга: ${data.service.trim()}`);
    if (data.date && data.date.trim()) lines.push(`Дата: ${data.date.trim()}`);
    if (data.time && data.time.trim()) lines.push(`Время: ${data.time.trim()}`);
    if (data.notes && data.notes.trim()) lines.push(`Комментарий: ${data.notes.trim()}`);
    const text = encodeURIComponent(lines.join("\n"));
    const plainNum = contactCallNumber.replace(/[^\d]/g, "");
    return `https://wa.me/${plainNum}?text=${text}`;
  };

  const clearForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      service: "",
      date: "",
      time: "",
      notes: "",
      agree: false,
    });
    setShowConfirmPanel(false);
    setSubmittedData(null);
  };

  return (
    <>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;background:#070707;color:#f5f5f5}
        a{color:inherit;text-decoration:none}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        nav{position:fixed;left:0;right:0;top:0;z-index:40;padding:12px 0;background:linear-gradient(180deg,rgba(0,0,0,0.65),rgba(0,0,0,0.25));border-bottom:1px solid rgba(255,255,255,0.04)}
        .nav-inner{display:flex;align-items:center;justify-content:space-between}
        .brand{display:flex;gap:12px;align-items:center}
        .brand img{height:36px;width:36px;border-radius:8px;object-fit:cover}
        .nav-links{display:flex;gap:18px;align-items:center}
        .nav-links a{ font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial; font-weight:700; font-size:15px; color:#fff; opacity:0.95; text-decoration:none }
        .hero{min-height:56vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 0 40px;background-image:url('https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1600&q=80');background-size:cover;background-position:center;position:relative}
        .hero::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.7));}
        .hero-inner{position:relative;z-index:2;padding:20px}
        .hero-title{font-family:Playfair Display,serif;font-size:clamp(26px,6vw,44px);line-height:0.95;margin:0}
        .hero-sub{color:#d0d0d0;margin-top:12px;margin-bottom:18px;font-size:1.02rem;max-width:900px;margin-left:auto;margin-right:auto}
        .btn-primary{background:#fff;color:#000;padding:10px 24px;border-radius:8px;font-weight:700;border:none;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
        section{padding:56px 0}
        .section-title{font-family:Playfair Display,serif;font-size:1.6rem;margin:0 0 12px}
        .divider{width:90px;height:2px;background:#fff;margin:18px auto 22px;opacity:0.9}
        .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
        .card{background:#0f0f10;padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,0.03)}
        .muted{color:#9a9a9a}
        .gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .gallery-grid img{width:100%;height:220px;object-fit:cover;border-radius:8px;filter:grayscale(80%);transition:all .28s}
        .gallery-grid img:hover{filter:none;transform:scale(1.02)}
        * {box-sizing: border-box;}
        body {margin: 0;font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;background: #070707;color: #f5f5f5;}
        a {color: inherit;text-decoration: none;}
        .container {max-width: 1200px;margin: 0 auto;padding: 0 20px;}
        nav {position: fixed;top: 0;left: 0;right: 0;z-index: 40;padding: 12px 0;background: linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.25));border-bottom: 1px solid rgba(255,255,255,0.05);}
        .nav-inner {display: flex;justify-content: space-between;align-items: center;}
        .brand {display: flex;align-items: center;gap: 12px;}
        .brand img {width: 36px;height: 36px;border-radius: 8px;object-fit: cover;}
        .nav-links {display: flex;gap: 20px;align-items: center;}
        .nav-links a {font-weight: 700;font-size: 15px;opacity: 0.9;transition: opacity 0.2s ease, transform 0.2s ease;}
        .nav-links a:hover {opacity: 1;transform: translateY(-1px);}
        .hero {min-height: 56vh;display: flex;justify-content: center;align-items: center;text-align: center;padding: 100px 0 40px;background-image: url("https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1600&q=80");background-size: cover;background-position: center;position: relative;}
        .hero::after {content: "";position: absolute;inset: 0;background: linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75));}
        .hero-inner {position: relative;z-index: 2;padding: 20px;}
        .hero-title {font-family: "Playfair Display", serif;font-size: clamp(28px, 5vw, 46px);margin: 0;}
        .hero-sub {margin: 12px auto 18px;max-width: 900px;color: #d0d0d0;}
        section {padding: 56px 0;}
        .section-title {font-family: "Playfair Display", serif;font-size: 1.6rem;margin-bottom: 12px;}
        .divider {width: 90px;height: 2px;background: #fff;margin: 18px auto 22px;opacity: 0.9;}
        .gallery-grid {display: grid;grid-template-columns: repeat(6, 1fr);grid-auto-rows: 160px;gap: 12px;margin-top: 12px;}
        .gallery-item {position: relative;overflow: hidden;border-radius: 10px;background: #0b0b0b;box-shadow: 0 6px 18px rgba(0,0,0,0.45);}
        .gallery-item img {position: absolute;inset: 0;width: 100%;height: 100%;object-fit: cover;transition: transform 0.35s ease, filter 0.35s ease;filter: grayscale(60%) contrast(1.05);}
        .gallery-item:hover img {transform: scale(1.05);filter: grayscale(0%);}
        .gallery-item.featured {grid-column: span 4;}
        .gallery-item:not(.featured) {grid-column: span 2;}
        .video-grid {display: grid;grid-template-columns: repeat(3, 1fr);gap: 12px;margin-top: 12px;}
        .video-cell {position: relative;overflow: hidden;border-radius: 10px;background: #000;padding-top: 177.78%;}
        .video-cell video {position: absolute;inset: 0;width: 100%;height: 100%;object-fit: cover;}
        .booking {max-width: 920px;margin: 20px auto 0;}
        .form-row {display: flex;gap: 12px;}
        .form-row .col {flex: 1;}
        input, select, textarea {width: 100%;padding: 12px;border-radius: 8px;border: 1px solid rgba(255,255,255,0.06);background: #070707;color: #fff;}
        textarea {min-height: 100px;}
        .submit {background: #fff;color: #000;padding: 12px 18px;border-radius: 8px;border: none;font-weight: 700;cursor: pointer;}
        footer {padding: 30px 0;text-align: center;color: #9a9a9a;border-top: 1px solid rgba(255,255,255,0.03);}
        @media (max-width: 600px) {
          nav {padding: 8px 0;}
          .desktop-nav {display: none;}
          .gallery-grid {grid-template-columns: repeat(2, 1fr);grid-auto-rows: 160px;}
          .gallery-item.featured {grid-column: span 2;}
          .gallery-item:not(.featured) {grid-column: span 1;}
          .video-grid {grid-template-columns: repeat(6, 1fr);}
          .video-cell:nth-child(1), .video-cell:nth-child(2), .video-cell:nth-child(3) {grid-column: span 2;}
          .video-cell:nth-child(4), .video-cell:nth-child(5) {grid-column: span 3;}
        }
      `}</style>

      <nav>
        <div className="container nav-inner">
          <div className="brand">
            <a
              href="#hero"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18 }}>
                KYRKYM
              </div>
            </a>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="nav-links desktop-nav">
              <a href="#booking">{t.nav.booking}</a>
              <a href="#services">{t.priceTitle}</a>
              <a href="#gallery">{t.nav.gallery}</a>
              <a href="#contact">{t.nav.contact}</a>
            </div>

            <div className="nav-links mobile-nav" style={{ display: "none" }}>
              <a href="#services">{t.priceTitle}</a>
              <a href="#booking">{t.nav.booking}</a>
            </div>

            <button
              type="button"
              className="btn-primary language"
              onClick={() => setLang((l) => (l === "ru" ? "ky" : "ru"))}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.06)",
                textDecoration: "none",
                padding: "8px 14px",
              }}
            >
              {lang === "ru" ? "Кыргызча" : "Русский"}
            </button>
          </div>
        </div>
      </nav>

      <header id="hero" className="hero">
        <div className="hero-inner container">
          <h1 className="hero-title">{t.hero.title}</h1>
          <p className="hero-sub">{t.hero.sub}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <a className="btn-primary" href="#booking">
              {t.btnBook}
            </a>
            <a
              className="btn-primary"
              href="#gallery"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {t.btnGallery}
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="booking">
          <div className="container booking">
            <h2 className="section-title">{t.bookingTitle}</h2>
            <div className="divider" />

            <form onSubmit={handleBooking}>
              <div className="form-row" style={{ marginBottom: 12 }}>
                <div className="col">
                  <input name="name" value={form.name} onChange={handleChange} placeholder={t.placeholders.name} />
                </div>
                <div className="col">
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder={t.placeholders.phone} />
                </div>
              </div>

              <div className="form-row" style={{ marginBottom: 12 }}>
                <div className="col">
                  <input name="email" value={form.email} onChange={handleChange} placeholder={t.placeholders.email} />
                </div>
                <div className="col">
                  <select name="service" value={form.service} onChange={handleChange}>
                    <option value="">{t.placeholders.service}</option>
                    {priceData.main.map((s, i) => (
                      <option key={i} value={s.name}>
                        {s.name} — {s.price} {t.currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row" style={{ marginBottom: 12 }}>
                <div className="col">
                  <input type="date" name="date" value={form.date} onChange={handleChange} aria-label="Дата" placeholder={t.placeholders.date} />
                </div>
                <div className="col">
                  <select name="time" value={form.time} onChange={handleChange}>
                    <option value="">{t.placeholders.time}</option>
                    <option>10:00</option>
                    <option>11:00</option>
                    <option>12:00</option>
                    <option>13:00</option>
                    <option>14:00</option>
                    <option>15:00</option>
                    <option>16:00</option>
                    <option>17:00</option>
                    <option>18:00</option>
                    <option>19:00</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder={t.placeholders.notes} />
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="submit" type="submit">
                  {t.confirm}
                </button>
                <button
                  className="submit"
                  type="button"
                  onClick={clearForm}
                  style={{ background: "#222", color: "#fff" }}
                >
                  {t.clear}
                </button>
              </div>
            </form>

            {showConfirmPanel && submittedData && (
              <div className="confirm-panel" role="status" aria-live="polite" style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <strong>Заявка готова:</strong>
                  <div style={{ color: "#d0d0d0", marginTop: 6, fontSize: 13, whiteSpace: "pre-wrap" }}>
                    {`Имя: ${submittedData.name}\nТел: ${submittedData.phone}`}
                    {submittedData.service ? `\nУслуга: ${submittedData.service}` : ""}
                    {submittedData.date ? `\nДата: ${submittedData.date}` : ""}
                    {submittedData.time ? ` / ${submittedData.time}` : ""}
                    {submittedData.notes ? `\nКомментарий: ${submittedData.notes}` : ""}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <a
                    className="submit"
                    href={`tel:${contactCallNumber.replace(/\s+/g, "")}`}
                    style={{ textDecoration: "none" }}
                  >
                    Позвонить
                  </a>

                  <a
                    className="submit"
                    href={makeWhatsAppLink(submittedData)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    WhatsApp
                  </a>

                  <button
                    onClick={() => {
                      setShowConfirmPanel(false);
                      setSubmittedData(null);
                    }}
                    style={{
                      background: "#222",
                      color: "#fff",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "none",
                    }}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="services">
          <div className="container">
            <h2 className="section-title">{t.priceTitle}</h2>
            <div className="divider" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
              <div>
                <h3 style={{ marginTop: 0 }}>{t.services}</h3>
                <div className="cards" style={{ marginBottom: 12 }}>
                  {priceData.main.map((p, i) => (
                    <div className="card" key={i}>
                      <h4 style={{ margin: "0 0 16px" }}>{p.name}</h4>
                      <p style={{ margin: 0 }}>
                        <strong>
                          {p.price} {t.currency}
                        </strong>
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <WorkingHours schedule={workingSchedule} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="gallery" style={{ background: "#050505" }}>
          <div className="container">
            <h2 className="section-title">{t.galleryTitle}</h2>
            <div className="divider" />
            <p className="muted" style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 18px" }}>
              Подборка наших работ и интерьера. Нажми для увеличения.
            </p>
            <div className="gallery-grid" aria-hidden={false}>
              {images.map((file, i) => (
                <div key={file} className={`gallery-item ${i === 0 ? "featured" : ""}`} aria-label={`gallery-${i}`}>
                  <img src={`/photo/${file}`} alt={`gallery-${i}`} />
                </div>
              ))}
            </div>
            <div className="video-grid" style={{ marginTop: 12 }}>
              {videoFiles.map((src, idx) => (
                <div className="video-cell" key={idx}>
                  <video src={src} controls playsInline />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" style={{ background: "#070707" }}>
          <div className="container">
            <h2 className="section-title">{t.contactTitle}</h2>
            <div className="divider" />
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: "1 1 320px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>
                    <strong>Instagram:</strong>{" "}
                    <a href={instagram} target="_blank" rel="noreferrer">
                      @kyrkym_barbershop
                    </a>
                  </div>
                  <div>
                    <strong>Телефон:</strong>{" "}
                    <a href={`tel:${contactDisplayNumber.replace(/\s+/g, "")}`}>{contactDisplayNumber}</a>
                  </div>
                  <div>
                    <strong>Локация:</strong> Город Ош, село Эркин
                  </div>
                  <div className="muted" style={{ marginTop: 8 }}>
                    Для подтверждений/WA используется {contactCallNumber}
                  </div>
                </div>
              </div>

              <div style={{ flex: "1 1 420px" }}>
                <iframe
                  title="map"
                  style={{ width: "100%", height: 220, border: 0, borderRadius: 8 }}
                  src="https://maps.google.com/maps?q=40.685695,72.896419&z=13&output=embed"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div>© 2026 BARBERSHOP • {t.footer}</div>
        </div>
      </footer>
    </>
  );
};

export default Home;