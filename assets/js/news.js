export async function fetchNewsByCity (cityName) {
    const query = buildNewsQuery(cityName)

    const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc")
    url.searchParams.set('query', query)
    url.searchParams.set('mode', 'artlist')
    url.searchParams.set('format', 'json')
    url.searchParams.set('maxrecords', '6')
    url.searchParams.set('sort', 'hybridrel')

    const response = await fetch(url)

    if(!response.ok) {
        throw new Error('No fue posible cosultar noticias')
    }

    const data = await response.json()
    const articles = Array.isArray(data.articles) ? data.articles : []

    return articles.map(normalizeArticle).filter(Boolean)
}

function buildNewsQuery (cityName) {
    const cleanCityName = String(cityName || "").trim()

    if(!cleanCityName) {
        return 'Salamanca'
    }

    return `"${cleanCityName}"`
}

function normalizeArticle(article) {
  if (!article?.title || !article?.url) return null;
  return {
    title: article.title,
    url: article.url,
    image: article.socialimage || "",
    domain: article.domain || "Fuente no disponible",
    language: article.language || "",
    sourceCountry: article.sourcecountry || "",
    seenDate: article.seendate || ""
  };
}

export function formatNewsDate(value) {
    if (!value) return "Fecha no disponible";
    const normalized = String(value).replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,"$1-$2-$3T$4:$5:$6Z");
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

export function escapeHtml (value) {
    return String(value || '')
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}