import Link from "next/link";

// not-found не получает params, поэтому текст на трёх языках
export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap">
        <h1>404</h1>
        <p className="empty">
          Sahifa topilmadi · Страница не найдена · Page not found
        </p>
        <Link href="/" className="btn">
          SOFIZAR
        </Link>
      </div>
    </section>
  );
}
