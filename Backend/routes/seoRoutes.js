const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

// 1. Dynamic robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.SITE_URL || 'https://saivillabadlapur.com';

  const robotsContent = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin',
    'Disallow: /admin/*',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n');

  res.header('Content-Type', 'text/plain');
  res.send(robotsContent);
});

// 2. Dynamic XML Sitemap (Includes pages + live Cloudinary gallery images)
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://saivillabadlapur.com';
    const currentDate = new Date().toISOString().split('T')[0];

    // Fetch dynamic gallery photos from MongoDB
    let photos = [];
    try {
      photos = await Gallery.find().select('imageUrl title updatedAt');
    } catch {
      photos = [];
    }

    // Static site routes
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/#packages', priority: '0.9', changefreq: 'weekly' },
      { url: '/#booking', priority: '0.9', changefreq: 'daily' },
      { url: '/#menu', priority: '0.8', changefreq: 'weekly' },
      { url: '/#gallery', priority: '0.8', changefreq: 'weekly' },
      { url: '/#contact', priority: '0.7', changefreq: 'monthly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add main landing and sections
    staticPages.forEach((page) => {
      xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });

    // Add image sitemap tags for photos
    if (photos.length > 0) {
      xml += `  <url>
    <loc>${baseUrl}/#gallery</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>\n`;

      photos.forEach((p) => {
        xml += `    <image:image>
      <image:loc>${p.imageUrl}</image:loc>
      <image:title>${p.title || 'Sai Villa Luxury Farmhouse Badlapur'}</image:title>
      <image:caption>Luxury farmhouse stay with private pool and authentic Maharashtrian food in Badlapur</image:caption>
    </image:image>\n`;
      });

      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// 3. Structured Data API (Schema.org / JSON-LD for Search Engines)
router.get('/api/seo/structured-data', (req, res) => {
  const baseUrl = process.env.SITE_URL || 'https://saivillabadlapur.com';

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Sai Villa Badlapur',
    description:
      'Luxury private farmhouse getaway in Badlapur with private swimming pool, AC stone bedrooms, and authentic Maharashtrian meals from ₹1,500/person.',
    url: baseUrl,
    telephone: '+919820000000',
    priceRange: '₹1,500 - ₹1,800 per person',
    image: [
      'https://img.rocket.new/generatedImages/rocket_gen_img_1b287f7d5-1786294145354.png',
      'https://images.unsplash.com/photo-1675271875600-ec62be271966',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Badlapur Rural',
      addressLocality: 'Badlapur, Thane District',
      addressRegion: 'Maharashtra',
      postalCode: '421503',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.1667,
      longitude: 73.224,
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Private Swimming Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Air Conditioned Stone Bedrooms', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Authentic 3-Time Maharashtrian Meals', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Lush Garden & Lawn', value: true },
    ],
    checkinTime: '10:00',
    checkoutTime: '10:00',
  };

  res.status(200).json({ success: true, schema: schemaData });
});

module.exports = router;