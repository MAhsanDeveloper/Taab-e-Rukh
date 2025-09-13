// import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, canonical, keywords = [], schema }) => {
  return (
     <>
      {/* 🔑 Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* 📱 Mobile Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* 🌐 Open Graph (Facebook / WhatsApp) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* 🐦 Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* 📊 JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </>
  );
};

export default SEO;
